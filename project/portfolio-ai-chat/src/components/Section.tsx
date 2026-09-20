import type { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow: string;
  titulo: string;
  children: ReactNode;
};

export default function Section({ id, eyebrow, titulo, children }: Props) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <div className="mb-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{titulo}</h2>
        <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
      </div>
      {children}
    </section>
  );
}
