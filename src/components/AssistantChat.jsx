"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Bot,
  LoaderCircle,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import {
  ASSISTANT_WELCOME,
  createAssistantResponse,
  getQuickPrompts,
  getSafeUserMessage,
} from "@/lib/assistantEngine.mjs";
import { recordAssistantInteraction } from "@/lib/activityStore";

const STORAGE_KEY = "happy-game-hub:assistant:v1";
const ALLOWED_TOPICS = new Set([
  "platform",
  "games",
  "prompts",
  "ai",
  "cyber",
  "safety",
  "unknown",
]);
const RISK_LEVELS = new Set(["Baixo", "Médio", "Alto"]);
const ASSESSMENT_FIELDS = [
  "situation",
  "classification",
  "category",
  "riskLevel",
  "alert",
  "recommendedAction",
];
const CATEGORY_LABELS = {
  "credential-request": "Credenciais",
  "unknown-link": "Link desconhecido",
  "authentication-code-request": "Código de autenticação",
  "urgent-payment": "Pagamento urgente",
  "suspicious-download": "Download suspeito",
  "personal-data-request": "Dados pessoais",
  "low-risk": "Baixo risco",
  unknown: "Não classificada",
  "sensitive-data": "Conteúdo sensível",
};
const WELCOME_MESSAGE = {
  id: "assistant-welcome",
  role: "assistant",
  content: ASSISTANT_WELCOME,
};

function sanitizeText(value, maxLength = 2000) {
  if (typeof value !== "string") return "";
  return getSafeUserMessage(value).slice(0, maxLength);
}

function normalizeContext(value) {
  const lastTopic = value?.lastTopic;
  return {
    lastTopic:
      typeof lastTopic === "string" && ALLOWED_TOPICS.has(lastTopic)
        ? lastTopic
        : null,
  };
}

function normalizeAssessment(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const source =
    value.metadata && typeof value.metadata === "object"
      ? value.metadata
      : value.securityAssessment && typeof value.securityAssessment === "object"
        ? value.securityAssessment
        : value;
  const assessment = {};

  for (const field of ASSESSMENT_FIELDS) {
    const maxLength = field === "category" || field === "riskLevel" ? 80 : 900;
    const safeValue = sanitizeText(source[field], maxLength);
    if (safeValue) assessment[field] = safeValue;
  }

  if (
    assessment.riskLevel &&
    !RISK_LEVELS.has(assessment.riskLevel)
  ) {
    delete assessment.riskLevel;
  }

  if (
    assessment.category &&
    !/^[a-z0-9-]+$/.test(assessment.category)
  ) {
    delete assessment.category;
  }

  return Object.keys(assessment).length > 0 ? assessment : null;
}

function serializeMessage(message) {
  const content = sanitizeText(message.content);
  if (!content) return null;

  const serialized = { role: message.role, content };
  const metadata =
    message.role === "assistant"
      ? normalizeAssessment(message.metadata)
      : null;

  if (metadata) serialized.metadata = metadata;
  return serialized;
}

function riskLevelClasses(riskLevel) {
  if (riskLevel === "Alto") {
    return "border-red-400/40 bg-red-400/10 text-red-200";
  }

  if (riskLevel === "Médio") {
    return "border-amber-400/40 bg-amber-400/10 text-amber-200";
  }

  return "border-lime-400/40 bg-lime-400/10 text-lime-200";
}

