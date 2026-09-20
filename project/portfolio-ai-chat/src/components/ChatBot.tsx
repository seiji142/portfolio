import { useEffect, useRef, useState } from "react";
import { assistant, profile } from "../data/portfolio";
import { getBotResponse } from "../utils/chatEngine";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
};

// Convierte **negrita** y saltos de línea en HTML simple y seguro
function renderText(text: string) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return withBold.replace(/\n/g, "<br/>");
}

function AssistantAvatar({ size = 44 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 ring-2 ring-white/20"
      style={{ width: size, height: size }}
    >
      {assistant.avatarUrl ? (
        <img
          src={assistant.avatarUrl}
          alt={assistant.nombre}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xl">
          🤖
        </span>
      )}
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  const welcomeText = assistant.mensajeBienvenida.replace(
    "{nombre}",
    profile.nombre
  );

  // Mensaje de bienvenida al abrir por primera vez
  useEffect(() => {
    if (open && messages.length === 0) {
      setTyping(true);
      const t = setTimeout(() => {
        idCounter.current += 1;
        setMessages([{ id: idCounter.current, from: "bot", text: welcomeText }]);
        setTyping(false);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [open, messages.length, welcomeText]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    idCounter.current += 1;
    const userMsg: Message = { id: idCounter.current, from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 500 + Math.random() * 700;
    setTimeout(() => {
      const respuesta = getBotResponse(trimmed);
      idCounter.current += 1;
      setMessages((prev) => [...prev, { id: idCounter.current, from: "bot", text: respuesta }]);
      setTyping(false);
    }, delay);
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => {
          setOpen((o) => !o);
          setHasNotification(false);
        }}
        aria-label="Abrir chat con el asistente virtual"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-slate-900/90 py-2 pl-2 pr-4 shadow-xl shadow-black/40 ring-1 ring-white/10 backdrop-blur transition hover:scale-105 md:bottom-8 md:right-8"
      >
        <span className="relative">
          <span className="absolute -inset-1 animate-pulse rounded-full bg-indigo-500/40 blur-md" />
          <span className="relative block animate-bounce-slow">
            <AssistantAvatar size={40} />
          </span>
          {hasNotification && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-fuchsia-500" />
            </span>
          )}
        </span>
        <span className="hidden text-sm font-medium text-white sm:inline">
          {open ? "Cerrar chat" : `Pregúntale a ${assistant.nombre}`}
        </span>
      </button>

      {/* Ventana de chat */}
      {open && (
        <div className="fixed inset-x-4 bottom-24 z-50 flex h-[70vh] max-h-[560px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur sm:inset-auto sm:bottom-28 sm:right-8 sm:w-96">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/20 p-4">
            <div className="animate-wave">
              <AssistantAvatar />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">{assistant.nombre}</p>
              <p className="flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Asistente virtual de {profile.nombre}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.from === "bot" && <AssistantAvatar size={28} />}
                <div
                  className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "rounded-br-sm bg-indigo-500 text-white"
                      : "rounded-bl-sm bg-white/10 text-slate-100"
                  }`}
                  dangerouslySetInnerHTML={{ __html: renderText(m.text) }}
                />
              </div>
            ))}

            {typing && (
              <div className="flex items-end gap-2">
                <AssistantAvatar size={28} />
                <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
                </div>
              </div>
            )}

            {/* Sugerencias rápidas */}
            {messages.length <= 1 && !typing && (
              <div className="flex flex-wrap gap-2 pt-2">
                {assistant.sugerencias.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-200 transition hover:bg-indigo-500/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-white/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white transition hover:bg-indigo-400 disabled:opacity-40"
              aria-label="Enviar mensaje"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m22 2-7 20-4-9-9-4Z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
