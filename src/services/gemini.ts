import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getMatchAnalysis(matchDetails: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As an IPL cricket expert, provide a concise, high-energy 2-3 sentence analysis of this match situation or result: ${matchDetails}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return "The atmosphere is electric! Fans are on the edge of their seats.";
  }
}

export async function getFanSentiment(comments: string[]) {
  if (comments.length === 0) return "Fans are waiting for the action to reveal its secrets.";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the mood of these fan comments and summarize the general sentiment in one short sentence: ${comments.join(" | ")}`,
    });
    return response.text;
  } catch (error) {
    console.error("Sentiment analysis failed", error);
    return "The dugout is buzzing with anticipation!";
  }
}
