import { genAI } from "@/lib/ai/gemini";

export async function processPdfSummary(pdfBuffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(pdfBuffer);
    const textContent = data.text;

    if (!textContent) {
      throw new Error("No text extracted from PDF");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a Real Estate legal assistant.
      Extract the following information from this real estate document text:
      - Document Type (e.g., Sale Deed, NOC, Tax Receipt)
      - Key Parties involved (Owner names, Buyers, Sellers)
      - Property Details (Address, Survey Numbers)
      - Important Clauses or Constraints
      - Summary of the document (2-3 sentences)

      Document Text:
      ${textContent.substring(0, 10000)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error processing PDF summary:", error);
    return "Failed to generate AI summary.";
  }
}