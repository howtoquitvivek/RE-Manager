import { properties, documents, activities, vaultSettings } from "@/lib/db/schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type PersonalProperty = InferSelectModel<typeof properties>;
export type NewPersonalProperty = InferInsertModel<typeof properties>;

export type PropertyDocument = InferSelectModel<typeof documents>;
export type NewPropertyDocument = InferInsertModel<typeof documents>;

export type ActivityLog = InferSelectModel<typeof activities>;
export type NewActivityLog = InferInsertModel<typeof activities>;

export type VaultSettings = InferSelectModel<typeof vaultSettings>;
export type NewVaultSettings = InferInsertModel<typeof vaultSettings>;

export type PropertyType = "House" | "Apartment" | "Condo" | "Land" | "Commercial" | "Other";

export interface DashboardStats {
  totalProperties: number;
  netEstimatedValue: number;
  recentActivity: ActivityLog[];
  propertiesMissingDocs: PersonalProperty[];
  recentlyUploadedDocs: PropertyDocument[];
}

export type ActivityType = 
  | "property_created" 
  | "property_updated" 
  | "document_uploaded" 
  | "document_removed" 
  | "vault_access";
