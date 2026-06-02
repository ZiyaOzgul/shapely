import { GoogleGenAI } from "@google/genai";
import type { TransformOptions } from "@/types";
import {
  SYSTEM_PROMPTS,
  FALLBACK_PROMPT,
  buildPersonalizationBlock,
} from "@/services/aiPrompts";
import { transformWithGPT } from "@/services/gpt";

export async function transform(
  userText: string,
  destination: string,
  tone: string,
  options?: TransformOptions,
): Promise<string> {
  if (options?.model === "gpt") {
    return transformWithGPT(userText, destination, tone, options);
  }

  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

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

  const ai = new GoogleGenAI({ apiKey });

  console.log("[AI] Prompt →", systemPrompt);

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userText,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  });

  console.log("[AI] Raw result →", result);

  const content = result.text?.trim();
  if (!content) {
    throw new Error("No content returned from Gemini.");
  }

  console.log("[AI] Extracted text →", content);
  console.log("[AI] Output length →", content.length, "chars");

  return content;
}
