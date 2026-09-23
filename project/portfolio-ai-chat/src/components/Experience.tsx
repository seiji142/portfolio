import Section from "./Section";
import { experience } from "../data/portfolio";

export default function Experience() {
  return (
    <Section id="experiencia" eyebrow="Trayectoria" titulo="Experiencia y educación">
      <div className="relative border-l border-white/10 pl-8">
        {experience.map((item, i) => (
          <div key={i} className="relative mb-10 last:mb-0">
            <span
              className={`absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-slate-950 ${
                item.tipo === "trabajo" ? "bg-indigo-500" : "bg-fuchsia-500"
              }`}
            >
              <span className="text-xs" aria-hidden="true">
                {item.tipo === "trabajo" ? "💼" : "🎓"}
              </span>
            </span>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-white">{item.puesto}</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                  {item.periodo}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-indigo-300">
                {item.empresa}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {item.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
