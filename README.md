# Portfolio Personal - Seiji Tsumura

Portfolio profesional con asistente virtual integrado, desarrollado con React, TypeScript y Tailwind CSS. Compila a un solo archivo HTML autocontenido compatible con cualquier hosting gratuito.

## Características

- Diseño responsive con tema oscuro (indigo/fuchsia)
- Asistente virtual integrado (chatbot "Lewinsky")
- Memoria persistente vía brain-ai-01 (MCP server)
- Imágenes de proyectos generadas con IA
- Build optimizado a un solo HTML (vite-plugin-singlefile)
- Sin dependencias de backend o base de datos

## Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19.2.6 | UI Library |
| TypeScript | 5.9.3 | Tipado estático |
| Tailwind CSS | 4.1.17 | Estilos |
| Vite | 7.3.2 | Build tool |
| vite-plugin-singlefile | 2.3.0 | HTML autocontenido |

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (localhost:5173)
npm run dev

# Build de producción
npm run build

# Previsualizar build
npm run preview
```

## Personalización

Edita **`src/data/portfolio.ts`** con tu información. Es el único archivo que necesitas cambiar:

- `profile` - Datos personales (nombre, rol, email, teléfono, foto, CV)
- `social` - Redes sociales (GitHub, LinkedIn, Twitter)
- `assistant` - Configuración del chatbot (nombre, mensaje, sugerencias)
- `skillGroups` - Habilidades técnicas organizadas por categoría
- `projects` - Proyectos con imágenes, descripciones y enlaces
- `experience` - Experiencia laboral y educación

## Estructura del Proyecto

```
portfolio/
├── .ai/                    # Configuración de comportamiento del agente
│   ├── system.md           #   Rol, tono y estilo
│   ├── rules.md            #   Reglas obligatorias
│   ├── context.md          #   Stack técnico
│   ├── agents.md           #   Agentes especializados
│   └── MEMORY.md           #   Instrucciones de memoria
│
├── project/
│   └── portfolio-ai-chat/  # Código fuente del portfolio
│       ├── src/
│       │   ├── components/ #   Componentes React
│       │   ├── data/       #   Datos del portfolio
│       │   ├── utils/      #   Utilidades
│       │   └── App.tsx     #   Componente principal
│       ├── public/
│       │   └── images/     #   Imágenes del sitio
│       └── dist/           #   Build de producción
│
├── docs/                   # Documentación y recursos
├── scripts/                # Scripts de utilería
└── tests/                  # Tests del proyecto
```

## Despliegue

### Opciones Gratuitas

| Plataforma | Dificultad | Dominio gratis | Recomendado |
|------------|------------|----------------|-------------|
| **Netlify** | ⭐ Muy fácil | `tuproyecto.netlify.app` | ✅ |
| **Vercel** | ⭐ Muy fácil | `tuproyecto.vercel.app` | ✅ |
| **Cloudflare Pages** | ⭐⭐ Fácil | `tuproyecto.pages.dev` | ✅ |
| **GitHub Pages** | ⭐⭐ Fácil | `tuusuario.github.io` | ✅ |

### Netlify (Recomendado)

1. Ejecuta `npm run build`
2. Entra a https://app.netlify.com/drop
3. Arrastra la carpeta `dist` a la página
4. Tu sitio estará online al instante

### Vercel

1. Sube el código a GitHub
2. Entra a https://vercel.com → Add New → Project
3. Importa el repositorio (detecta `vercel.json` automáticamente)
4. Despliegue automático en cada push

## Proyectos Incluidos

| Proyecto | Descripción | Tecnologías |
|----------|-------------|-------------|
| ChatBot WhatsApp | Agente de WhatsApp con memoria persistente | Python, AI |
| Brain AI | Servidor MCP para memoria persistente | Python, FastAPI |
| Personalizar Comportamiento IA | Framework para validar comportamiento de modelos IA | Python, Testing |
| Portfolio con Chatbot | Este sitio web | React, TypeScript |

## Configuración del Agente (AI)

Este proyecto usa archivos `.ai/` para configurar el comportamiento del asistente:

- `system.md` - Define el rol y tono del agente
- `rules.md` - Reglas de seguridad y calidad
- `context.md` - Información del stack técnico
- `agents.md` - Agentes especializados (frontend, backend, etc.)
- `MEMORY.md` - Instrucciones de memoria persistente

## Licencia

Proyecto personal. Todos los derechos reservados.
