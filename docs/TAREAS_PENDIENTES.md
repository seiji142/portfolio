# Tareas Pendientes - Portfolio AI Chat
Ultima actualizacion: 20/09/2026

---

## CRITICO

### 1. Datos de contacto personales
- [x] Actualizar telefono real en portfolio.ts (linea 11) → 098298339
- [x] Agregar fotoUrl con URL de foto personal → /images/you26.jpg
- [x] Agregar cvUrl con enlace a CV → /cv-seiji-tsumura.html

### 2. Redes sociales
- [x] Actualizar github con usuario real → https://github.com/seiji142
- [x] LinkedIn oculto por ahora
- [x] Twitter no aplica
- [x] Website es esta página, pendiente de subir a hosting

### 3. Textos personales
- [x] Personalizar tagline en portfolio.ts (linea 14-15)
- [x] Personalizar sobreMi en portfolio.ts (linea 17-18)

---

## MEDIO

### 4. Skills / Habilidades
- [x] Revisar niveles de Frontend segun habilidades reales
- [x] Revisar niveles de Backend segun habilidades reales
- [x] Revisar niveles de Herramientas segun habilidades reales
- [x] Agregar o eliminar skills segun aplique

### 5. Proyectos
- [x] Reemplazar proyectos ficticios por proyectos reales (4 proyectos)
- [x] Agregar URLs reales de GitHub para cada proyecto
- [x] Agregar imagenes reales para cada proyecto (generadas con IA y divididas en `scripts/crop_projects.py`)

### 6. Experiencia
- [x] Reemplazar experiencia por datos reales del CV
- [x] Agregar empleo Toque y Toque (2022-2024)
- [x] Agregar educacion real (Universidad ORT, IBM)
- [x] Actualizar periodos con fechas reales

---

## BAJO

### 7. Asistente virtual — Plan Opcion B (20/09/2026)
- [x] Decision nombre: mantener "Lewinsky" (femenino, coincide con "la asistente" en chatEngine.ts)
- [x] Personalizar mensajeBienvenida en `portfolio.ts:37-38` — tono amable equilibrado, 1 emoji max, mantener `{nombre}`
- [x] Optimizar sugerencias en `portfolio.ts:39-45` a 4 clave: `¿Qué experiencia tiene?` / `Cuéntame sobre sus proyectos` / `¿Cómo lo contacto?` / `Ver CV`
- [x] Verificacion: `npm run build` OK (dist/index.html 254 kB, gzip 75.4 kB, 20/09/2026)

### 8. Configuracion tecnica
- [x] Verificar que el build funciona correctamente (npm run build)
- [x] Probar en diferentes tamanos de pantalla (responsiveness)
- [x] Verificar accesibilidad basica
- Build verificado: dist/index.html 254.27 kB, gzip 75.47 kB, returncode 0 (20/09/2026)
- Responsive: Navbar mobile/desktop, Hero grid, Projects 2-col, Skills 3-col, ChatBot adaptado
- Accesibilidad: lang="es", aria-labels, aria-hidden en emojis, progressbar con aria-valuenow

### 9. UI / Visual
- [ ] Decidir si reactivar íconos de redes sociales en Hero (comentado en Hero.tsx:68-89)

---

## COMPLETADO 19/09/2026

### Actualización de CV
- [x] Actualizar teléfono a 098298339 en CV
- [x] Agregar GitHub a contacto del CV
- [x] Agregar empleo Toque y Toque (2022-2024) al CV
- [x] Agregar proyectos nuevos al CV (ChatBot WhatsApp, Brain AI, etc.)
- [x] Crear CV mejorado en docs/cv-nuevo/index.html (primera persona, ATS-friendly)
- [x] Copiar CV a public/cv-seiji-tsumura.html
- [x] Agregar cvUrl en portfolio.ts

### Textos y contenido personalizado
- [x] Personalizar tagline con +10 años de experiencia
- [x] Personalizar sobreMi con datos reales (Jefatura, Toque y Toque, ORT)
- [x] Agregar empleo Toque y Toque (2022-2024)
- [x] Reemplazar proyectos ficticios por proyectos reales (4 proyectos)
- [x] Agregar URLs reales de GitHub para cada proyecto

