import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  workspaceType: text("workspace_type").default("personal").notNull(), // personal, rental, enterprise
  subscriptionPlan: text("subscription_plan").default("starter").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const memberships = sqliteTable("memberships", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  role: text("role").default("VIEWER").notNull(), // OWNER, ADMIN, SALES_MANAGER, BROKER, LEGAL_MANAGER, VIEWER
  userId: text("user_id").notNull().references(() => users.id),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  clearance: text("clearance").default("Level 3").notNull(),
  joined: text("joined").default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  status: text("status").default("ACTIVE").notNull(), // ACTIVE, INACTIVE, PENDING, COMPLETED
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const properties = sqliteTable("properties", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  userId: text("user_id").references(() => users.id), // Optional for non-personal properties
  name: text("name").notNull(),
  title: text("title"), // Alias for backward compatibility
  description: text("description"),
  address: text("address"),
  location: text("location"), // Alias
  latitude: real("latitude"),
  longitude: real("longitude"),
  estimatedValue: real("estimated_value"),
  price: real("price"), // Alias
  images: text("images"),
  status: text("status").default("ACTIVE").notNull(),
  projectId: text("project_id").references(() => projects.id), // Restored
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  propertyType: text("property_type").default("residential").notNull(), // residential, commercial, luxury, plot
  
  // Rental Fields
  rentAmount: real("rent_amount"),
  floorUnit: text("floor_unit"),
  occupancyStatus: text("occupancy_status").default("vacant"), // occupied, vacant
  leaseStatus: text("lease_status").default("none"), // active, expired, none
  
  // Plotting / Apartment Fields
  plotNumber: text("plot_number"),
  dimensions: text("dimensions"),
  bhkType: text("bhk_type"),
  carpetArea: real("carpet_area"),

  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const vaultSettings = sqliteTable("vault_settings", {
  userId: text("user_id").primaryKey().references(() => users.id),
  vaultPasswordHash: text("vault_password_hash").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  filePath: text("file_path").notNull(), // Changed from fileUrl to filePath
  type: text("type").notNull(), // Changed from fileType to type
  aiSummary: text("ai_summary"),
  propertyId: text("property_id").notNull().references(() => properties.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const activities = sqliteTable("activities", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  userId: text("user_id").notNull().references(() => users.id),
  propertyId: text("property_id").references(() => properties.id),
  activityType: text("activity_type").notNull(), // property_created, document_uploaded, vault_access, etc.
  details: text("details"), // JSON string
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  details: text("details"), // JSON stored as string
  userId: text("user_id").notNull().references(() => users.id),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// --- NEW TABLES FOR REOS ECOSYSTEM ---

export const tenants = sqliteTable("tenants", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").default("active").notNull(), // active, inactive
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const leases = sqliteTable("leases", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  propertyId: text("property_id").notNull().references(() => properties.id),
  rentAmount: real("rent_amount").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status").default("active").notNull(), // active, expired, terminated
  documentId: text("document_id").references(() => documents.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const towers = sqliteTable("towers", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  projectId: text("project_id").notNull().references(() => projects.id),
  floors: integer("floors").notNull(),
  status: text("status").default("planning").notNull(), // planning, construction, completed
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const apartments = sqliteTable("apartments", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  flatNumber: text("flat_number").notNull(),
  towerId: text("tower_id").notNull().references(() => towers.id),
  bhkType: text("bhk_type").notNull(), // 1BHK, 2BHK, 3BHK, etc.
  carpetArea: real("carpet_area").notNull(),
  price: real("price").notNull(),
  status: text("status").default("available").notNull(), // available, booked, sold, possession-ready
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const construction = sqliteTable("construction", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  projectId: text("project_id").notNull().references(() => projects.id),
  stage: text("stage").notNull(), // foundation, structure, finishing, possession-ready
  progress: integer("progress").notNull(), // percentage 0-100
  contractorNotes: text("contractor_notes"),
  imageUrls: text("image_urls"), // JSON string array
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const approvals = sqliteTable("approvals", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  title: text("title").notNull(),
  type: text("type").notNull(), // rera, zoning, environmental, fire-safety, NOC
  status: text("status").default("pending").notNull(), // pending, under_review, approved, rejected
  projectId: text("project_id").notNull().references(() => projects.id),
  documentId: text("document_id").references(() => documents.id),
  reviewedBy: text("reviewed_by"),
  reviewedAt: text("reviewed_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const regions = sqliteTable("regions", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  manager: text("manager").notNull(),
  status: text("status").notNull(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const maintenanceTickets = sqliteTable("maintenance_tickets", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  title: text("title").notNull(),
  unit: text("unit").notNull(),
  description: text("description"),
  priority: text("priority").notNull(), // High, Medium, Low
  status: text("status").default("pending").notNull(), // pending, in_progress, resolved
  assignee: text("assignee").notNull(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const rentInvoices = sqliteTable("rent_invoices", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  tenant: text("tenant").notNull(),
  unit: text("unit").notNull(),
  amount: text("amount").notNull(),
  status: text("status").default("Pending").notNull(), // Paid, Pending, Overdue
  dueDate: text("due_date").notNull(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

