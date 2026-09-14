import {
  containsSensitiveContent,
  createAssistantResponse,
  getSafeUserMessage,
} from "../lib/assistantEngine.mjs";

export async function requestAssistantResponse(message, context = {}) {
  const local = createAssistantResponse(message, context);
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
    if (!response.ok) return local;

    const data = await response.json();
    if (typeof data?.answer !== "string" || !data.answer.trim()) return local;
    return { ...local, answer: getSafeUserMessage(data.answer).slice(0, 2000) };
  } catch {
    return local;
  }
}
