"use server"

import { db } from "@/lib/db";
import { tenants, leases, rentInvoices, maintenanceTickets, properties } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- TENANTS ---
export async function getTenantsAction(organizationId: string) {
  try {
    const list = await db.select().from(tenants).where(eq(tenants.organizationId, organizationId)).all();
    
    // For each tenant, find their lease to determine unit/rent/deposit details
    const tenantsWithLeases = await Promise.all(
      list.map(async (t) => {
        const lease = await db.select()
          .from(leases)
          .where(eq(leases.tenantId, t.id))
          .limit(1)
          .get();

        let unitName = "No Unit Assigned";
        let rentAmount = "N/A";
        let deposit = "N/A";

        if (lease) {
          rentAmount = `$${lease.rentAmount.toLocaleString()}/mo`;
          deposit = `$${(lease.rentAmount * 2).toLocaleString()}`;
          
          const prop = await db.select()
            .from(properties)
            .where(eq(properties.id, lease.propertyId))
            .limit(1)
            .get();
          
          if (prop) {
            unitName = prop.name;
          }
        }

        return {
          id: t.id,
          name: t.name,
          email: t.email,
          phone: t.phone || "—",
          unit: unitName,
          rent: rentAmount,
          deposit: deposit,
          status: t.status,
          check: "Verified"
        };
      })
    );

    return { success: true, tenants: tenantsWithLeases };
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return { success: false, tenants: [] };
  }
}

export async function createTenantAction(orgSlug: string, organizationId: string, data: { name: string; email: string; phone?: string; status?: string }) {
  try {
    await db.insert(tenants).values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      status: data.status || "active",
      organizationId,
    });
    revalidatePath(`/dashboard/${orgSlug}/tenants`);
    return { success: true };
  } catch (error) {
    console.error("Error creating tenant:", error);
    return { error: "Failed to create tenant" };
  }
}

export async function deleteTenantAction(orgSlug: string, id: string) {
  try {
    await db.delete(tenants).where(eq(tenants.id, id));
    revalidatePath(`/dashboard/${orgSlug}/tenants`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return { error: "Failed to delete tenant" };
  }
}

// --- LEASES ---
export async function getLeasesAction(organizationId: string) {
  try {
    // Find all leases where properties belong to this organization
    const orgProperties = await db.select().from(properties).where(eq(properties.organizationId, organizationId)).all();
    const propIds = orgProperties.map(p => p.id);
    
    if (propIds.length === 0) return { success: true, leases: [] };
    
    const list = await db.select().from(leases).all();
    const filteredList = list.filter(l => propIds.includes(l.propertyId));

    const enrichedLeases = await Promise.all(
      filteredList.map(async (l) => {
        const tenant = await db.select().from(tenants).where(eq(tenants.id, l.tenantId)).limit(1).get();
        const prop = await db.select().from(properties).where(eq(properties.id, l.propertyId)).limit(1).get();

        return {
          id: l.id,
          tenant: tenant ? tenant.name : "Unknown Tenant",
          unit: prop ? prop.name : "Unknown Unit",
          start: l.startDate,
          end: l.endDate,
          rent: `$${l.rentAmount.toLocaleString()}/mo`,
          status: l.status,
          ledger: "Current"
        };
      })
    );

    return { success: true, leases: enrichedLeases };
  } catch (error) {
    console.error("Error fetching leases:", error);
    return { success: false, leases: [] };
  }
}

export async function createLeaseAction(
  orgSlug: string, 
  data: { tenantId: string; propertyId: string; rentAmount: number; startDate: string; endDate: string; status?: string }
) {
  try {
    await db.insert(leases).values({
      tenantId: data.tenantId,
      propertyId: data.propertyId,
      rentAmount: data.rentAmount,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status || "active",
    });
    revalidatePath(`/dashboard/${orgSlug}/leases`);
    revalidatePath(`/dashboard/${orgSlug}/tenants`);
    return { success: true };
  } catch (error) {
    console.error("Error creating lease:", error);
    return { error: "Failed to create lease" };
  }
}

export async function deleteLeaseAction(orgSlug: string, id: string) {
  try {
    await db.delete(leases).where(eq(leases.id, id));
    revalidatePath(`/dashboard/${orgSlug}/leases`);
    revalidatePath(`/dashboard/${orgSlug}/tenants`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting lease:", error);
    return { error: "Failed to delete lease" };
  }
}

// --- RENT INVOICES ---
export async function getRentInvoicesAction(organizationId: string) {
  try {
    const list = await db.select().from(rentInvoices).where(eq(rentInvoices.organizationId, organizationId)).all();
    return { success: true, invoices: list };
  } catch (error) {
    console.error("Error fetching rent invoices:", error);
    return { success: false, invoices: [] };
  }
}

export async function createRentInvoiceAction(
  orgSlug: string, 
  organizationId: string, 
  data: { tenant: string; unit: string; amount: string; status: string; dueDate: string }
) {
  try {
    await db.insert(rentInvoices).values({
      tenant: data.tenant,
      unit: data.unit,
      amount: data.amount,
      status: data.status,
      dueDate: data.dueDate,
      organizationId,
    });
    revalidatePath(`/dashboard/${orgSlug}/rent`);
    return { success: true };
  } catch (error) {
    console.error("Error creating rent invoice:", error);
    return { error: "Failed to create rent invoice" };
  }
}

export async function updateRentInvoiceStatusAction(orgSlug: string, id: string, status: string) {
  try {
    await db.update(rentInvoices).set({ status }).where(eq(rentInvoices.id, id));
    revalidatePath(`/dashboard/${orgSlug}/rent`);
    return { success: true };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return { error: "Failed to update invoice status" };
  }
}

// --- MAINTENANCE TICKETS ---
export async function getMaintenanceTicketsAction(organizationId: string) {
  try {
    const list = await db.select().from(maintenanceTickets).where(eq(maintenanceTickets.organizationId, organizationId)).all();
    return { success: true, tickets: list };
  } catch (error) {
    console.error("Error fetching maintenance tickets:", error);
    return { success: false, tickets: [] };
  }
}

export async function createMaintenanceTicketAction(
  orgSlug: string, 
  organizationId: string, 
  data: { title: string; unit: string; description?: string; priority: string; status?: string; assignee: string }
) {
  try {
    await db.insert(maintenanceTickets).values({
      title: data.title,
      unit: data.unit,
      description: data.description || null,
      priority: data.priority,
      status: data.status || "pending",
      assignee: data.assignee,
      organizationId,
    });
    revalidatePath(`/dashboard/${orgSlug}/maintenance`);
    return { success: true };
  } catch (error) {
    console.error("Error creating maintenance ticket:", error);
    return { error: "Failed to create maintenance ticket" };
  }
}

export async function updateMaintenanceTicketStatusAction(orgSlug: string, id: string, status: string) {
  try {
    await db.update(maintenanceTickets).set({ status, updatedAt: new Date().toISOString() }).where(eq(maintenanceTickets.id, id));
    revalidatePath(`/dashboard/${orgSlug}/maintenance`);
    return { success: true };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { error: "Failed to update ticket status" };
  }
}
