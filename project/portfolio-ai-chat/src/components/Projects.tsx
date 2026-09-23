import Section from "./Section";
import { projects } from "../data/portfolio";

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)$/i;

function isEmoji(str?: string) {
  return !!str && !/[\/\\]/.test(str) && !IMAGE_EXT.test(str);
}

export default function Projects() {
  return (
    <Section id="proyectos" eyebrow="Mi trabajo" titulo="Proyectos destacados">
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((p, i) => (
          <article
            key={i}
            className={`group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-white/[0.08] ${
              p.destacado ? "sm:col-span-1" : ""
            }`}
          >
            <div className="flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/20">
              {isEmoji(p.imagen) ? (
                <span className="text-6xl transition group-hover:scale-110">
                  {p.imagen}
                </span>
              ) : p.imagen ? (
                <img src={p.imagen} alt={p.titulo} className="h-full w-full object-cover" />
              ) : (
                <span className="text-6xl">📁</span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{p.titulo}</h3>
                {p.destacado && (
                  <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                    Destacado
                  </span>
                )}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                {p.descripcion}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-400"
                  >
                    Ver demo
                  </a>
                )}
                {p.codigo && (
                  <a
                    href={p.codigo}
                    target="_blank"
                    className="flex-1 rounded-lg border border-white/15 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Código
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
