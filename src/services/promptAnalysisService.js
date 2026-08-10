import { analyzePrompt } from "@/lib/promptAnalyzer.mjs";

// Este limite concentra a origem da análise. Uma API real pode substituir a
// implementação local sem alterar a interface da página.
export async function requestPromptAnalysis(prompt) {
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  return analyzePrompt(prompt);
}
