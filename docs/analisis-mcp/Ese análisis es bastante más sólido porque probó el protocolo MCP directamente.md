Ese análisis es bastante más sólido porque probó el protocolo MCP directamente. La conclusión importante es:

*git\_tool.py sí anuncia correctamente las cuatro herramientas. El problema está entre la configuración efectiva de OpenCode y la conversión/exposición de esas herramientas al agente.*

Sin embargo, haría algunos ajustes al plan.

## Lo que considero confirmado

La prueba:

1. initialize  
2. notifications/initialized  
3. tools/list

descarta casi por completo:

* errores de arranque;  
* contaminación de stdout;  
* registro condicional;  
* ausencia real de herramientas;  
* fallo básico de la librería MCP.

Por tanto, no reescribiría todavía el servidor ni lo convertiría a JSON-RPC manual.

## Matices importantes

### 1\. Shadowing/merge es posible, pero no está demostrado

Declarar ambos MCP en portfolio/opencode.json es una buena prueba diagnóstica. No obstante, si:

Bash

opencode mcp list

ejecutado desde portfolio muestra git\_publisher como conectado, entonces la configuración global no está completamente oculta.

Aun así, puede existir una diferencia entre:

* configuración usada por opencode mcp list;  
* configuración cargada por la sesión/agente;  
* caché de una sesión abierta antes del cambio.

Por eso conviene declararlo localmente y reiniciar totalmente.

### 2\. No asumiría que permission.mcp es válido

Este bloque:

JSON

"permission": {  
  "mcp": {  
    "git\_publisher": "allow",  
    "brain-ai": "allow"  
  }

}

podría no corresponder al esquema real de la versión instalada de OpenCode. Según la versión, los permisos pueden aplicarse por nombre o patrón de herramienta, no mediante un objeto permission.mcp.

Además, los permisos normalmente determinan si una herramienta se ejecuta automáticamente, pregunta o se deniega; no deberían hacer que desaparezca de tools/list.

Antes de añadirlo, validaría el archivo contra el esquema o comprobaría la documentación de la versión instalada. No introduciría una propiedad dudosa durante la primera prueba.

### 3\. outputSchema sí es una hipótesis razonable

La prueba MCP directa demuestra que tools/list funciona, pero no demuestra que OpenCode pueda convertir todas las definiciones recibidas al formato de herramientas del proveedor Groq/OpenAI.

La diferencia observada es relevante:

* brain-ai: definiciones manuales sin outputSchema;  
* git\_publisher: definiciones generadas por MCPServer, con outputSchema.

Si OpenCode o su adaptador AI SDK no acepta ese esquema, puede omitir las herramientas aunque mantenga el servidor como conectado.

Pero todavía es la segunda prueba, no la primera.

### 4\. No usaría necesariamente el mismo virtualenv para ambos servidores

La recomendación de poner ambos MCP bajo el mismo .venv/python.exe podría romper brain-ai si depende de paquetes instalados en otro entorno.

Usaría:

* para git\_publisher, su .venv actual;  
* para brain-ai, el intérprete con el que ya se sabe que funciona, preferiblemente convertido a ruta absoluta.

## Orden que recomiendo

### Paso 1: declarar explícitamente ambos servidores

En portfolio/opencode.json, mantener brain-ai y añadir git\_publisher:

JSON

"mcp": {  
  "git\_publisher": {  
    "type": "local",  
    "command": \[  
      "C:\\\\Users\\\\seiji\\\\.config\\\\opencode\\\\herramientas\\\\.venv\\\\Scripts\\\\python.exe",  
      "C:\\\\Users\\\\seiji\\\\.config\\\\opencode\\\\herramientas\\\\git\_tool.py"  
    \],  
    "enabled": true  
  },  
  "brain-ai": {  
    "type": "local",  
    "command": \[  
      "python",  
      "C:\\\\Users\\\\seiji\\\\OneDrive\\\\Documentos\\\\Proyecto AI\\\\brain-ai-01\\\\mcp\_bridge.py"  
    \],  
    "enabled": true  
  }

}

No añadiría todavía permission.mcp.

### Paso 2: reinicio real

Cerrar completamente OpenCode y terminar procesos residuales:

PowerShell

Get-CimInstance Win32\_Process |  
  Where-Object {  
    $\_.CommandLine \-match 'git\_tool\\.py|mcp\_bridge\\.py'  
  } |

  Select-Object ProcessId, Name, CommandLine

Después de revisar la lista:

PowerShell

Get-CimInstance Win32\_Process |  
  Where-Object {  
    $\_.CommandLine \-match 'git\_tool\\.py|mcp\_bridge\\.py'  
  } |  
  ForEach-Object {  
    Stop-Process \-Id $\_.ProcessId \-Force

  }

Reabrir OpenCode desde la raíz de portfolio.

### Paso 3: distinguir registro de autorización

Hay que comprobar dos cosas separadas:

1. ¿OpenCode muestra cuatro herramientas asociadas a git\_publisher?  
2. ¿El agente recibe esas herramientas en su conjunto de tools?

Resultados:

* 0 herramientas en el servidor: problema de ingestión/compatibilidad.  
* 4 herramientas en el servidor, pero no en el agente: filtrado por agente, modelo, permisos o configuración de tools.  
* Las herramientas aparecen, pero no se ejecutan: autorización, selección del modelo o comportamiento del agente.

También conviene pedir explícitamente:

*Usa la herramienta git\_ver\_estado; no ejecutes git status mediante bash.*

Eso permite diferenciar “no está disponible” de “el modelo prefirió bash”.

### Paso 4: probar outputSchema

Solo si los pasos anteriores fallan, usaría:

Python

@server.tool(structured\_output\=False)

si esa versión de MCPServer admite ese argumento.

Después repetiría tools/list y verificaría que desaparece outputSchema o que la definición queda simplificada.

Esto debe hacerse como experimento aislado, sin reescribir simultáneamente todo el servidor.

### Paso 5: comparar el proyecto que funciona

La comparación más útil no es solo la configuración MCP. También hay que comparar:

* modelo y proveedor;  
* configuración de agente;  
* filtros de herramientas;  
* versión/sesión de OpenCode;  
* archivos de configuración intermedios;  
* herramientas totales enviadas al modelo.

Si personalizar-comportamiento-01 utiliza otro modelo, el proveedor Groq o el modelo gpt-oss-20b podría ser parte de la diferencia.

## Mi recomendación concreta

Elegiría pasos 1 y 2 primero: configuración explícita y reinicio total.

No iría directamente al paso 4 porque ya está demostrado que el servidor es válido. Modificar outputSchema antes de descartar configuración/caché añade una variable innecesaria.

Además, haría los cambios de uno en uno:

1. añadir git\_publisher localmente;  
2. reiniciar;  
3. comprobar herramientas;  
4. solo entonces probar structured\_output=False.

La respuesta que le daría sería:

*Ejecuta primero configuración explícita \+ reinicio total, pero sin añadir aún permission.mcp y sin cambiar el intérprete de brain-ai. Si git\_publisher sigue conectado con cero herramientas visibles, prueba después structured\_output=False. No reescribas todavía el servidor a JSON-RPC manual.*

