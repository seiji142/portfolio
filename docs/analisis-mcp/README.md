# Análisis MCP — git_publisher (resuelto)

Diagnóstico del bug donde `git_publisher` aparecía como *connected* pero sin
herramientas visibles en OpenCode. Bug reportado y resuelto el 20/09/2026.

## Documentos del diagnóstico

| Archivo | Contenido | Veredicto |
|---------|-----------|-----------|
| `Que aparezca como connected...md` | Hipótesis iniciales: fallo en `git_tool.py` (tools/list vacío, stdout contaminado, registro condicional, permisos MCP, cwd distinto) | **Refutado** — sospechaba del servidor |
| `Ese análisis es bastante más sólido...md` | Prueba directa del protocolo MCP (`initialize` → `notifications/initialized` → `tools/list`). Demostró que `git_tool.py` sí anuncia las 4 herramientas. El problema estaba en la configuración efectiva de OpenCode | **Correcto** — diagnóstico acertado |

## Desenlace

La solución fue la recomendada por el segundo documento:

1. Declarar explícitamente `git_publisher` como servidor MCP local en
   `portfolio/opencode.json` con la ruta absoluta del venv de herramientas.
2. Cerrar OpenCode completamente y reiniciarlo (terminar procesos residuales
   para no reutilizar la sesión MCP antigua).

### Evidencia

- Commit: `17ccd56` — "Fix git_publisher MCP: declare explicit local server, recover 4 tools"
- Resultado: `toolCount=4` (git_ver_estado, git_ver_diferencias, git_ver_historial, git_subir_cambios).
- `git_ver_estado` funcional sin recurrir a bash.
- Memoria persistente: episodio "Fix git_publisher exitoso y commiteado (17ccd56)".

## Lecciones

- *Connected* solo confirma el handshake inicial; no garantiza que `tools/list`
  llegue al agente.
- Al diagnosticar MCP, probar el protocolo directamente (JSON-RPC por STDIO)
  descarta o confirma fallos del servidor sin depender de la UI/agente.
- La clave `permission.bash` no controla herramientas MCP.
- Los cambios de configuración MCP requieren reinicio total de OpenCode, no
  solo nueva sesión.