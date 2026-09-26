import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import ChatBot from "./components/ChatBot";
import WaterBackground from "./components/WaterBackground";
import { profile } from "./data/portfolio";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/40">
      <WaterBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {profile.nombre}. Hecho con React + Tailwind.
        </footer>
      </div>
      <ChatBot />
    </div>
  );
}
