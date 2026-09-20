import Section from "./Section";
import { profile, social } from "../data/portfolio";
import { GithubIcon, LinkedinIcon, MailIcon } from "./Icons";

export default function Contact() {
  return (
    <Section id="contacto" eyebrow="Hablemos" titulo="¿Trabajamos juntos?">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/10 p-8 text-center md:p-12">
        <p className="mx-auto max-w-xl text-lg text-slate-300">
          Estoy abierto a nuevas oportunidades y proyectos. Si crees que encajo
          en tu equipo, escríbeme y te responderé lo antes posible.
        </p>

        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-8 py-3.5 font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
        >
          <MailIcon className="h-5 w-5" />
          {profile.email}
        </a>

        <div className="mt-8 flex items-center justify-center gap-5">
          {social.github && (
            <a href={social.github} target="_blank" className="rounded-full border border-white/15 p-3 text-white transition hover:bg-white/10" aria-label="GitHub">
              <GithubIcon />
            </a>
          )}
          {social.linkedin && (
            <a href={social.linkedin} target="_blank" className="rounded-full border border-white/15 p-3 text-white transition hover:bg-white/10" aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
          )}
        </div>

        {(profile.telefono || profile.ubicacion) && (
          <p className="mt-6 text-sm text-slate-400">
            {profile.ubicacion}
            {profile.ubicacion && profile.telefono && " · "}
            {profile.telefono}
          </p>
        )}
      </div>
    </Section>
  );
}
