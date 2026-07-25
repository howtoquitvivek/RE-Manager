"use server"

import { createDocument, deleteDocument, generateDocumentSummary } from "@/services/document";
import { processPdfSummary } from "@/services/ai.service";
import { revalidatePath } from "next/cache";
import { uploadFile, deleteFile } from "@/lib/storage";

export async function uploadDocumentAction(orgSlug: string, propertyId: string, formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const name = file.name;
  const fileType = file.type;
  
  try {
    // Upload using storage helper (handles local vs. Vercel Blob)
    const fileUrl = await uploadFile(file, propertyId);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create record first
    const newDoc = await createDocument({
      name,
      fileUrl,
      fileType,
      propertyId,
    });

    // Generate AI Summary if it's a PDF
    if (file.type === "application/pdf" && process.env.GEMINI_API_KEY) {
      try {
        const aiSummary = await processPdfSummary(buffer);
        if (aiSummary) {
          await generateDocumentSummary(newDoc.id, aiSummary);
        }
      } catch (aiError) {
        console.error("AI Summary generation failed", aiError);
      }
    }

    revalidatePath(`/dashboard/${orgSlug}/properties/${propertyId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to upload and analyze document" };
  }
}

export async function deleteDocumentAction(orgSlug: string, propertyId: string, id: string) {
  try {
    const deletedDocs = await deleteDocument(id);
    if (deletedDocs && deletedDocs.length > 0) {
      const deletedDoc = deletedDocs[0];
      await deleteFile(deletedDoc.filePath);
    }
    revalidatePath(`/dashboard/${orgSlug}/properties/${propertyId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete document" };
  }
}
