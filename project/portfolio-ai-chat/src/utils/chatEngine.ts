import {
  profile,
  social,
  skillGroups,
  projects,
  experience,
  assistant,
} from "../data/portfolio";

// Quita tildes y pasa a minúsculas para comparar texto sin problemas de acentos
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

type Intent = {
  id: string;
  keywords: string[];
  respuesta: () => string;
};

const primerNombre = profile.nombre.split(" ")[0];

function listaProyectos() {
  return projects
    .map(
      (p, i) =>
        `${i + 1}. **${p.titulo}** — ${p.descripcion} (${p.tags.join(", ")})`
    )
    .join("\n");
}

function listaExperiencia() {
  return experience
    .filter((e) => e.tipo === "trabajo")
    .map((e) => `• **${e.puesto}** en ${e.empresa} (${e.periodo})`)
    .join("\n");
}

function listaEducacion() {
  const edu = experience.filter((e) => e.tipo === "educacion");
  if (edu.length === 0) return "No hay información educativa cargada aún.";
  return edu
    .map((e) => `• **${e.puesto}** — ${e.empresa} (${e.periodo})`)
    .join("\n");
}

function listaSkills() {
  return skillGroups
    .map(
      (g) => `**${g.categoria}**: ${g.skills.map((s) => s.nombre).join(", ")}`
    )
    .join("\n");
}

const intents: Intent[] = [
  {
    id: "saludo",
    keywords: ["hola", "buenas", "hey", "holi", "que tal", "buenos dias", "buenas tardes", "buenas noches"],
    respuesta: () =>
      `¡Hola! 👋 Soy ${assistant.nombre}, la asistente virtual de ${profile.nombre}. Puedo contarte sobre su experiencia, proyectos, habilidades o cómo contactarlo. ¿Qué te gustaría saber?`,
  },
  {
    id: "quien_eres",
    keywords: [
      "quien eres",
      "que eres",
      "eres un bot",
      "eres una ia",
      "eres real",
      "eres humano",
      "eres humana",
      "eres inteligencia artificial",
    ],
    respuesta: () =>
      `Soy ${assistant.nombre} 🤖, un asistente virtual creado para ayudarte a conocer el perfil profesional de ${profile.nombre}. No soy ${primerNombre} en persona, ¡pero conozco muy bien su trabajo! Pregúntame lo que quieras sobre su experiencia o proyectos.`,
  },
  {
    id: "sobre_el",
    keywords: [
      "quien es",
      "cuentame de",
      "sobre el",
      "sobre ella",
      "hablame de",
      "background",
      "perfil profesional",
      "presentalo",
    ],
    respuesta: () => `${profile.sobreMi}`,
  },
  {
    id: "experiencia",
    keywords: [
      "experiencia",
      "trabajado",
      "empresas",
      "empleos anteriores",
      "trayectoria laboral",
      "donde trabajo",
      "donde ha trabajado",
    ],
    respuesta: () =>
      `Esta es la experiencia laboral de ${profile.nombre}:\n\n${listaExperiencia()}`,
  },
  {
    id: "educacion",
    keywords: [
      "estudios",
      "educacion",
      "universidad",
      "titulo",
      "carrera",
      "formacion academica",
      "donde estudio",
    ],
    respuesta: () => `Formación académica:\n\n${listaEducacion()}`,
  },
  {
    id: "proyectos",
    keywords: [
      "proyecto",
      "proyectos",
      "portafolio",
      "trabajos realizados",
      "que ha hecho",
      "que ha construido",
      "aplicaciones",
    ],
    respuesta: () =>
      `Estos son algunos proyectos destacados de ${profile.nombre}:\n\n${listaProyectos()}\n\nPuedes ver los detalles y demos en la sección "Proyectos" 👆`,
  },
  {
    id: "skills",
    keywords: [
      "habilidad",
      "habilidades",
      "tecnologia",
      "tecnologias",
      "stack",
      "lenguaje",
      "lenguajes",
      "sabe programar",
      "herramientas",
      "que sabe hacer",
    ],
    respuesta: () =>
      `${profile.nombre} domina estas tecnologías:\n\n${listaSkills()}`,
  },
  {
    id: "contacto",
    keywords: [
      "contacto",
      "contactar",
      "correo",
      "email",
      "escribirle",
      "comunicarme",
      "linkedin",
      "github",
      "redes",
      "contratar",
    ],
    respuesta: () => {
      const partes = [`Puedes contactar a ${profile.nombre} por:`, `📧 Email: ${profile.email}`];
      if (social.linkedin) partes.push(`💼 LinkedIn: ${social.linkedin}`);
      if (social.github) partes.push(`💻 GitHub: ${social.github}`);
      partes.push("\nTambién puedes usar el formulario en la sección de Contacto 👇");
      return partes.join("\n");
    },
  },
  {
    id: "disponibilidad",
    keywords: [
      "disponible",
      "buscando trabajo",
      "busca empleo",
      "esta libre",
      "puede empezar",
      "disponibilidad",
    ],
    respuesta: () =>
      profile.disponible
        ? `¡Sí! ${profile.nombre} está disponible actualmente y buscando nuevas oportunidades laborales. 🚀 Te recomiendo contactarlo pronto por email: ${profile.email}`
        : `Por el momento ${profile.nombre} no está buscando nuevas oportunidades activamente, pero siempre es buena idea dejarle un mensaje.`,
  },
  {
    id: "ubicacion",
    keywords: ["donde vive", "ubicacion", "ciudad", "pais", "de donde es", "localizacion"],
    respuesta: () => `${profile.nombre} está ubicado en ${profile.ubicacion}.`,
  },
  {
    id: "cv",
    keywords: ["cv", "curriculum", "resume", "hoja de vida", "descargar cv"],
    respuesta: () =>
      profile.cvUrl
        ? `Puedes descargar el CV de ${profile.nombre} aquí: ${profile.cvUrl}`
        : `Todavía no hay un CV en PDF cargado, pero toda la información relevante está en este sitio 😊 También puedes escribirle a ${profile.email} para solicitarlo.`,
  },
  {
    id: "agradecimiento",
    keywords: ["gracias", "muchas gracias", "genial gracias", "perfecto gracias"],
    respuesta: () =>
      `¡De nada! 😊 Si tienes más preguntas sobre ${profile.nombre}, aquí estoy.`,
  },
  {
    id: "despedida",
    keywords: ["adios", "chau", "nos vemos", "hasta luego", "bye"],
    respuesta: () =>
      `¡Hasta luego! 👋 No olvides contactar a ${profile.nombre} si te interesó su perfil.`,
  },
];

