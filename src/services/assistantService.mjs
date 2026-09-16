import {
  containsSensitiveContent,
  createAssistantResponse,
  getSafeUserMessage,
} from "../lib/assistantEngine.mjs";

export async function requestAssistantResponse(message, context = {}) {
  const local = { ...createAssistantResponse(message, context), provider: "gemini", mode: "local", unavailable: false };
  const fallback = { ...local, unavailable: true };
  if (!message.trim() || message.length > 600 || containsSensitiveContent(message)) {
    return local;
  }

  try {
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context: { lastTopic: local.context.lastTopic } }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return fallback;

    const data = await response.json();
    if (typeof data?.answer !== "string" || !data.answer.trim() ||
        data.provider !== "gemini" || !["live", "local"].includes(data.mode) ||
        containsSensitiveContent(data.answer)) return fallback;
    return {
      ...local,
      answer: getSafeUserMessage(data.answer).slice(0, 2000),
      mode: data.mode,
      unavailable: data.mode === "local" && data.unavailable === true,
    };
  } catch {
    return fallback;
  }
}
