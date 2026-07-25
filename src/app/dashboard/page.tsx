import { getSession } from "@/lib/auth/session";
import { getUserOrganizations } from "@/services/organization";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const session = await getSession();
  
  if (!session || !session.userId) {
    redirect("/login");
  }

  const userOrgs = await getUserOrganizations(session.userId);

  if (userOrgs.length > 0) {
    redirect(`/dashboard/${userOrgs[0].organization.slug}`);
  }

  // Redirect directly to the personal dashboard
  // We will handle silent creation in the layout if it doesn't exist
  redirect(`/dashboard/personal`);
}
