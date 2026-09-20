import { profile, social } from "../data/portfolio";
import { GithubIcon, LinkedinIcon, TwitterIcon, GlobeIcon } from "./Icons";

export default function Hero() {
  const initials = profile.nombre
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {/* fondos decorativos */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          {profile.disponible && (
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Disponible para trabajar
            </span>
          )}

          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Hola, soy{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
              {profile.nombre}
            </span>
          </h1>
          <p className="mt-3 text-xl font-medium text-slate-300">{profile.rol}</p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            {profile.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#proyectos"
              className="rounded-full bg-indigo-500 px-7 py-3 font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
            >
              Ver proyectos
            </a>
            {profile.cvUrl ? (
              <a
                href={profile.cvUrl}
                target="_blank"
                className="rounded-full border border-white/20 px-7 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Descargar CV
              </a>
            ) : (
              <a
                href="#contacto"
                className="rounded-full border border-white/20 px-7 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Contáctame
              </a>
            )}
          </div>

          {/* Redes sociales (oculto por ahora)
          <div className="mt-8 flex items-center gap-4">
            {social.github && (
              <a href={social.github} target="_blank" className="text-slate-400 transition hover:text-white" aria-label="GitHub">
                <GithubIcon />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" className="text-slate-400 transition hover:text-white" aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" className="text-slate-400 transition hover:text-white" aria-label="Twitter/X">
                <TwitterIcon />
              </a>
            )}
            {social.website && (
              <a href={social.website} target="_blank" className="text-slate-400 transition hover:text-white" aria-label="Sitio web">
                <GlobeIcon />
              </a>
            )}
          </div>
          */}
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 opacity-40 blur-2xl" />
            {profile.fotoUrl ? (
              <img
                src={profile.fotoUrl}
                alt={profile.nombre}
                className="relative h-56 w-56 rounded-full border-4 border-white/10 object-cover object-[center_2px] md:h-72 md:w-72"
              />
            ) : (
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-4 border-white/10 bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-6xl font-bold text-white md:h-72 md:w-72 md:text-7xl">
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
