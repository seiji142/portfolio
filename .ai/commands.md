# Comandos del Proyecto

## Desarrollo

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en localhost:5173 |
| `npm run build` | Build de produccion (HTML autocontenido en dist/) |
| `npm run preview` | Previsualizar el build de produccion localmente |

## Git

| Comando | Descripcion |
|---------|-------------|
| `git status` | Ver estado del repositorio |
| `git add .` | Agregar todos los cambios |
| `git commit -m "msg"` | Commit con mensaje |
| `git push` | Subir cambios al remote |

## Validacion pre-PR (obligatoria)

No hay sitio de dev (GitHub Pages = 1 sitio por repo). `develop` se valida en local
ANTES de abrir cualquier PR:

1. `npm run build` en `project/portfolio-ai-chat` → debe terminar OK.
2. `npm run preview` → abrir http://localhost:4173 y verificar visualmente el cambio.
3. Recien despues: commit -> PR via `scripts/gh-publish.ps1`.

## Publicacion (PRs y merges)

OBLIGATORIO: NUNCA uses `gh pr create` / `gh pr merge` directos.
Todo PR y merge pasa por `scripts/gh-publish.ps1` (ejecutar desde la raiz del repo).

| Tarea | Comando |
|-------|---------|
| PR + merge `feature/x` -> `develop` | `.\scripts\gh-publish.ps1 -Rama feature/x -Base develop -Merge` |
| PR + merge `develop` -> `main` (+ deploy Pages) | `.\scripts\gh-publish.ps1 -Merge` |
| Solo crear PR (sin mergear) | Mismo comando sin `-Merge` |

## Memoria

| Comando | Descripcion |
|---------|-------------|
| `brain-ai_memory_search` | Buscar en memoria persistente |
| `brain-ai_memory_save` | Guardar episodio en memoria |
| `brain-ai_memory_consolidate` | Consolidar episodios en conocimiento |

## Uso

Los comandos se ejecutan escribiendolos en el chat del modelo.
