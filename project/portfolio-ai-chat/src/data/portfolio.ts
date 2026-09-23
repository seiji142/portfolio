// ============================================================
//  👉 EDITA TODO TU CONTENIDO AQUÍ. Es el único archivo que
//     necesitas cambiar para personalizar tu portafolio.
// ============================================================

export const profile = {
  nombre: "Seiji Tsumura",
  rol: "Analista Programador / Desarrollador", // Tu título profesional
  ubicacion: "Uruguay, Montevideo",
  email: "seijiworksproyect@gmail.com",
  telefono: "098298339",
  disponible: true, // muestra un badge "Disponible para trabajar"
  // Texto corto para el hero (1-2 frases que te definan)
  tagline:
    "Desarrollador con +10 años de experiencia creando soluciones que conectan personas y tecnología.",
  // Descripción larga para la sección "Sobre mí"
  sobreMi:
    "Soy Seiji Tsumura, Analista Programador egresado de la Universidad ORT con más de 10 años de experiencia en desarrollo de sistemas. Trabajé 5 años en la Jefatura de Policía de Montevideo y 2 años como encargado de sistemas en Toque y Toque. Actualmente desarrollo proyectos propios enfocados en inteligencia artificial y automatización. Me gusta aprender cosas nuevas y transformar ideas en productos funcionales.",
  fotoUrl: "/images/you26.jpg", // opcional: pon una URL o deja "" para usar iniciales
  cvUrl: "/cv-seiji-tsumura.html", // enlace a tu CV en HTML
};

export const social = {
  github: "https://github.com/seiji142",
  linkedin: "", // ocultar por ahora
  twitter: "", // deja "" para ocultar
  website: "",
};

// ============================================================
//  🤖 Asistente virtual (chatbot) que responde preguntas
//     sobre tu perfil profesional a quien visite el sitio.
// ============================================================
export const assistant = {
  nombre: "Lewinsky", // el nombre de tu asistente virtual
  avatarUrl: "/images/assistant-mony-01.jpg",
  mensajeBienvenida:
    "¡Hola! 👋 Soy Lewinsky, la asistente virtual de {nombre}. Te puedo ayudar con informacion sobre su experiencia, proyectos, CV o contacto. ¿Que te interesa conocer?",
  sugerencias: [
    "¿Qué experiencia tiene?",
    "Cuéntame sobre sus proyectos",
    "¿Cómo lo contacto?",
    "Ver CV",
  ],
};

export type Skill = { nombre: string; nivel: number }; // nivel 0-100

export const skillGroups: { categoria: string; skills: Skill[] }[] = [
  {
    categoria: "Frontend",
    skills: [
      { nombre: "HTML5 & CSS", nivel: 85 },
      { nombre: "JavaScript", nivel: 80 },
      { nombre: "TypeScript", nivel: 75 },
      { nombre: "Angular", nivel: 70 },
    ],
  },
  {
    categoria: "Backend",
    skills: [
      { nombre: "Python", nivel: 80 },
      { nombre: "Java / Spring Boot", nivel: 75 },
      { nombre: "PHP", nivel: 70 },
      { nombre: "C# / .NET", nivel: 65 },
      { nombre: "SQL Server / MySQL", nivel: 78 },
    ],
  },
  {
    categoria: "Herramientas",
    skills: [
      { nombre: "Git & GitHub", nivel: 80 },
      { nombre: "Visual Studio Code", nivel: 85 },
      { nombre: "Docker", nivel: 55 },
      { nombre: "Linux", nivel: 65 },
    ],
  },
];

export type Project = {
  titulo: string;
  descripcion: string;
  tags: string[];
  imagen?: string; // URL de imagen o emoji
  demo?: string; // enlace a la demo en vivo
  codigo?: string; // enlace al repositorio
  destacado?: boolean;
};

export const projects: Project[] = [
  {
    titulo: "ChatBot WhatsApp",
    descripcion:
      "Agente de WhatsApp con memoria persistente para modelos de IA. Permite mantener conversaciones contextuales a través de WhatsApp.",
    tags: ["Python", "AI", "WhatsApp"],
    imagen: "/images/projects/chatbot-whatsapp.png",
    codigo: "https://github.com/seiji142/whatsapp-agent-sin-web",
    destacado: true,
  },
  {
    titulo: "Brain AI - Memoria Persistente",
    descripcion:
      "Sistema de memoria persistente para modelos de IA. Permite que los modelos recuerden conversaciones y decisiones anteriores.",
    tags: ["Python", "AI", "Memory"],
    imagen: "/images/projects/brain-ai.png",
    codigo: "https://github.com/seiji142/brain-ai-01",
    destacado: true,
  },
  {
    titulo: "Personalizar Comportamiento IA",
    descripcion:
      "Framework para personalizar el comportamiento de modelos de IA en OpenCode. Define reglas, contexto y personalidad para asistentes virtuales.",
    tags: ["Python", "AI", "Framework"],
    imagen: "/images/projects/personalizar-ia.png",
    codigo: "https://github.com/seiji142/personalizar-comportamiento-01",
  },
  {
    titulo: "Portfolio Web con Chatbot",
    descripcion:
      "Sitio web personal con asistente virtual integrado. Desarrollado con React, TypeScript y Tailwind CSS.",
    tags: ["React", "TypeScript", "Tailwind"],
    imagen: "/images/projects/portfolio-web.png",
  },
];

export type Experience = {
  puesto: string;
  empresa: string;
  periodo: string;
  descripcion: string;
  tipo: "trabajo" | "educacion";
};

export const experience: Experience[] = [
  {
    puesto: "Desarrollador / Encargado de Sistemas",
    empresa: "Toque y Toque",
    periodo: "2022 — 2024",
    descripcion:
      "Desarrollo de soluciones, mantenimiento de sitio web y sistema interno. Gestión de base de datos y APIs.",
    tipo: "trabajo",
  },
  {
    puesto: "Desarrollador / Administrativo",
    empresa: "Jefatura de Policía de Montevideo",
    periodo: "2011 — 2019",
    descripcion:
      "Desarrollo y mantenimiento de sistemas. Administración de bases de datos y aplicaciones internas.",
    tipo: "trabajo",
  },
  {
    puesto: "Dibujante Técnico",
    empresa: "Campiglia S.A",
    periodo: "2010",
    descripcion:
      "Dibujo y relevamiento de redes para la empresa ANTEL.",
    tipo: "trabajo",
  },
  {
    puesto: "Pasante",
    empresa: "De Larrobla y Asociados",
    periodo: "2010",
    descripcion:
      "Manejo de software Genexus 9.0.",
    tipo: "trabajo",
  },
  {
    puesto: "Analista Programador",
    empresa: "Universidad ORT",
    periodo: "2015 — 2020",
    descripcion:
      "Formación en programación, bases de datos, ingeniería de software. Promedio materias aprobadas: 80%.",
    tipo: "educacion",
  },
  {
    puesto: "Python for Data Science",
    empresa: "IBM",
    periodo: "2022",
    descripcion:
      "Curso de especialización en Python para ciencia de datos.",
    tipo: "educacion",
  },
];
