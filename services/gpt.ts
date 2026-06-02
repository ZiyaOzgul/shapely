import type { TransformOptions } from "@/types";
import {
  SYSTEM_PROMPTS,
  FALLBACK_PROMPT,
  buildPersonalizationBlock,
} from "@/services/aiPrompts";

export async function transformWithGPT(
  userText: string,
  destination: string,
  tone: string,
  options?: TransformOptions,
): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API key is not configured.");

  const isEnglish =
    !options?.language ||
    options.language === "English (US)" ||
    options.language === "English (UK)";
  const langInstruction = isEnglish
    ? ""
    : `\n\nWrite the entire output in ${options!.language}.`;

  const personalizationBlock = buildPersonalizationBlock(options);

  const systemPrompt =
    (SYSTEM_PROMPTS[destination] ?? FALLBACK_PROMPT) +
    `\n\nApply a ${tone} tone throughout.${langInstruction}${personalizationBlock} Return only the transformed text — no preamble, no explanations.`;

  console.log("[GPT] Prompt →", systemPrompt);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 2048,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as {
      error?: { message?: string };
    };
    throw new Error(
      `OpenAI error ${response.status}: ${err?.error?.message ?? "Unknown"}`,
    );
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices[0]?.message?.content?.trim();
  if (!content) throw new Error("No content returned from GPT-4o.");

  console.log("[GPT] Output length →", content.length, "chars");
  return content;
}
