import { put, del } from "@vercel/blob";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";

/**
 * Uploads a file to Vercel Blob (in production/when token is set)
 * or to local filesystem (in development).
 * 
 * @param file The File object to upload
 * @param pathPrefix The subfolder or prefix to use (e.g. propertyId)
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File, pathPrefix: string): Promise<string> {
  const isVercelBlobEnabled = !!process.env.BLOB_READ_WRITE_TOKEN;

  if (isVercelBlobEnabled) {
    const fileName = `${pathPrefix}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const blob = await put(fileName, file, {
      access: "public",
    });
    return blob.url;
  } else {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads", pathPrefix);
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    return `/uploads/${pathPrefix}/${fileName}`;
  }
}

/**
 * Deletes a file from Vercel Blob or local filesystem.
 * 
 * @param fileUrl The URL of the file to delete
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  const isVercelBlobEnabled = !!process.env.BLOB_READ_WRITE_TOKEN;

  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    if (isVercelBlobEnabled) {
      await del(fileUrl);
    } else {
      console.warn(`Attempted to delete remote file ${fileUrl} but BLOB_READ_WRITE_TOKEN is not set.`);
    }
  } else if (fileUrl.startsWith("/uploads/")) {
    try {
      // Convert relative URL "/uploads/xxx/yyy" to local path "public/uploads/xxx/yyy"
      const relativePath = fileUrl.replace(/^\//, "");
      const fullPath = join(process.cwd(), "public", relativePath);
      await unlink(fullPath);
    } catch (error) {
      console.error(`Failed to delete local file: ${fileUrl}`, error);
    }
  }
}