// Busca coincidencias por proyecto específico (ej: "cuéntame del ecommerce")
function buscarProyectoEspecifico(mensaje: string): string | null {
  for (const p of projects) {
    const tituloNorm = normalize(p.titulo);
    const palabrasTitulo = tituloNorm.split(" ").filter((w) => w.length > 3);
    const coincideTitulo = palabrasTitulo.some((w) => mensaje.includes(w));
    const coincideTag = p.tags.some((t) => mensaje.includes(normalize(t)));
    if (coincideTitulo || (coincideTag && mensaje.includes("proyecto"))) {
      const enlaces = [
        p.demo ? `🔗 Demo: ${p.demo}` : null,
        p.codigo ? `💻 Código: ${p.codigo}` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      return `**${p.titulo}**\n${p.descripcion}\n\nTecnologías: ${p.tags.join(", ")}\n${enlaces}`;
    }
  }
  return null;
}

const fallbacks = [
  (nombre: string) =>
    `Hmm, no estoy segura de haber entendido eso 🤔 Puedes preguntarme sobre la experiencia, proyectos, habilidades o cómo contactar a ${nombre}.`,
  (nombre: string) =>
    `No tengo información exacta sobre eso, pero puedo contarte sobre el trabajo, los proyectos o las habilidades de ${nombre}. ¿Te gustaría saber sobre alguno de esos temas?`,
  () =>
    `Todavía estoy aprendiendo 😅 Prueba preguntando algo como "¿Qué proyectos ha hecho?" o "¿Cómo lo contacto?".`,
];

export function getBotResponse(mensajeUsuario: string): string {
  const mensaje = normalize(mensajeUsuario);

  // 1. Buscar coincidencia de proyecto específico primero
  const proyectoEspecifico = buscarProyectoEspecifico(mensaje);
  if (proyectoEspecifico) return proyectoEspecifico;

  // 2. Buscar el intent con más palabras clave coincidentes
  let mejorIntent: Intent | null = null;
  let mejorPuntaje = 0;

  for (const intent of intents) {
    const puntaje = intent.keywords.reduce(
      (acc, kw) => (mensaje.includes(kw) ? acc + kw.split(" ").length : acc),
      0
    );
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejorIntent = intent;
    }
  }

  if (mejorIntent && mejorPuntaje > 0) {
    return mejorIntent.respuesta();
  }

  // 3. Fallback aleatorio
  const random = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  return random(profile.nombre);
}
