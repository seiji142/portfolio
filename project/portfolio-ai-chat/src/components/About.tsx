import Section from "./Section";
import { profile } from "../data/portfolio";

export default function About() {
  const stats = [
    { valor: "5+", label: "Años de experiencia" },
    { valor: "7+", label: "Proyectos realizados" },
    { valor: "100%", label: "Compromiso" },
  ];

  return (
    <Section id="sobre-mi" eyebrow="Conóceme" titulo="Sobre mí">
      <div className="grid gap-10 md:grid-cols-2">
        <p className="text-lg leading-relaxed text-slate-400">
          {profile.sobreMi}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
            >
              <div className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-3xl font-bold text-transparent">
                {s.valor}
              </div>
              <div className="mt-1 text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
