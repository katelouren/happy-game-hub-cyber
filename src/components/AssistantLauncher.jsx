"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import AssistantChat from "@/components/AssistantChat";

export default function AssistantLauncher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const launcherRef = useRef(null);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    }

    if (isOpen) document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (pathname === "/cyber/assistente") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <aside
          id="assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Assistente educativo do Happy Game Hub"
          className="mb-3 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-3xl border border-lime-400/30 bg-[#020817] shadow-2xl shadow-black/50"
        >
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
            <p className="flex items-center gap-2 text-sm font-bold text-white">
              <Bot size={18} className="text-lime-400" aria-hidden="true" />
              Ajuda rápida
            </p>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                launcherRef.current?.focus();
              }}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
              aria-label="Fechar assistente"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <AssistantChat
            compact
            focusOnMount
            pathname={pathname}
            className="rounded-none border-0"
          />
        </aside>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="assistant-panel"
        aria-haspopup="dialog"
        className="ml-auto flex items-center gap-3 rounded-full border border-lime-300 bg-lime-400 px-5 py-3 font-extrabold text-slate-950 shadow-lg shadow-lime-400/10 transition hover:-translate-y-0.5 hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-400"
      >
        {isOpen ? <X size={22} aria-hidden="true" /> : <MessageCircle size={22} aria-hidden="true" />}
        <span>{isOpen ? "Fechar" : "Pergunte ao assistente"}</span>
      </button>
    </div>
  );
}
