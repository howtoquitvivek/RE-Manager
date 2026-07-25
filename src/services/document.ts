import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cache } from "react";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const getPropertyDocuments = cache(async (propertyId: string) => {
  return await db.select()
    .from(documents)
    .where(eq(documents.propertyId, propertyId))
    .all();
});

export async function createDocument(data: {
  name: string;
  fileUrl: string;
  fileType: string;
  propertyId: string;
}) {
  const [newDoc] = await db.insert(documents).values({
    name: data.name,
    filePath: data.fileUrl,
    type: data.fileType,
    propertyId: data.propertyId,
  }).returning();
  return newDoc;
}

export async function generateDocumentSummary(documentId: string, fileContent: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Summarize the following real estate document. Focus on key details like parties involved, financial terms, and important dates: \n\n ${fileContent}`;
  
  const result = await model.generateContent(prompt);
  const summary = await result.response.text();
  
  await db.update(documents)
    .set({ aiSummary: summary, updatedAt: new Date().toISOString() })
    .where(eq(documents.id, documentId))
    .execute();
    
  return summary;
}

export async function deleteDocument(id: string) {
  return await db.delete(documents)
    .where(eq(documents.id, id))
    .returning();
}
