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

## Clasificacion del cambio: SDD u ODD

Todo cambio autorizado se clasifica ANTES de escribir codigo. O lleva spec
(`docs/specs/<tema>.md`) o va en modo ODD. No hay tercera via.

### Prueba de reanudacion (decide; el tamano no)

Modo ODD solo si se cumplen las tres:
1. **Entendido**: no queda ninguna decision de producto abierta.
2. **Riesgo contenido**: no toca ningun escalador duro.
3. **Reanudable**: enumera las decisiones abiertas. Si alguna no se resuelve
   con el pedido o con `git diff` (incluida cualquier convencion que tengas
   que suponer), entonces no es ODD.

Falla cualquiera -> modo SDD (spec completo, y FICHA si hay entregable).

El conteo de archivos, lineas, tests o tareas NUNCA decide: un cambio de
una linea en auth es SDD; uno de 20 en un README puede ser ODD.

### Escaladores duros (siempre SDD)

Seguridad/auth, datos o migraciones, contratos de API que otros consumen,
dependencias nuevas, CI/workflows, crypto, permisos de `opencode.json`,
reglas y roles (`.ai/system.md`, `.ai/rules.md`, `.ai/commands.md`,
`.ai/agents.md`) o skills (`.agents/skills/`), operaciones irreversibles,
y `scripts/`.

### Que entrega cada modo

| | SDD | ODD |
|---|---|---|
| Documento | spec + FICHA | ninguno |
| Evidencia | §6, §7 y §8 del spec | commit + resultado observado en el chat |
| Verificacion pre-PR | obligatoria | obligatoria (identica) |
| Auditoria, si el proyecto la define | segun sus disparadores | segun sus disparadores |

En ODD la evidencia vive en el commit: asunto en imperativo y en el cuerpo
`ODD: <por que> / <que se observo>`. Sin esa linea no es ODD: es un cambio
sin evidencia.

### Prohibido

- Usar ODD para saltarse el criterio de aceptacion explicito del usuario.
- Declarar ODD despues de implementar para justificar la falta de spec.
- Partir un cambio SDD en varios ODD para esquivar el spec.

## Validacion pre-PR (obligatoria, bloqueante)

No hay sitio de dev (GitHub Pages = 1 sitio por repo). NINGUN PR se abre
sin completar esta checklist, sin excepciones por "cambio chico":

1. [ ] `npm run build` en `project/portfolio-ai-chat` → OK.
2. [ ] `npm run preview` → pasar la URL (http://localhost:4173) al usuario.
3. [ ] OK visual EXPLICITO del usuario en el chat ("se ve bien").
   Sin ese mensaje, NO hay PR. En cambios no visuales, el usuario igual
   confirma el alcance antes del PR.
   Cuenta: una frase sobre el CAMBIO ("se ve bien en el preview", "el
   boton ya no se desborda").
   No cuenta: la orden de publicar ("abre el PR", "publica", "subilo"):
   autoriza la accion, no acepta el resultado.
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
