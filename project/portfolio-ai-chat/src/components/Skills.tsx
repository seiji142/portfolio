import Section from "./Section";
import { skillGroups } from "../data/portfolio";

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Herramientas" titulo="Habilidades técnicas">
      <div className="grid gap-8 md:grid-cols-3">
        {skillGroups.map((group) => (
          <div
            key={group.categoria}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h3 className="mb-5 text-lg font-semibold text-white">
              {group.categoria}
            </h3>
            <div className="space-y-4">
              {group.skills.map((s) => (
                <div key={s.nombre}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-300">{s.nombre}</span>
                    <span className="text-slate-500">{s.nivel}%</span>
                  </div>
                  <div
                    className="h-2 w-full overflow-hidden rounded-full bg-white/10"
                    role="progressbar"
                    aria-valuenow={s.nivel}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${s.nombre} ${s.nivel}%`}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                      style={{ width: `${s.nivel}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
