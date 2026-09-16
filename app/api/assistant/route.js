import { COMPETENCY_INSTRUCTIONS } from "../../../src/lib/competencies.mjs";
import {
  containsSensitiveContent,
  createAssistantResponse,
  getSafeUserMessage,
} from "../../../src/lib/assistantEngine.mjs";

const TOPICS = new Set(["platform", "games", "prompts", "ai", "cyber", "safety", "unknown"]);
const INSTRUCTIONS = `Você é o assistente educacional do Happy Game Hub, uma plataforma gamificada de aprendizado, jogos, inteligência artificial e conscientização em cibersegurança.
Responda em português do Brasil, de forma clara, educativa e objetiva, em até 150 palavras.
Ajude com o uso do Happy Game Hub, escolha e compreensão de jogos, inteligência artificial, criação de prompts e boas práticas de segurança digital: golpes, phishing, senhas, autenticação, links suspeitos e privacidade.
A plataforma possui Home, Jogos, Recomendações e a área Cyber com o Assistente de Cibersegurança e Aprendizagem. Não invente funcionalidades nem informações sobre o catálogo atual.
Priorize prevenção. Nunca peça senhas, tokens, documentos ou dados pessoais. Não ensine técnicas ofensivas, invasão ou exploração. Oriente a verificar fontes e canais oficiais. Deixe claro quando não houver informação suficiente para determinar se algo é seguro.
Prefira respostas práticas, curtas e fáceis de entender. Não use HTML.`;

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Mensagem inválida." }, 400);
  }

  if (typeof body?.message !== "string" || !body.message.trim() || body.message.length > 600) {
    return json({ error: "Envie uma pergunta com até 600 caracteres." }, 400);
  }

  const message = body.message.trim();
  const context = { lastTopic: TOPICS.has(body.context?.lastTopic) ? body.context.lastTopic : null };
  const local = (unavailable = false) => json({
    answer: createAssistantResponse(message, context).answer,
    provider: "gemini",
    mode: "local",
    unavailable,
  });
  if (containsSensitiveContent(message)) return local();

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const provider = process.env.AI_PROVIDER?.trim() || "gemini";
  if (provider !== "gemini" || !apiKey) return local(true);
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: `${INSTRUCTIONS}\n${COMPETENCY_INSTRUCTIONS}\nTópico de contexto: ${context.lastTopic ?? "não definido"}.` }],
        },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 2048 },
      }),
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    if (!response.ok) return local(true);

    const data = await response.json();
    const candidate = data.candidates?.[0];
    if (data.promptFeedback?.blockReason || candidate?.finishReason !== "STOP") return local(true);
    const answer = candidate.content?.parts
      ?.filter((part) => !part.thought && typeof part.text === "string")
      .map((part) => part.text)
      .join("\n")
      .trim();
    if (!answer || containsSensitiveContent(answer) || answer.includes(apiKey)) return local(true);

    return json({ answer: getSafeUserMessage(answer).slice(0, 2000), provider: "gemini", mode: "live", unavailable: false });
  } catch {
    return local(true);
  }
}
