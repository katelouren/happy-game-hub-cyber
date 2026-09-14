import {
  containsSensitiveContent,
  createAssistantResponse,
  getSafeUserMessage,
} from "../../../src/lib/assistantEngine.mjs";

const TOPICS = new Set(["platform", "games", "prompts", "ai", "cyber", "safety", "unknown"]);
const INSTRUCTIONS = `Você é o assistente educacional do Happy Game Hub, uma plataforma gamificada de aprendizado, jogos, inteligência artificial e conscientização em cibersegurança.
Responda em português do Brasil, de forma clara, educativa e objetiva, em até 150 palavras.
Ajude com o uso do Happy Game Hub, escolha e compreensão de jogos, inteligência artificial, criação de prompts e boas práticas de segurança digital: golpes, phishing, senhas, autenticação, links suspeitos e privacidade.
A plataforma possui Home, Jogos, Recomendações e a área Cyber com avaliador de prompts, analisador local de senhas e este assistente. Não invente funcionalidades nem informações sobre o catálogo atual.
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
  if (containsSensitiveContent(message)) {
    return json({ answer: createAssistantResponse(message, context).answer });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return json({ error: "IA indisponível." }, 503);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini",
        instructions: `${INSTRUCTIONS}\nTópico de contexto: ${context.lastTopic ?? "não definido"}.`,
        input: message,
        max_output_tokens: 400,
        store: false,
      }),
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    if (!response.ok) return json({ error: "IA indisponível." }, 502);

    const data = await response.json();
    const answer = data.output
      ?.filter((item) => item.type === "message")
      .flatMap((item) => item.content ?? [])
      .filter((item) => item.type === "output_text" && typeof item.text === "string")
      .map((item) => item.text)
      .join("\n")
      .trim();
    if (data.status !== "completed" || !answer) return json({ error: "Resposta inválida da IA." }, 502);

    return json({ answer: getSafeUserMessage(answer).slice(0, 2000) });
  } catch {
    return json({ error: "IA indisponível." }, 502);
  }
}
