# Configuracion de API Token (PAT) — Paso a Paso

Playbook validado el 23/09/2026: permisos que `gh` necesita para crear y
mergear PRs desde el agente (cero friccion en publicaciones).

Resumen: se crea un **Fine-grained PAT** limitado al proyecto y se guarda en
una **variable de entorno User** (`GH_TOKEN`). El token **nunca** pasa por el
chat, ni queda en el repo ni en archivos del proyecto.

---

## Paso 1 — Crear el token en GitHub (navegador)

1. GitHub → avatar (esquina superior derecha) → **Settings** →
   **Developer settings** (barra izquierda, abajo) →
   **Personal access tokens** → **Fine-grained tokens** →
   **Generate new token**.
2. Configurar:
   - **Repository access:** *Only select repositories* → elegir el proyecto
     (ej. `seiji142/portfolio`).
   - **Permissions → Repository permissions:**
     - *Contents:* **Read and write** (necesario para mergear)
     - *Pull requests:* **Read and write** (crear/mergear PRs)
     - *Actions:* **Read** (ver estado de deploys con `gh run list`)
   - **Expiration:** 90 dias (o la que prefieras).
3. **Generate** → **copiar el token** (se muestra UNA sola vez; si se pierde,
   revocar y generar otro).

> Alternativa: token *classic* con scope `repo` — funciona pero da mas
> permisos de los necesarios. Preferir fine-grained.

## Paso 2 — Guardarlo como variable de entorno User

En una **terminal propia** (NUNCA pegarlo en el chat):

```powershell
[Environment]::SetEnvironmentVariable("GH_TOKEN", "<tu token>", "User")
```

**Cuidados con la sintaxis:**
- `<tu token>` es un **marcador de posicion**: reemplazar TODO el texto entre
  comillas (incluidos `<>`) por el token real. Los `<>` **no se escriben**.
- Mantener las comillas dobles.

Ejemplo de forma correcta (el valor va entre las comillas, sin `<>`):

```powershell
[Environment]::SetEnvironmentVariable("GH_TOKEN", "AQUI_VA_EL_TOKEN_REAL", "User")
```

## Paso 3 — Verificar (sin revelar el valor)

```powershell
# Existe y longitud (fine-grained tipeco = 93 caracteres) — no muestra el token
[Environment]::GetEnvironmentVariable("GH_TOKEN", "User").Length

# Autenticacion de gh (muestra estado/expiracion, jamas el valor)
gh auth status
```

Ubicacion fisica de la variable: registro **`HKEY_CURRENT_USER\Environment`**
(nivel *User*: solo tus usuarios de Windows; no requiere admin).
Tambien visible en: Win+R → `sysdm.cpl` → Avanzado → **Variables de entorno**.

## Paso 4 — Gotchas (descubiertos en la validacion)

1. **Los procesos abiertos NO heredan la variable nueva.** Si opencode/terminal
   ya estaba abierto al crearla, sus procesos hijos no la ven hasta reiniciar.
   Solucion usada: el script `gh-publish.ps1` la auto-carga:
   ```powershell
   if (-not $env:GH_TOKEN) {
       $env:GH_TOKEN = [Environment]::GetEnvironmentVariable("GH_TOKEN", "User")
   }
   ```
   (Se inyecta solo en el proceso de `gh`; nunca se imprime.)
2. **Verificacion sin exponer:** usar `.Length` o `gh auth status`; jamas
   imprimir el valor de la variable.
3. **Si `gh` falla por permisos:** regenerar el token incluyendo las
   permissions faltantes (ver Paso 1.2) y repetir Pasos 2-3.
4. **Expiracion:** al vencer (90 dias por defecto), repetir Pasos 1-3. Es la
   unica friccion recurrente del enfoque PAT.

## Paso 5 — Revocacion (si se filtra o ya no se usa)

GitHub → **Settings → Developer settings → Personal access tokens →
Fine-grained tokens** → seleccionar el token → **Delete**.
Si quedo en el registro: `[Environment]::SetEnvironmentVariable("GH_TOKEN", $null, "User")`.

---

## Reglas de seguridad (obligatorias)

- El token **nunca** en el chat, en commits, ni en archivos del repo.
- No usar el token para `git push` (git usa SSH; el token es SOLO para la
  API de GitHub — son capas distintas que se complementan).
- El script `gh-publish.ps1` no contiene secretos: lee la credencial de la
  variable de entorno en tiempo de ejecucion.

## Uso resultante

```powershell
.\scripts\gh-publish.ps1 -Merge     # PR develop -> main + merge (cero clics)
```

Ver `TEMPLATE_GITFLOW_GH_PAGES.md` seccion 8 (automatizacion de PRs con gh).