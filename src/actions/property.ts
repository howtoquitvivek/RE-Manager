"use server"

import { createProperty, updateProperty, deleteProperty } from "@/services/property";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";

export async function createPropertyAction(orgSlug: string, projectId: string, formData: FormData) {
  const session = await getSession();
  if (!session || !session.userId) return { error: "Not authenticated" };

  const organization = await getOrganizationBySlug(orgSlug, session.userId);
  if (!organization) return { error: "Organization not found" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const priceStr = formData.get("price") as string;
  const price = priceStr ? parseFloat(priceStr) : undefined;
  
  if (!title) return { error: "Title is required" };

  try {
    await createProperty({
      title,
      description,
      location,
      price,
      projectId,
      organizationId: organization.id,
    });
    
    revalidatePath(`/dashboard/${orgSlug}/properties`);
    revalidatePath(`/dashboard/${orgSlug}/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to create property" };
  }
}

export async function updatePropertyAction(orgSlug: string, id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const priceStr = formData.get("price") as string;
  const price = priceStr ? parseFloat(priceStr) : undefined;
  const status = formData.get("status") as string;

  try {
    await updateProperty(id, {
      title,
      description,
      location,
      price,
      status,
    });
    
    revalidatePath(`/dashboard/${orgSlug}/properties`);
    revalidatePath(`/dashboard/${orgSlug}/properties/${id}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update property" };
  }
}

export async function deletePropertyAction(orgSlug: string, id: string) {
  try {
    await deleteProperty(id);
    revalidatePath(`/dashboard/${orgSlug}/properties`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete property" };
  }
}
