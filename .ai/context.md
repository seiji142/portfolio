# Contexto del Proyecto

## Stack Tecnologico

- **Frontend:** React 19 + TypeScript + Tailwind CSS 4
- **Build Tool:** Vite 7.3.2
- **Output:** HTML autocontenido (vite-plugin-singlefile)
- **Backend:** No aplica (portfolio estatico)
- **Base de datos:** No aplica

## Dependencias Principales

### Produccion
- `react` 19.2.6 / `react-dom` 19.2.6
- `clsx` 2.1.1 (utilidades de clases condicionales)
- `tailwind-merge` 3.4.0 (fusionar clases de Tailwind)

### Desarrollo
- `vite` 7.3.2 + `@vitejs/plugin-react` 5.1.1
- `tailwindcss` 4.1.17 + `@tailwindcss/vite` 4.1.17
- `typescript` 5.9.3
- `vite-plugin-singlefile` 2.3.0 (compila a un solo HTML)

## Variables de Entorno Requeridas

Ninguna. El proyecto es 100% estatico sin secrets ni API keys.

## Arquitectura

Portfolio personal estatico. Un solo archivo `src/data/portfolio.ts` contiene toda la informacion (perfil, proyectos, experiencia, skills, contacto). Los componentes React renderizan esa data.

### Estructura de componentes

| Componente | Funcion |
|------------|---------|
| `Hero.tsx` | Banner principal con nombre, rol, tagline |
| `About.tsx` | Seccion "Sobre mi" |
| `Experience.tsx` | Timeline de experiencia laboral y educacion |
| `Projects.tsx` | Grid de proyectos |
| `Skills.tsx` | Barras de habilidades por categoria |
| `Contact.tsx` | Formulario de contacto |
| `Navbar.tsx` | Navegacion fija |
| `Icons.tsx` | Iconos SVG (GitHub, LinkedIn, Twitter, Globe) |
| `Section.tsx` | Wrapper reutilizable de secciones |

## Convenciones de Archivos

| Tipo | Destino | Ejemplo |
|------|---------|---------|
| Componentes React | `src/components/` | `Hero.tsx` |
| Data del portfolio | `src/data/` | `portfolio.ts` |
| Utilidades | `src/utils/` | `cn.ts` |
| Estilos | `src/` | `index.css` |
| Build output | `dist/` | `index.html` autocontenido |

## Comandos Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (localhost:5173) |
| `npm run build` | Build de produccion en `dist/` |
| `npm run preview` | Previsualizar build localmente |

## Ramas del Proyecto

| Rama | Proposito | Sale de | Vuelve a | Proteccion |
|------|-----------|---------|----------|------------|
| `main` | Produccion · deploy GitHub Pages | — | — | Requiere PR, SIN "Require approvals" |
| `develop` | Desarrollo diario (rama por defecto) | `main` | `main` (PR al publicar) | No |
| `feature/<desc>` | Cada tarea o experimento | `develop` | `develop` (PR) | No |

Reglas de comportamiento:
- Trabajar SIEMPRE en `develop`. Antes de modificar, verificar la rama actual con `git status`/`git branch`; si se esta en `main`, no trabajar ahi.
- `main` solo se toca para publicar, via PR desde `develop`. El deploy de GitHub Pages se dispara con el merge a `main`.
- Tareas grandes o experimentos: crear `feature/<desc>` desde `develop` y mergear de vuelta a `develop`.
- La proteccion de `main` es "Requerir PR" SIN "Require approvals": en repo personal el autor no puede aprobar su propio PR (bloqueo permanente si se activa).
