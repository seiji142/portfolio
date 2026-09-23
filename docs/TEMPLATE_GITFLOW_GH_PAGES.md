# Template: Setup de Proyecto — Git Flow + GitHub Pages + opencode/MCP

Guía replicable para configurar un proyecto nuevo con:

1. Estructura de ramas Git (main / develop / feature).
2. Deploy estático a GitHub Pages con CI.
3. Integración del asistente IA (opencode + MCP + memoria persistente).

Adapta los `<PLACEHOLDERS>` al proyecto concreto.

---

## 1. Estructura de ramas

| Rama | Proposito | Sale de | Vuelve a | Proteccion |
|------|-----------|---------|----------|------------|
| `main` | Produccion · deploy GitHub Pages | — | — | Requiere PR (sin push directo) |
| `develop` | Desarrollo diario (rama por defecto) | `main` | `main` (PR al publicar) | No |
| `feature/<desc>` | Cada tarea o experimento | `develop` | `develop` (PR) | No |

Reglas de comportamiento:
- Trabajar SIEMPRE en `develop`. Antes de modificar, verificar la rama actual con
  `git status`/`git branch`; si se esta en `main`, no trabajar ahi.
- `main` solo se toca para publicar, via PR desde `develop`. El deploy de
  GitHub Pages se dispara con el merge a `main`.
- Tareas grandes o experimentos: crear `feature/<desc>` desde `develop` y
  mergear de vuelta a `develop`.

## 2. Setup inicial (fases)

### Fase 1 — Crear rama de desarrollo
```bash
git checkout -b develop          # desde main
git push -u origin develop       # tracking
```

### Fase 2 — Documentar el flujo
- Agregar en `.ai/context.md` una seccion "Ramas del Proyecto" con la tabla
  anterior y las reglas de comportamiento.
- Guardar en memoria persistente:
  `brain_ai_memory_save(project="<PROYECTO>", decision="Rama de desarrollo por defecto = develop; main = produccion; feature/* para tareas", tags=["git", "flujo-trabajo", "branching"])`.

### Fase 3 — Proteccion de `main` en GitHub (manual)
En GitHub → Settings → Branches → **Add classic branch protection rule**:
- Branch name pattern: `main`
- Marcar **"Require a pull request before merging"**
- Create

Consecuencia: con proteccion activa no hay push directo a `main`; publicar =
PR desde `develop` (manual en GitHub o con `gh` autenticado).

### Fase 4 — Verificacion final
```bash
git branch -a   # debe mostrar main, develop, origin/develop, origin/main
git status      # working tree limpio
```

## 3. Deploy a GitHub Pages

### 3.1 Requisitos de codigo
- Compilar a HTML autocontenido (opcional: `vite-plugin-singlefile`).
- En la config de build agregar base relativa, ej. Vite:
  ```ts
  export default defineConfig({
    base: "./",
    // ...
  });
  ```
- Usar rutas RELATIVAS (sin `/` inicial) para assets publicos, imagenes en data
  y enlaces a archivos estaticos (ej. CV). Asi el sitio funciona bajo cualquier
  subruta (`https://<usuario>.github.io/<repo>/`).

### 3.2 Workflow CI — `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: <SUB_PROYECTO>/package-lock.json
      - name: Install dependencies
        working-directory: <SUB_PROYECTO>
        run: npm ci
      - name: Build
        working-directory: <SUB_PROYECTO>
        run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: <SUB_PROYECTO>/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
Donde `<SUB_PROYECTO>` es la carpeta del proyecto dentro del repo (o `.` si el
repo es solo el sitio). Nota: monorepos usan `working-directory` y
`cache-dependency-path` apuntando a la subcarpeta.

### 3.3 Paso manual (unico)
GitHub → repositorio → Settings → Pages → Source: **GitHub Actions**.
(Se puede activar antes o despues del primer push; hasta entonces no se publica.)
El push/merge a `main` dispara el build + deploy automatico.

### 3.4 Resultado
Sitio publicado en `https://<usuario>.github.io/<repo>/`. El deploy se
regenera con cada push o merge a `main`.

## 4. Configuracion opencode / MCP

### 4.1 `opencode.json` de ejemplo
```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "<PROVEEDOR>/<MODELO>",
  "instructions": [
    ".ai/system.md",
    ".ai/rules.md",
    ".ai/context.md",
    ".ai/agents.md",
    ".ai/MEMORY.md"
  ],
  "permission": {
    "bash": "allow",
    "webfetch": "ask",
    "write": "ask",
    "edit": "ask"
  },
  "mcp": {
    "git_publisher": {
      "type": "local",
      "command": [
        "<RUTA_VENV>/Scripts/python.exe",
        "<RUTA_HERRAMIENTAS>/git_tool.py"
      ],
      "enabled": true
    },
    "brain-ai": {
      "type": "local",
      "command": ["python", "<RUTA>/brain-ai-01/mcp_bridge.py"],
      "enabled": true
    }
  }
}
```

### 4.2 Leccion aprendida sobre MCP
- **"connected" NO garantiza herramientas registradas.** Solo confirma el
  handshake inicial; las tools pueden fallar en `tools/list`.
- Fix comprobado: declarar el servidor MCP **explicitamente local** en el
  `opencode.json` del proyecto, con ruta absoluta del intérprete/venv propio,
  y **reiniciar OpenCode totalmente** (no basta nueva sesion).
- `permission.bash` no controla herramientas MCP.
- Para diagnosticar: probar el protocolo directamente (initialize →
  notifications/initialized → tools/list) en vez de confiar en la UI.

## 5. Archivos `.ai/`
| Archivo | Contenido minimo |
|---------|------------------|
| `system.md` | Rol, tono, postura epistemica, reglas de memoria y uso de MCP |
| `rules.md` | Reglas de seguridad, idioma, calidad, verificacion obligatoria |
| `context.md` | Stack, arquitectura, convenciones, comandos y seccion "Ramas del Proyecto" |
| `agents.md` | Agentes especialistas y cuando activarlos |
| `MEMORY.md` | Instrucciones de memoria persistente y herramientas brain-ai |

## 6. Comandos del flujo diario
```bash
git checkout develop                       # trabajar en develop
git checkout -b feature/<desc> develop     # tarea o experimento
# ... trabajo ...
# merge de vuelta a develop (PR o local)
git checkout develop
git merge feature/<desc>
# publicar produccion: PR develop -> main (GitHub), que dispara el deploy
```

## 7. Checklist de verificacion
- [ ] `develop` creada y subida con tracking (`origin/develop`).
- [ ] `main` con branch protection (require PR).
- [ ] `on: push branches: [main]` en el workflow Pages.
- [ ] Base relativa (`base: "./"`) y rutas relativas en data/assets.
- [ ] `npm run build` exitoso y sin rutas absolutas (`/img`, `/cv-`) en el dist.
- [ ] Settings → Pages → Source: **GitHub Actions**.
- [ ] Sitio visible en `https://<usuario>.github.io/<repo>/`.
- [ ] Flujo documentado en `.ai/context.md` y memoria persistente.