import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function summarizeDocument(text: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return "AI summary unavailable: API key not configured.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Summarize the following property document text. 
      Identify key details such as property names, dates, values, and important clauses.
      Keep the summary concise and professional.
      
      Document Content:
      ${text.substring(0, 30000)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "Error generating AI summary.";
  }
}
