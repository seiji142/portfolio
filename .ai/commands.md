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

## Validacion pre-PR (obligatoria, bloqueante)

No hay sitio de dev (GitHub Pages = 1 sitio por repo). NINGUN PR se abre
sin completar esta checklist, sin excepciones por "cambio chico":

1. [ ] `npm run build` en `project/portfolio-ai-chat` → OK.
2. [ ] `npm run preview` → pasar la URL (http://localhost:4173) al usuario.
3. [ ] OK visual EXPLICITO del usuario en el chat ("se ve bien").
   Sin ese mensaje, NO hay PR. En cambios no visuales, el usuario igual
   confirma el alcance antes del PR.
4. [ ] Abrir el PR via `scripts/gh-publish.ps1` (SIN `-Merge` todavia).
5. [ ] CI en verde en el PR (obligatorio; `main` lo exige por proteccion).
6. [ ] Recien entonces: merge via script (`-Merge`) -> publish -> verificar
   run `success` + sitio 200.

Regla: el riesgo percibido NUNCA saltea pasos. Lo que no tiene evidencia
(URL + OK del usuario + CI verde) se considera NO verificado.

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
