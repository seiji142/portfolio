---
titulo: Migracion de opencode.json al esquema v2 (providers, permissions, mcp.servers)
estado: implementado
entradas:
  - opencode.json de portfolio con esquema v1 (provider, options, permission, mcp plano, enabled)
  - Decisión del usuario: un spec y un PR por repo, empezando por portfolio para fijar el patron
salidas:
  - opencode.json migrado a v2, sin claves de compatibilidad
  - docs/specs/migracion-esquema-opencode.md (este documento)
dependencias:
  - opencode.json
  - https://opencode.ai/config.json (schema v2)
  - project/portfolio-ai-chat (build del gate pre-PR)
tablas_impactadas: []
criterio_aceptacion: La config efectiva del archivo migrado es equivalente a la del archivo v1 auto-migrado por OpenCode, con un unico delta conocido (una regla duplicada que la capa de compatibilidad genera y el archivo nuevo no).
---

# Migracion de opencode.json al esquema v2

## 1. Problema

`opencode.json` esta en el esquema v1: `provider`, `model` como string,
`options`, `permission` como objeto y `mcp.<nombre>` plano con `enabled`.

Medido, no supuesto: OpenCode v2 **no rechaza** ese archivo. Lo acepta y lo
migra en runtime (`opencode debug config` sobre el archivo v1 devuelve
`providers`, `permissions` y `mcp.servers`). El defecto no es que falle, es que
el repo **ensenia el esquema viejo**:

- Quien copia este `opencode.json` como base escribe v1 y depende de una capa de
  compatibilidad que puede desaparecer.
- La migracion automatica no es fiel al 100%: convierte `permission.write` a
  `edit` y lo suma al `edit` explicito, dejando **la regla `edit` duplicada**.
- La correspondencia de `options` no es obvia: la capa oficial la lleva a
  **`settings`**, no a `body`. Escribir `body` a mano (lo que hizo la primera
  copia de este archivo) cambia el destino del dato: `body` se fusiona en el
  cuerpo HTTP del request, `settings` son los controles tipados del runtime.

## 2. Alcance

- Incluye: las cinco claves de `opencode.json` de **este** repo.
- Excluye (explicito): los otros cuatro repos (`flujo-ai-lab`, `piloto-nuevo`,
  `youtube-transcripts`, `sitio-viajes`), que llevan su propio spec y PR.
- Excluye: `skills` (`portfolio` no tiene `.agents/skills`, no declara la clave)
  y el bloque `mcp.servers.git_publisher`, que se conserva tal cual.
- Excluye: `model`, `instructions` y el contenido de `.ai/`.

## 3. Modulos / piezas

Un solo archivo, `opencode.json`, con cinco cambios:

| v1 (antes) | v2 (despues) |
|---|---|
| `provider` | `providers` |
| `options` (del modelo) | `settings` |
| `permission` objeto | `permissions` array de reglas |
| `mcp.<nombre>` | `mcp.servers.<nombre>` |
| `enabled: true` | (se elimina; ausencia = habilitado) |

## 4. Stack y dependencias

JSON + Vite (build a HTML autocontenido en `dist/`). **Este repo no tiene
`scripts/ci_checks.py`** (verificado ausente): no hay validador propio que
chequee el esquema, asi que la verificacion es el schema oficial, la config
efectiva de OpenCode y el build del gate pre-PR.

## 5. Diseno

Se traduce clave por clave segun el schema `https://opencode.ai/config.json`
(68675 bytes, consultado: `providers`, `permissions`, `mcp`, `skills`, `model`,
`compaction` e `instructions` son claves validas de nivel superior).

Decisiones:

- **`settings` y no `body`**: el schema define `settings` como "typed OpenCode
  controls and JSON options passed to the runtime package" y `body` como "JSON
  fields merged into request bodies". `temperature` y `max_tokens` son
  controles del runtime; ademas es lo que produce la migracion oficial de
  `options`. Se probo la forma `body` y "funciona" (el schema la acepta), pero
  cambia el destino del dato en silencio.
- **`git_publisher` se conserva**: memoria del proyecto (relevancia 0.87)
  registra que declararlo explicito fue el fix de un fallo real ("tools/list
  devuelve 4 tools"). No se toca aunque el global lo declare identico.
- **`external_directory` no se replica**: la doc v2 dice que las reglas de
  menor prioridad se cargan primero y las del global se **agregan despues**, o
  sea los arrays se concatenan. La regla del global sigue vigente.
- **`permission.write` no se reescribe como regla aparte**: v2 usa `edit` para
  escritura y edicion; la regla `edit` ya cubre ambos.

## 6. Plan de verificacion

1. `python -m json.tool opencode.json` -> exit 0.
2. `opencode debug config` en el worktree -> el documento del proyecto declara
   `providers`, `permissions`, `mcp` con `servers: [brain-ai, git_publisher]` y
   `settings: {temperature: 0.7, max_tokens: 4000}`.
3. Equivalencia contra el archivo v1 auto-migrado (mismo directorio temporal,
   `debug config` sobre cada uno, comparacion normalizada): `model`, `models`,
   `mcp` e `instructions` iguales; `permissions` difiere solo en la regla `edit`
   duplicada que genera la compatibilidad.
4. `npm run build` en `project/portfolio-ai-chat` -> exit 0 (gate pre-PR).
5. Revisar que el diff sea solo `opencode.json`.

## 7. Criterio de aceptacion

La config efectiva del archivo migrado es equivalente a la del archivo v1
auto-migrado por OpenCode, con un unico delta conocido (una regla duplicada que
la capa de compatibilidad genera y el archivo nuevo no).

## 8. Lecciones del fix (DESPUES de implementar, obligatorio)

- La premisa inicial "el esquema viejo falla en silencio" era **falsa** para
  `opencode.json`: la capa de compatibilidad lo migra. Lo que falla en silencio
  es la traduccion a mano: `options` -> `body` se acepta y cambia el destino
  del dato. Se corrigio a `settings` antes de commitear.
- Que seccion de este spec cambia por el fix: §1 y §5, que ahora afirman la
  equivalencia verificada en vez de una falla que no existe.
- Test anti-regresion que lo cubre: el paso 3 de §6 compara la config efectiva
  del archivo nuevo contra la del v1 migrado; si alguien vuelve a mover
  `settings` o duplica reglas, la comparacion deja de dar iguales.
