import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export const propertySchema = z.object({
  title: z.string().min(1, "Property title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
  projectId: z.string().min(1, "Project ID is required"),
});

export const documentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  propertyId: z.string().min(1, "Property ID is required"),
});
