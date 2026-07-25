"use server"

import { createDocument, deleteDocument, generateDocumentSummary } from "@/services/document";
import { processPdfSummary } from "@/services/ai.service";
import { revalidatePath } from "next/cache";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";

export async function uploadDocumentAction(orgSlug: string, propertyId: string, formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const name = file.name;
  const fileType = file.type;
  
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save locally
    const uploadDir = join(process.cwd(), "public", "uploads", propertyId);
    await mkdir(uploadDir, { recursive: true });
    
    const fileName = `${Date.now()}-${file.name.replace(/\\s+/g, "_")}`;
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${propertyId}/${fileName}`;

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
    await deleteDocument(id);
    revalidatePath(`/dashboard/${orgSlug}/properties/${propertyId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete document" };
  }
}
