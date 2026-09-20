# Tarea: Fix git_publisher connected sin herramientas

## 1. Objetivo
Recuperar las 4 tools `git_ver_* / git_subir_cambios` en `portfolio` sin romper `brain-ai`. Si algo falla, revertir a estado inicial.

## 2. Diagnóstico verificado (2026-09-20)
- SÉ: `git_tool.py` aislado responde `initialize` + `tools/list` con 4 tools, `stdout` limpio JSON-RPC, `stderr` solo log.
- SÉ: usa `MCPServer`, `run(stdio)` por defecto, válido en `.venv` actual.
- SÉ: `portfolio/opencode.json` solo declara `brain-ai`; `git_publisher` solo está en global `opencode.jsonc`.
- SÉ: `brain-ai/mcp_bridge.py` es JSON-RPC manual sin `outputSchema`; `git_tool.py` sí emite `outputSchema`.
- Descartado: registro condicional, contaminación `stdout`, error arranque.
- Memoria: sin episodio previo sobre `git_publisher`.

## 3. Backup previo (rollback)
- [x] Copiar `portfolio/opencode.json` -> `opencode.json.bak` (2026-09-20, eliminado tras éxito)
- [x] Anotar versión: `mcp 2.2.0`

## 4. Plan paso a paso (uno a uno, sin mezclar variables)

### Paso 1 - Config explícita local (sin permission.mcp)
- [x] En `portfolio/opencode.json`, mantener `brain-ai` intacto con su `python` actual
- [x] Añadir solo `git_publisher` con ruta absoluta `.venv`
- [ ] NO añadir `permission.mcp` aún, NO cambiar intérprete de `brain-ai`

### Paso 2 - Reinicio total — OK
- [x] `Get-CimInstance` sin residuales `git_tool.py|mcp_bridge.py`
- [x] Reabierto desde raíz `portfolio`

### Paso 3 - Distinguir registro vs autorización — OK
- [x] `opencode mcp list --print-logs --log-level DEBUG`: `git_publisher toolCount=4`, `brain-ai toolCount=8`
- [x] Prompt forzado `Usa git_ver_estado, no uses bash`: MCP respondió correctamente, rama main al día
- Conclusión: era falta de declaración explícita local, no `outputSchema` ni `stdout`

### Paso 4 - No requerido (era 4 tools, no 0)

### Paso 5 - No requerido (mismo modelo/proveedor funciona)

## 5. No hacer todavía
- No reescribir a JSON-RPC manual
- No unificar ambos a mismo `.venv`
- No añadir `permission.mcp` sin validar esquema

## 6. Rollback si falla
- [ ] Restaurar `.bak`
- [ ] Reinicio total
- [ ] `git_ver_diferencias` limpio
- [ ] Anotar en este archivo: paso que falló + log + `tools/list` obtenido
