# 🚀 Mi Portafolio

Portafolio profesional hecho con **React + Vite + Tailwind CSS**. Se compila
como un único archivo `dist/index.html` autocontenido, lo que lo hace
compatible con **cualquier hosting gratuito**.

---

## 1. Personaliza tu contenido

Edita **`src/data/portfolio.ts`** con tu información (nombre, proyectos,
experiencia, skills, contacto). Es el único archivo que necesitas tocar.

## 2. Prueba en local

```bash
npm install
npm run dev
```

## 3. Genera el build de producción

```bash
npm run build
```

Esto crea la carpeta `dist/` con tu sitio listo para publicar.

---

## 4. Opciones GRATUITAS para publicarlo

| Plataforma | Dificultad | Dominio gratis | HTTPS | Recomendado para |
|---|---|---|---|---|
| **Netlify** | ⭐ Muy fácil | `tuproyecto.netlify.app` | ✅ | La opción más rápida y profesional |
| **Vercel** | ⭐ Muy fácil | `tuproyecto.vercel.app` | ✅ | Igual de buena que Netlify |
| **Cloudflare Pages** | ⭐⭐ Fácil | `tuproyecto.pages.dev` | ✅ | Muy rápido, ilimitado |
| **GitHub Pages** | ⭐⭐ Fácil (ya configurado) | `tuusuario.github.io` | ✅ | Si ya usas GitHub |
| **InfinityFree** | ⭐⭐⭐ Manual (FTP) | `tuproyecto.infinityfreeapp.com` | ✅ | Si quieres hosting "tradicional" |

👉 **Recomendación:** usa **Netlify** o **Vercel**. Son 100% gratis para
portafolios personales, no tienen anuncios, dan HTTPS automático y se ven
más profesionales frente a una empresa que un subdominio de InfinityFree.

---

### Opción A · Netlify (arrastrar y soltar, sin cuenta de GitHub necesaria)

1. Ejecuta `npm run build`.
2. Entra a https://app.netlify.com/drop
3. Arrastra la carpeta `dist` a la página.
4. Netlify te da una URL al instante (puedes cambiarla por un nombre
   personalizado gratis en *Site settings → Change site name*).

**Opción A2 · Netlify conectado a GitHub (auto-deploy):**
1. Sube tu código a un repositorio de GitHub.
2. En Netlify: *Add new site → Import an existing project → GitHub*.
3. Selecciona el repo. Netlify detecta automáticamente el archivo
   `netlify.toml` (ya incluido en este proyecto) con el comando de build.
4. Cada vez que hagas `git push`, se actualiza solo.

---

### Opción B · Vercel

1. Sube tu código a GitHub.
2. Entra a https://vercel.com y elige *Add New → Project*.
3. Importa el repositorio. Vercel detecta el archivo `vercel.json`
   (ya incluido) y hace el build automáticamente.
4. Te da una URL tipo `tuproyecto.vercel.app`.

---

### Opción C · Cloudflare Pages

1. Sube tu código a GitHub.
2. Entra a https://pages.cloudflare.com
3. Conecta tu repositorio.
4. Build command: `npm run build` · Output directory: `dist`
5. Deploy. Te da una URL `tuproyecto.pages.dev`.

---

### Opción D · GitHub Pages (ya configurado con GitHub Actions)

Este proyecto ya incluye el workflow `.github/workflows/deploy.yml` que
publica automáticamente en GitHub Pages cada vez que subes cambios a la
rama `main`.

1. Crea un repositorio en GitHub y sube el proyecto:
   ```bash
   git init
   git add .
   git commit -m "Mi portafolio"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
2. En GitHub, ve a *Settings → Pages*.
3. En "Build and deployment" → Source, elige **GitHub Actions**.
4. Espera 1-2 minutos y tu sitio estará en:
   `https://TU_USUARIO.github.io/TU_REPO/`

---

### Opción E · InfinityFree (hosting tipo tradicional, vía FTP)

1. Crea una cuenta gratis en https://infinityfree.com
2. Crea un nuevo sitio (te dan un subdominio gratis tipo
   `tuportafolio.infinityfreeapp.com`).
3. Ejecuta `npm run build` en tu proyecto.
4. Descarga un cliente FTP gratuito, por ejemplo **FileZilla**.
5. Usa los datos FTP que InfinityFree te da (host, usuario, contraseña) para
   conectarte.
6. Entra a la carpeta `htdocs` del servidor y sube **todo el contenido**
   de la carpeta `dist` (el archivo `index.html`).
7. Espera unos minutos a que se propague y visita tu subdominio.

> ⚠️ InfinityFree puede mostrar publicidad en el plan gratuito y a veces
> tarda en activar los dominios. Para un portafolio que verán reclutadores,
> Netlify o Vercel dan mejor impresión y son igual de gratuitos.

---

## 5. Después de publicar

- Copia la URL de tu sitio y agrégala a:
  - Tu perfil de **LinkedIn** (sección "Información de contacto" y en el
    encabezado).
  - Tu **CV / currículum**.
  - Tu **firma de correo electrónico**.
  - Tus mensajes al aplicar a vacantes.
- Si más adelante consigues trabajo y quieres un dominio propio (ej.
  `tunombre.dev`), puedes comprarlo y conectarlo gratis a Netlify o Vercel
  siguiendo sus guías de "Custom domain".
