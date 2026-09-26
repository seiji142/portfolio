import { useEffect, useMemo, useRef } from "react";

/**
 * Fondo de agua: simulacion de olas (ecuacion de onda en GPU, WebGL).
 * Canvas fijo transparente DETRAS del contenido: no captura clicks
 * (pointerEvents none, listeners en window). Solo brillos donde hay olas.
 * Origen: demo efecto-agua-canvas-mejor (adaptado: sin three, con
 * prefers-reduced-motion y touch sin bloquear scroll).
 */
export default function WaterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get WebGL context with alpha enabled for transparency
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    }) as WebGLRenderingContext | null;

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Need float textures for the wave simulation
    const floatExt = gl.getExtension("OES_texture_float");
    const halfFloatExt = gl.getExtension("OES_texture_half_float");
    const halfFloatLinear = gl.getExtension("OES_texture_half_float_linear");
    const floatLinear = gl.getExtension("OES_texture_float_linear");

    let textureType: number;
    let useLinear = false;
    if (halfFloatExt) {
      textureType = halfFloatExt.HALF_FLOAT_OES;
      useLinear = !!halfFloatLinear;
    } else if (floatExt) {
      textureType = gl.FLOAT;
      useLinear = !!floatLinear;
    } else {
      console.error("Float textures not supported");
      return;
    }

    // ---------- Shaders ----------

    // Pass-through vertex shader for full-screen quad
    const VS = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 uTexel;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(uTexel.x, 0.0);
        vR = vUv + vec2(uTexel.x, 0.0);
        vT = vUv + vec2(0.0, uTexel.y);
        vB = vUv - vec2(0.0, uTexel.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Wave equation update shader
    // Stores: R = current height, G = previous height
    const WAVE_FS = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPrev;     // R: prev_current, G: prev_prev
      uniform float uDamping;
      void main() {
        float l = texture2D(uPrev, vL).r;
        float r = texture2D(uPrev, vR).r;
        float t = texture2D(uPrev, vT).r;
        float b = texture2D(uPrev, vB).r;
        float current = texture2D(uPrev, vUv).r;
        float previous = texture2D(uPrev, vUv).g;

        // Wave equation: new = (avg of neighbors) * 2 - previous
        float newHeight = (l + r + t + b) * 0.5 - previous;
        newHeight *= uDamping;

        gl_FragColor = vec4(newHeight, current, 0.0, 1.0);
      }
    `;

    // Add a drop / disturbance to the wave field
    const DROP_FS = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uPrev;
      uniform vec2 uPoint;
      uniform float uRadius;
      uniform float uStrength;
      uniform float uAspect;
      void main() {
        vec4 prev = texture2D(uPrev, vUv);
        vec2 diff = vUv - uPoint;
        diff.x *= uAspect;
        float d = length(diff);
        float drop = uStrength * smoothstep(uRadius, 0.0, d);
        gl_FragColor = vec4(prev.r + drop, prev.g, 0.0, 1.0);
      }
    `;

    // Display shader: render ripples as transparent water surface
    const DISPLAY_FS = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uWave;

      void main() {
        // Sample heights of neighbors to compute surface normal
        float hL = texture2D(uWave, vL).r;
        float hR = texture2D(uWave, vR).r;
        float hT = texture2D(uWave, vT).r;
        float hB = texture2D(uWave, vB).r;
        float h  = texture2D(uWave, vUv).r;

        // Surface normal from height gradient
        vec3 normal = normalize(vec3(hL - hR, hB - hT, 0.15));

        // Light coming from upper left
        vec3 lightDir = normalize(vec3(-0.5, 0.7, 1.0));
        vec3 viewDir  = vec3(0.0, 0.0, 1.0);

        // Diffuse + specular highlights (the white shine on water)
        float diffuse = max(dot(normal, lightDir), 0.0);
        vec3 halfDir  = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfDir), 0.0), 80.0);

        // Fresnel - rim lighting on wave edges
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

        // Wave intensity = how much the surface is displaced
        float waveIntensity = abs(h) + length(vec2(hL - hR, hT - hB)) * 2.0;

        // Color: subtle bluish-white tint for the ripples
        vec3 rippleColor = vec3(0.75, 0.88, 1.0);
        vec3 color = rippleColor * (diffuse * 0.3 + spec * 1.4 + fresnel * 0.5);

        // Alpha: only visible where there are ripples
        float alpha = clamp(waveIntensity * 8.0 + spec * 1.2 + fresnel * 0.3, 0.0, 0.95);

        gl_FragColor = vec4(color, alpha);
      }
    `;

    // ---------- Shader compilation helpers ----------

    function compile(type: number, src: string): WebGLShader {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(s));
      }
      return s;
    }

    function program(vs: string, fs: string): WebGLProgram {
      const p = gl!.createProgram()!;
      gl!.attachShader(p, compile(gl!.VERTEX_SHADER, vs));
      gl!.attachShader(p, compile(gl!.FRAGMENT_SHADER, fs));
      gl!.linkProgram(p);
      if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) {
        console.error(gl!.getProgramInfoLog(p));
      }
      return p;
    }

    const waveProg = program(VS, WAVE_FS);
    const dropProg = program(VS, DROP_FS);
    const displayProg = program(VS, DISPLAY_FS);

    // ---------- Full-screen quad ----------

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    function bindQuad(prog: WebGLProgram) {
      const loc = gl!.getAttribLocation(prog, "aPosition");
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuffer);
      gl!.enableVertexAttribArray(loc);
      gl!.vertexAttribPointer(loc, 2, gl!.FLOAT, false, 0, 0);
    }

    // ---------- Framebuffer / texture helpers ----------

    function createFBO(w: number, h: number) {
      const tex = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      const filter = useLinear ? gl!.LINEAR : gl!.NEAREST;
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, textureType, null);

      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(
        gl!.FRAMEBUFFER,
        gl!.COLOR_ATTACHMENT0,
        gl!.TEXTURE_2D,
        tex,
        0
      );
      gl!.viewport(0, 0, w, h);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      return { tex, fbo, w, h, texel: [1 / w, 1 / h] as [number, number] };
    }

    function createDoubleFBO(w: number, h: number) {
      let a = createFBO(w, h);
      let b = createFBO(w, h);
      return {
        get read() {
          return a;
        },
        get write() {
          return b;
        },
        swap() {
          const t = a;
          a = b;
          b = t;
        },
        get w() {
          return w;
        },
        get h() {
          return h;
        },
        get texel() {
          return a.texel;
        },
      };
    }

    // ---------- Setup simulation textures ----------

    let SIM_W = 0;
    let SIM_H = 0;
    let waves: ReturnType<typeof createDoubleFBO> | null = null;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas!.clientWidth * dpr);
      const h = Math.floor(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }

      // Simulation runs at lower resolution for performance
      const simScale = 0.5;
      SIM_W = Math.max(64, Math.floor(w * simScale));
      SIM_H = Math.max(64, Math.floor(h * simScale));
      waves = createDoubleFBO(SIM_W, SIM_H);
    }

    resize();
    window.addEventListener("resize", resize);

    // ---------- Pointer / drop handling (window-level: canvas is click-through) ----------

    type Drop = { x: number; y: number; strength: number };
    const queue: Drop[] = [];
    let lastX = -1;
    let lastY = -1;
    let isDown = false;

    // Canvas is fullscreen fixed, so viewport coords map directly to UV
    function pointerToUV(clientX: number, clientY: number) {
      const x = clientX / window.innerWidth;
      const y = 1.0 - clientY / window.innerHeight;
      return { x, y };
    }

    function addDrop(x: number, y: number, strength: number) {
      queue.push({ x, y, strength });
    }

    function onMouseMove(e: MouseEvent) {
      const { x, y } = pointerToUV(e.clientX, e.clientY);
      if (lastX >= 0) {
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Interpolate drops along path so fast movement still draws continuous trail
        const steps = Math.max(1, Math.min(8, Math.floor(dist * 80)));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          addDrop(lastX + dx * t, lastY + dy * t, isDown ? 0.08 : 0.025);
        }
      } else {
        addDrop(x, y, 0.025);
      }
      lastX = x;
      lastY = y;
    }

    function onMouseDown(e: MouseEvent) {
      isDown = true;
      const { x, y } = pointerToUV(e.clientX, e.clientY);
      addDrop(x, y, 0.25);
      lastX = x;
      lastY = y;
    }

    function onMouseUp() {
      isDown = false;
    }

    function onMouseLeave() {
      lastX = -1;
      lastY = -1;
      isDown = false;
    }

    // Touch: passive (never preventDefault) so page scroll keeps working
    function onTouchMove(e: TouchEvent) {
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        const { x, y } = pointerToUV(t.clientX, t.clientY);
        addDrop(x, y, 0.06);
      }
    }

    function onTouchStart(e: TouchEvent) {
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        const { x, y } = pointerToUV(t.clientX, t.clientY);
        addDrop(x, y, 0.25);
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    // ---------- Render loop ----------

    function applyDrop(drop: Drop) {
      if (!waves) return;
      gl!.useProgram(dropProg);
      bindQuad(dropProg);
      gl!.uniform1i(gl!.getUniformLocation(dropProg, "uPrev"), 0);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, waves.read.tex);
      gl!.uniform2f(gl!.getUniformLocation(dropProg, "uPoint"), drop.x, drop.y);
      gl!.uniform1f(gl!.getUniformLocation(dropProg, "uRadius"), 0.012);
      gl!.uniform1f(gl!.getUniformLocation(dropProg, "uStrength"), drop.strength);
      gl!.uniform1f(gl!.getUniformLocation(dropProg, "uAspect"), SIM_W / SIM_H);
      gl!.uniform2f(
        gl!.getUniformLocation(dropProg, "uTexel"),
        waves.texel[0],
        waves.texel[1]
      );
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, waves.write.fbo);
      gl!.viewport(0, 0, waves.w, waves.h);
      gl!.disable(gl!.BLEND);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      waves.swap();
    }

    function step() {
      if (!waves) return;
      gl!.useProgram(waveProg);
      bindQuad(waveProg);
      gl!.uniform1i(gl!.getUniformLocation(waveProg, "uPrev"), 0);
      gl!.uniform1f(gl!.getUniformLocation(waveProg, "uDamping"), 0.992);
      gl!.uniform2f(
        gl!.getUniformLocation(waveProg, "uTexel"),
        waves.texel[0],
        waves.texel[1]
      );
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, waves.read.tex);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, waves.write.fbo);
      gl!.viewport(0, 0, waves.w, waves.h);
      gl!.disable(gl!.BLEND);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      waves.swap();
    }

    function render() {
      if (!waves) return;
      gl!.useProgram(displayProg);
      bindQuad(displayProg);
      gl!.uniform1i(gl!.getUniformLocation(displayProg, "uWave"), 0);
      gl!.uniform2f(
        gl!.getUniformLocation(displayProg, "uTexel"),
        waves.texel[0],
        waves.texel[1]
      );
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, waves.read.tex);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);

      // CRITICAL: clear with full transparency (RGBA = 0,0,0,0)
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      // Enable alpha blending so transparent pixels show the page background
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    let raf = 0;
    function loop() {
      // Apply queued drops
      while (queue.length > 0) {
        applyDrop(queue.shift()!);
      }
      // Two physics steps per frame for smoother propagation
      step();
      step();
      render();
      raf = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
        display: "block",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