function SecurityAssessment({ metadata }) {
  if (!metadata) return null;

  return (
    <div
      className="mt-4 border-t border-slate-700 pt-4"
      role="group"
      aria-label="Avaliação estruturada de segurança"
    >
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-300">
        <ShieldCheck size={15} aria-hidden="true" />
        Avaliação de segurança
      </p>

      <dl className="mt-3 space-y-3 text-sm leading-relaxed">
        {metadata.situation && (
          <div>
            <dt className="font-bold text-slate-200">1. Situação</dt>
            <dd className="mt-1 text-slate-400">{metadata.situation}</dd>
          </div>
        )}

        {(metadata.classification || metadata.category) && (
          <div>
            <dt className="font-bold text-slate-200">2. Classificação</dt>
            {metadata.classification && (
              <dd className="mt-1 text-slate-400">{metadata.classification}</dd>
            )}
            {metadata.category && (
              <dd className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Categoria: {CATEGORY_LABELS[metadata.category] ?? metadata.category}
              </dd>
            )}
          </div>
        )}

        {metadata.riskLevel && (
          <div>
            <dt className="font-bold text-slate-200">3. Nível de risco</dt>
            <dd className="mt-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${riskLevelClasses(metadata.riskLevel)}`}
              >
                {metadata.riskLevel}
              </span>
            </dd>
          </div>
        )}

        {metadata.alert && (
          <div>
            <dt className="font-bold text-slate-200">4. Alerta</dt>
            <dd className="mt-1 text-slate-400">{metadata.alert}</dd>
          </div>
        )}

        {metadata.recommendedAction && (
          <div className="rounded-xl border border-lime-400/20 bg-lime-400/5 p-3">
            <dt className="font-bold text-lime-300">5. Ação recomendada</dt>
            <dd className="mt-1 text-slate-300">
              {metadata.recommendedAction}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function restoreConversation() {
  if (typeof window === "undefined") return null;

  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    const messages = Array.isArray(parsed.messages)
      ? parsed.messages
          .filter(
            (message) =>
              (message?.role === "user" || message?.role === "assistant") &&
              typeof message?.content === "string",
          )
          .slice(-30)
          .map((message, index) => {
            const serialized = serializeMessage(message);
            return serialized
              ? {
                  id: `restored-${index}`,
                  ...serialized,
                }
              : null;
          })
          .filter(Boolean)
      : [];

    return {
      messages: messages.length > 0 ? messages : [WELCOME_MESSAGE],
      context: normalizeContext(parsed.context),
    };
  } catch {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // O navegador também pode bloquear a remoção; o chat usa o estado em memória.
    }
    return null;
  }
}

export default function AssistantChat({
  className = "",
  compact = false,
  focusOnMount = false,
  pathname = "/cyber/assistente",
  responseProvider = createAssistantResponse,
}) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [context, setContext] = useState({ lastTopic: null });
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const messageCounter = useRef(0);
  const requestGeneration = useRef(0);

  const suggestions = useMemo(() => getQuickPrompts(pathname), [pathname]);
  const hasUserMessages = messages.some((message) => message.role === "user");

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;
      const restored = restoreConversation();

      if (restored) {
        setMessages(restored.messages);
        setContext(restored.context);
      }

      setHydrated(true);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;

    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages: messages.map(serializeMessage).filter(Boolean),
          context: normalizeContext(context),
        }),
      );
    } catch {
      // O chat segue ativo em memória quando o navegador bloqueia o storage.
    }
  }, [context, hydrated, messages]);

  useEffect(() => {
    if (focusOnMount) inputRef.current?.focus();
  }, [focusOnMount]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, status]);

  function nextMessageId(role) {
    messageCounter.current += 1;
    return `${role}-${messageCounter.current}`;
  }

  async function sendMessage(value) {
    const input = String(value ?? "").trim();

    if (!input) {
      setStatus("error");
      setErrorMessage("Digite uma pergunta ou escolha uma sugestão para continuar.");
      inputRef.current?.focus();
      return;
    }

    if (status === "loading") return;

    const safeInput = getSafeUserMessage(input);
    const userMessage = {
      id: nextMessageId("user"),
      role: "user",
      content: safeInput,
    };

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setStatus("loading");
    setErrorMessage("");
    requestGeneration.current += 1;
    const currentRequest = requestGeneration.current;

    try {
      await new Promise((resolve) => setTimeout(resolve, 320));
      if (requestGeneration.current !== currentRequest) return;

      const response =
        safeInput === input
          ? await responseProvider(input, context)
          : createAssistantResponse(input, context);

      if (requestGeneration.current !== currentRequest) return;

      if (!response || typeof response.answer !== "string") {
        throw new Error("Resposta inválida do assistente.");
      }

      const safeAnswer = sanitizeText(response.answer);
      if (!safeAnswer) throw new Error("Resposta vazia do assistente.");

      setMessages((current) => [
        ...current,
        {
          id: nextMessageId("assistant"),
          role: "assistant",
          content: safeAnswer,
          metadata: normalizeAssessment(response),
        },
      ]);
      setContext(normalizeContext(response.context ?? context));
      recordAssistantInteraction(
        ALLOWED_TOPICS.has(response.topic) ? response.topic : "geral",
      );
      setStatus("success");
    } catch {
      if (requestGeneration.current !== currentRequest) return;

      setStatus("error");
      setErrorMessage(
        "Não foi possível gerar a resposta agora. Tente novamente em instantes.",
      );
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function startNewConversation() {
    requestGeneration.current += 1;
    setMessages([WELCOME_MESSAGE]);
    setContext({ lastTopic: null });
    setDraft("");
    setStatus("idle");
    setErrorMessage("");

    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // O estado em memória já foi reiniciado acima.
      }
    }

    inputRef.current?.focus();
  }

  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#061225] ${className}`}
      aria-label="Conversa com o Assistente de Segurança"
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-lime-400/20 bg-[#020817] text-lime-400">
            <Bot size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-bold text-white">
              Assistente de Segurança
            </h2>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <ShieldCheck size={13} className="text-lime-400" aria-hidden="true" />
              Triagem educativa com regras locais
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={startNewConversation}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-lime-400/60 hover:text-lime-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
          aria-label="Iniciar nova conversa"
        >
          <RotateCcw size={16} aria-hidden="true" />
          <span className={compact ? "sr-only" : "hidden sm:inline"}>
            Nova conversa
          </span>
        </button>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-busy={status === "loading"}
        className={`min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6 ${
          compact ? "max-h-[48vh] min-h-64" : "min-h-96 max-h-[58vh]"
        }`}
      >
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";

          return (
            <article
              key={message.id}
              className={`flex items-start gap-3 ${
                isAssistant ? "pr-4 sm:pr-10" : "flex-row-reverse pl-4 sm:pl-10"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isAssistant
                    ? "bg-lime-400 text-slate-950"
                    : "border border-slate-700 bg-[#020817] text-slate-300"
                }`}
                aria-hidden="true"
              >
                {isAssistant ? <Bot size={17} /> : <User size={17} />}
              </span>
              <div
                className={`min-w-0 break-words rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-base ${
                  isAssistant
                    ? "rounded-tl-sm border border-slate-800 bg-[#020817] text-slate-300"
                    : "rounded-tr-sm bg-lime-400 font-medium text-slate-950"
                }`}
              >
                <span className="sr-only">
                  {isAssistant ? "Assistente: " : "Você: "}
                </span>
                <p>{message.content}</p>
                {isAssistant && (
                  <SecurityAssessment metadata={message.metadata} />
                )}
              </div>
            </article>
          );
        })}

        {!hasUserMessages && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-[#020817]/70 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Sparkles size={17} className="text-lime-400" aria-hidden="true" />
              Sua conversa está vazia. Comece por uma sugestão:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendMessage(suggestion)}
                  disabled={status === "loading"}
                  className="rounded-full border border-lime-400/30 px-3 py-2 text-left text-xs font-semibold text-lime-300 transition hover:border-lime-400 hover:bg-lime-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="flex items-center gap-3 text-sm text-slate-400" role="status">
            <LoaderCircle
              size={18}
              className="animate-spin text-lime-400"
              aria-hidden="true"
            />
            Classificando a situação com segurança...
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 p-4 sm:p-5">
        {status === "error" && (
          <div
            className="mb-3 flex items-start justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200"
            role="alert"
          >
            <span className="flex items-start gap-2">
              <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
              {errorMessage}
            </span>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setErrorMessage("");
              }}
              className="shrink-0 rounded text-red-100 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200"
              aria-label="Fechar aviso de erro"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="assistant-message" className="sr-only">
            Escreva sua pergunta para o assistente
          </label>
          <div className="flex items-end gap-2 rounded-2xl border border-slate-700 bg-[#020817] p-2 transition focus-within:border-lime-400">
            <textarea
              ref={inputRef}
              id="assistant-message"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                if (status === "error") {
                  setStatus("idle");
                  setErrorMessage("");
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage(draft);
                }
              }}
              rows={compact ? 2 : 3}
              maxLength={600}
              disabled={status === "loading"}
            placeholder="Descreva a situação sem incluir dados pessoais..."
              className="min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 disabled:cursor-wait sm:text-base"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-400 text-slate-950 transition hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 disabled:cursor-wait disabled:opacity-50"
              aria-label={status === "loading" ? "Enviando pergunta" : "Enviar pergunta"}
            >
              {status === "loading" ? (
                <LoaderCircle size={20} className="animate-spin" aria-hidden="true" />
              ) : (
                <Send size={20} aria-hidden="true" />
              )}
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Não compartilhe senhas, documentos, tokens ou dados pessoais. Enter envia;
            Shift + Enter cria uma nova linha.
          </p>
        </form>
      </div>
    </section>
  );
}
