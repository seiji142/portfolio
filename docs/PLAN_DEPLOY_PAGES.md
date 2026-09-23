# Plan de Despliegue — GitHub Pages

**Objetivo:** publicar el portfolio en `https://seiji142.github.io/portfolio/`
con CI automático vía GitHub Actions.

**Estado:** En ejecución (23/09/2026).

---

## Pasos

### 1. Rutas relativas en `src/data/portfolio.ts`

Las imágenes y el CV se referenciaban con rutas absolutas de raíz
(`/images/...`, `/cv-seiji-tsumura.html`) que romperían bajo la subruta
`/portfolio/` de GitHub Pages. Se cambian a rutas relativas.

| Línea | Antes | Después |
|-------|-------|---------|
| 19 | `/images/you26.jpg` | `images/you26.jpg` |
| 20 | `/cv-seiji-tsumura.html` | `cv-seiji-tsumura.html` |
| 36 | `/images/assistant-mony-01.jpg` | `images/assistant-mony-01.jpg` |
| 96 | `/images/projects/chatbot-whatsapp.png` | `images/projects/chatbot-whatsapp.png` |
| 105 | `/images/projects/brain-ai.png` | `images/projects/brain-ai.png` |
| 114 | `/images/projects/personalizar-ia.png` | `images/projects/personalizar-ia.png` |
| 122 | `/images/projects/portfolio-web.png` | `images/projects/portfolio-web.png` |

Resultado: sitio portable a cualquier subruta.

### 2. Base relativa en `vite.config.ts`

Agregar `base: "./"` a `defineConfig` para que el HTML generado use URLs
relativas.

### 3. Workflow CI — `.github/workflows/deploy.yml`

- Trigger: `push` a `main` + `workflow_dispatch`.
- Job `build`: checkout → setup-node (20) con caché de npm → `npm ci`
  en `project/portfolio-ai-chat` → `npm run build` → sube `dist/` como
  artefacto Pages.
- Job `deploy`: `deploy-pages` con permisos `pages: write` e `id-token: write`.

### 4. Verificación

- `npm run build` exitoso.
- `dist/index.html` sin rutas absolutas (`/images`, `/cv-`).

### 5. Commit + push

Todo con `git_subir_cambios` (workflow incluido). El push a `main` dispara el
Actions.

---

## Acción manual (única)

En GitHub → Settings del repo → Pages → **Source: GitHub Actions**
(puede hacerse antes o después del push; hasta entonces el sitio no es visible).

## Resultado esperado

Cada push a `main` recompila y publica solo. Dominio:
`https://seiji142.github.io/portfolio/`.