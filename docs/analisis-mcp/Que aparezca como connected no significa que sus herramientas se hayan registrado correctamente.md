Que aparezca como connected no significa que sus herramientas se hayan registrado correctamente. Normalmente solo confirma que OpenCode pudo iniciar el proceso y completar el handshake inicial de MCP. Después de eso OpenCode ejecuta tools/list; es en esa fase donde pueden desaparecer las herramientas.

En este caso, como brain-ai sí funciona y git\_publisher también aparece conectado, el problema probablemente está en una de estas áreas:

## 1\. El servidor MCP no devuelve correctamente tools/list

El archivo git\_tool.py debe registrar las herramientas antes de iniciar el transporte STDIO. Por ejemplo, con FastMCP:

Python

from mcp.server.fastmcp import FastMCP

mcp \= FastMCP("git\_publisher")

@mcp.tool()  
def git\_ver\_estado() \-\> str:  
    ...

@mcp.tool()  
def git\_ver\_historial(cantidad: int \= 10) \-\> str:  
    ...

@mcp.tool()  
def git\_ver\_diferencias() \-\> str:  
    ...

@mcp.tool()  
def git\_subir\_cambios(mensaje\_commit: str, rama: str) \-\> str:  
    ...

if \_\_name\_\_ \== "\_\_main\_\_":

    mcp.run(transport\="stdio")

Puntos importantes:

* Las funciones deben tener el decorador @mcp.tool().  
* mcp.run(...) debe ejecutarse únicamente al final.  
* No debe haber lógica que registre las herramientas solamente bajo ciertas condiciones.  
* Las herramientas deben estar registradas antes de iniciar el servidor.  
* Las funciones deben tener anotaciones de tipo compatibles con JSON.

Por ejemplo, esto puede provocar que el servidor se conecte pero no publique herramientas:

Python

if Path.cwd().name \== "personalizar-comportamiento-01":  
    @mcp.tool()  
    def git\_ver\_estado():

        ...

Si git\_tool.py registra herramientas dependiendo del directorio actual, en portfolio la lista puede quedar vacía.

## 2\. Hay salida de depuración en stdout

Un servidor MCP por STDIO debe reservar stdout exclusivamente para mensajes JSON-RPC. No debe hacer:

Python

print("Servidor iniciado")

Debe usar stderr:

Python

import sys

print("Servidor iniciado", file\=sys.stderr)

También conviene revisar cualquier librería o comando que escriba directamente en stdout. Un mensaje adicional puede hacer que OpenCode complete parcialmente la conexión, pero falle al procesar tools/list.

## 3\. El proyecto puede estar sobrescribiendo o filtrando la configuración MCP global

Aunque OpenCode normalmente combina la configuración global y la del proyecto, conviene probar declarando temporalmente ambos servidores en el opencode.json de portfolio:

JSON

{  
  "$schema": "https://opencode.ai/config.json",  
  "model": "groq/openai/gpt-oss-20b",

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

}

Después hay que cerrar completamente OpenCode y abrirlo de nuevo. No basta con cambiar de sesión si el proceso MCP anterior permanece activo.

## 4\. Revisar permisos MCP

En algunas versiones de OpenCode los servidores MCP pueden quedar conectados pero sus herramientas no se habilitan para el agente si no tienen permiso explícito.

Añade temporalmente:

JSON

"permission": {  
  "bash": "allow",  
  "webfetch": "ask",  
  "write": "ask",  
  "edit": "ask",  
  "mcp": {  
    "git\_publisher": "allow",  
    "brain-ai": "allow"  
  }

}

La clave relevante no es bash; el permiso de Bash no controla las herramientas MCP.

## 5\. El directorio de trabajo puede ser diferente

git\_tool.py probablemente ejecuta comandos como:

Bash

git status  
git add .  
git commit

git push

El proceso MCP puede iniciarse con un directorio de trabajo distinto al del proyecto. Eso no debería impedir que las herramientas aparezcan, pero sí puede causar errores durante su ejecución. No obstante, si el código comprueba que el directorio actual es un repositorio Git al iniciar, podría impedir el registro de herramientas.

Es mejor que el script determine explícitamente el repositorio, por ejemplo:

Python

from pathlib import Path

REPO \= Path(r"C:**\\r**uta**\\a**l**\\p**ortfolio")

o que no valide Git durante el arranque, sino únicamente cuando se invoca una herramienta.

## 6\. Verificar si el problema está en el registro o en el modelo

La prueba clave es distinguir entre:

* El servidor no devuelve herramientas.  
* OpenCode recibe las herramientas, pero no las habilita para el agente.

Comprueba la información detallada del servidor MCP en la interfaz/comando de diagnóstico de OpenCode. Si git\_publisher aparece conectado pero con cero herramientas, el problema está en git\_tool.py o en tools/list.

Si aparece con cuatro herramientas pero el agente no las utiliza, entonces hay que revisar:

* permisos MCP;  
* compatibilidad de herramientas con el modelo;  
* sesión antigua;  
* configuración del agente;  
* filtros de herramientas.

## Conclusión

La diferencia de bash: "allow" no es la causa. El estado:

text

git\_publisher: connected

solo confirma que el proceso Python arrancó y respondió al handshake. No garantiza que OpenCode haya recibido:

text

git\_ver\_estado  
git\_subir\_cambios  
git\_ver\_historial

git\_ver\_diferencias

Dado que brain-ai sí funciona, la causa más probable es que git\_tool.py esté devolviendo una lista vacía o fallando durante tools/list, posiblemente por:

1. herramientas no decoradas o registradas condicionalmente;  
2. salida de depuración en stdout;  
3. error durante la importación del script;  
4. configuración/permisos MCP del proyecto;  
5. proceso MCP antiguo que no se reinició.

La prueba más útil es ejecutar git\_tool.py desde el contexto de portfolio, revisar los logs de OpenCode y confirmar si la respuesta de tools/list contiene esas cuatro herramientas.  
