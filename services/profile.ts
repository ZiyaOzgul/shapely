import { GoogleGenAI } from "@google/genai";

export const STYLE_EXTRACTION_MIN_SAMPLES = 5;
export const STYLE_UPDATE_INTERVAL = 5;

export async function analyzeWritingStyle(
  originalTexts: string[],
): Promise<string | null> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey || originalTexts.length < STYLE_EXTRACTION_MIN_SAMPLES)
    return null;

  const systemInstruction = `You are a writing style analyst.
Analyze the provided text samples and write a concise 2–3 sentence description of the author's writing style.
Focus on: vocabulary level, sentence rhythm, preferred structures, formality, use of metaphor or humour.
Do not comment on the topics — only the style and voice.
Return only the style description with no preamble or labels.`;

  const samples = originalTexts.slice(-20);
  const contents = samples
    .map((t, i) => `Sample ${i + 1}:\n${t.trim()}`)
    .join("\n\n---\n\n");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 256,
      },
    });
    return result.text?.trim() ?? null;
  } catch (err) {
    console.error("[Profile] analyzeWritingStyle error:", err);
    return null;
  }
}

export function shouldRefreshStyle(
  currentCount: number,
  historyCountAtLastUpdate?: number,
): boolean {
  if (currentCount < STYLE_EXTRACTION_MIN_SAMPLES) return false;
  if (historyCountAtLastUpdate === undefined) return true;
  return currentCount - historyCountAtLastUpdate >= STYLE_UPDATE_INTERVAL;
}