### Actualización de datos personales
- [x] Actualizar teléfono a 098298339
- [x] Agregar foto personal (you26.jpg)
- [x] Actualizar GitHub a https://github.com/seiji142
- [x] Ocultar LinkedIn por ahora
- [x] Reemplazar experiencia laboral con datos reales del CV
- [x] Reemplazar educación con datos reales (ORT, IBM)
- [x] Reajustar skills según tecnologías del CV

### Reorganizacion del proyecto
- [x] Crear carpeta project/ en raiz del repo
- [x] Mover contenido-generado-ai-chat a project/
- [x] Renombrar a portfolio-ai-chat
- [x] Cambiar avatar de robot a imagen humana
- [x] Corregir endpoint de memoria en MEMORY.md (5173 -> 8000)

### Mejora en flujo de trabajo
- [x] Agregar regla 8.4 "Flujo de Verificación Completo" en rules.md
- [x] Documentar flujo: memoria + archivos del proyecto (no confiar en una sola fuente)

### Imágenes de proyectos
- [x] Generar imágenes con IA para los 4 proyectos
- [x] Dividir imagen compuesta en 4 individuales con `scripts/crop_projects.py`
- [x] Guardar en `public/images/projects/`
- [x] Actualizar `portfolio.ts` para usar imágenes en lugar de emojis
- [x] Verificar build exitoso (`npm run build`)

### Documentación
- [x] Actualizar README.md raíz con información completa del proyecto

### Despliegue
- [x] Crear repositorio en GitHub: https://github.com/seiji142/portfolio.git
- [x] Configurar remote SSH y subir código
- [x] Cambiar bash permission a "allow" en opencode.json

---

## Flujo de Trabajo

1. El usuario proporciona sus datos personales
2. Se actualizan los campos en portfolio.ts
3. Se verifica que el sitio funcione correctamente
4. Se marca como completada en el checklist

---

## PROPUESTA — Diferenciar run_tests vs run_command (20/09/2026, implementada)

### Decisiones
- Dos tools separadas (no unificar con `kind`).
- Generica = `run_command` / `command_status`.
- Opcion B: endpoints alias diferentes que comparten el mismo `_runner`.
- `run_tests` solo tests, con solo advertencia (no bloqueo) si el comando no parece test.

### Cambios aplicados
1. [x] `brain-ai-01/ai_architect/core/mcp_server.py` — agregados `POST /commands/run`, `GET /commands/status/{id}`, `GET /commands/list` delegando al mismo `_runner`.
2. [x] `brain-ai-01/mcp_bridge.py` — agregadas tools `run_command`/`command_status` + handlers; `run_tests` con heuristica warn-only; docstring actualizado.
3. [x] Docs — tabla de tools actualizada en `portfolio/.ai/MEMORY.md`.
4. [x] Servidor reiniciado y verificado end-to-end.
5. [x] Sesion MCP recargada: sesion nueva ve las 10 tools (ep_feec58d9).

### Verificacion (20/09/2026)
- [x] `py_compile` OK en ambos archivos.
- [x] Rutas FastAPI: `/commands/run`, `/commands/status/{id}`, `/commands/list` + `/tests/*` presentes.
- [x] Bridge: 10 tools y 10 handlers registrados.
- [x] Heuristica: `pytest`/`npm test`/`go test` → True; `npm run build`/`lint`/`echo ok` → False (warning).
- [x] Servidor reiniciado (auto-start del bridge tras `Stop-Process -Id 1820`; intento manual con `Start-Process` murio por Job Object — usar auto-start o `pythonw`).
- [x] End-to-end `POST /commands/run` (`echo ok`) → `done`, stdout `ok`, returncode 0.
- [x] End-to-end MCP en sesion nueva: `run_command("echo ok")` → `done` stdout `ok` rc 0; `run_tests("npm run build")` → warning confirmado (ep_feec58d9). Propuesta CERRADA.
