import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { getPersonalProperties } from "@/actions/personal";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Mail, Calendar, Briefcase, Building2, ShieldCheck, Edit3 } from "lucide-react";

export default async function PersonalProfilePage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const session = await getSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  const organization = await getOrganizationBySlug(orgSlug, session.userId);
  if (!organization || organization.workspaceType !== "personal") {
    redirect("/dashboard");
  }

  const properties = await getPersonalProperties(session.userId, organization.id);
  const totalValue = properties.reduce((sum, p) => sum + (p.estimatedValue || 0), 0);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative h-64 w-full rounded-[3rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute -bottom-16 left-12 h-32 w-32 rounded-3xl bg-card border-4 border-background shadow-2xl flex items-center justify-center">
          <UserIcon className="h-16 w-16 text-primary" />
        </div>
      </div>

      <div className="pt-16 px-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Portfolio Owner</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4" /> portfolio@owner.com
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-primary/10 text-primary border-none py-1 px-3">
              <Briefcase className="h-3 w-3 mr-2" /> Personal Workspace
            </Badge>
            <Badge variant="outline" className="border-border/40 py-1 px-3">
              <Calendar className="h-3 w-3 mr-2" /> Joined May 2024
            </Badge>
            <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5 py-1 px-3">
              <ShieldCheck className="h-3 w-3 mr-2" /> Verified Profile
            </Badge>
          </div>
        </div>
        <Button className="rounded-full h-12 px-8 gap-2 bg-foreground text-background hover:bg-foreground/90 shadow-xl">
          <Edit3 className="h-4 w-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 px-12">
        <Card className="p-8 border-border/40 bg-card/40 backdrop-blur-md rounded-[2.5rem] space-y-4 transition-all hover:border-primary/20">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Properties</p>
            <p className="text-3xl font-extrabold">{properties.length}</p>
          </div>
          <p className="text-xs text-muted-foreground italic">Total active assets in portfolio</p>
        </Card>

        <Card className="p-8 border-border/40 bg-card/40 backdrop-blur-md rounded-[2.5rem] space-y-4 transition-all hover:border-primary/20">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Net Asset Value</p>
            <p className="text-3xl font-extrabold">${totalValue.toLocaleString()}</p>
          </div>
          <p className="text-xs text-muted-foreground italic">Combined market estimation</p>
        </Card>

        <Card className="p-8 border-border/40 bg-card/40 backdrop-blur-md rounded-[2.5rem] space-y-4 transition-all hover:border-primary/20">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Last Activity</p>
            <p className="text-3xl font-extrabold">2 Days Ago</p>
          </div>
          <p className="text-xs text-muted-foreground italic">Vault access & updates</p>
        </Card>
      </div>
    </div>
  );
}
