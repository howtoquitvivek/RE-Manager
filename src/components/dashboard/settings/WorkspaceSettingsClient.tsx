"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Lock,
  ChevronRight,
  Sparkles,
  Users,
  Coins,
  Building,
  DollarSign,
  Clock,
  Key,
  CreditCard,
  Plus,
  Trash2,
  Mail,
  CheckCircle2,
  UserPlus,
  Smartphone,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { WorkspaceType } from "@/types/dashboard";
import { upgradeToPremiumAction } from "@/actions/organization";

interface WorkspaceSettingsClientProps {
  organization: {
    name: string;
    slug: string;
    workspaceType: WorkspaceType;
    subscriptionPlan: string;
  };
  userId: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

export default function WorkspaceSettingsClient({ organization, userId }: WorkspaceSettingsClientProps) {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(true);
  const [activeColor, setActiveColor] = useState("#3b82f6");
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");

  // --- Personal Workspace States ---
  const [aiSummarize, setAiSummarize] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [vaultPassword, setVaultPassword] = useState("");
  const [vaultPasswordConfirm, setVaultPasswordConfirm] = useState("");
  const [showVaultPrompt, setShowVaultPrompt] = useState(false);

  // --- Rental Workspace States ---
  const [lateFees, setLateFees] = useState(true);
  const [lateFeeAmount, setLateFeeAmount] = useState(5);
  const [rentReminders, setRentReminders] = useState(true);
  const [escrowDeposit, setEscrowDeposit] = useState(true);
  const [dueDate, setDueDate] = useState("1");
  const [stripeConnected, setStripeConnected] = useState(false);

  // --- Builder Workspace States ---
  const [reraAutoReminder, setReraAutoReminder] = useState(true);
  const [subcontractorRole, setSubcontractorRole] = useState("STAGE_UPDATE");
  const [budgetAlertMargin, setBudgetAlertMargin] = useState("20");

  // --- Enterprise Workspace States ---
  const [multiSig, setMultiSig] = useState(false);
  const [auditLogLimit, setAuditLogLimit] = useState("365");
  const [apiKey, setApiKey] = useState("re_prod_7f2bc8a9b3d11ef4");
  const [showApiKey, setShowApiKey] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "Gurrajbir Singh", email: "singhgpt01@gmail.com", role: "OWNER", joinedAt: "2026-05-15" },
    { id: "2", name: "Sarah Connor", email: "sconnor@remanager.com", role: "LEGAL_MANAGER", joinedAt: "2026-05-16" },
    { id: "3", name: "David Miller", email: "dmiller@remanager.com", role: "BROKER", joinedAt: "2026-05-16" },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("BROKER");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(organization.subscriptionPlan);

  const handleUpgradePlan = async () => {
    setIsUpgrading(true);
    try {
      const res = await upgradeToPremiumAction(organization.slug);
      if (res?.error) {
        toast({
          title: "Upgrade Failed",
          description: res.error,
          variant: "destructive",
        });
      } else {
        setCurrentPlan("premium");
        toast({
          title: "Upgrade Successful!",
          description: "Your workspace has been upgraded to Premium. All 4 niches are now unlocked and active!",
        });
        window.location.reload();
      }
    } catch (e: any) {
      toast({
        title: "System Exception",
        description: e.message || "Failed to upgrade subscription.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  // Load settings on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`reos_settings_${organization.slug}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.darkMode !== undefined) setDarkMode(parsed.darkMode);
          if (parsed.activeColor !== undefined) setActiveColor(parsed.activeColor);
          if (parsed.currency !== undefined) setCurrency(parsed.currency);
          if (parsed.language !== undefined) setLanguage(parsed.language);
          if (parsed.aiSummarize !== undefined) setAiSummarize(parsed.aiSummarize);
          if (parsed.twoFactor !== undefined) setTwoFactor(parsed.twoFactor);
          if (parsed.lateFees !== undefined) setLateFees(parsed.lateFees);
          if (parsed.lateFeeAmount !== undefined) setLateFeeAmount(parsed.lateFeeAmount);
          if (parsed.rentReminders !== undefined) setRentReminders(parsed.rentReminders);
          if (parsed.escrowDeposit !== undefined) setEscrowDeposit(parsed.escrowDeposit);
          if (parsed.dueDate !== undefined) setDueDate(parsed.dueDate);
          if (parsed.stripeConnected !== undefined) setStripeConnected(parsed.stripeConnected);
          if (parsed.reraAutoReminder !== undefined) setReraAutoReminder(parsed.reraAutoReminder);
          if (parsed.subcontractorRole !== undefined) setSubcontractorRole(parsed.subcontractorRole);
          if (parsed.budgetAlertMargin !== undefined) setBudgetAlertMargin(parsed.budgetAlertMargin);
          if (parsed.multiSig !== undefined) setMultiSig(parsed.multiSig);
          if (parsed.auditLogLimit !== undefined) setAuditLogLimit(parsed.auditLogLimit);
          if (parsed.apiKey !== undefined) setApiKey(parsed.apiKey);
        } catch (e) {
          console.error("Error parsing settings:", e);
        }
      }
      setIsLoaded(true);
    }
  }, [organization.slug]);

  // Save settings on state change
  React.useEffect(() => {
    if (!isLoaded) return;
    if (typeof window !== "undefined") {
      const settings = {
        darkMode,
        activeColor,
        currency,
        language,
        aiSummarize,
        twoFactor,
        lateFees,
        lateFeeAmount,
        rentReminders,
        escrowDeposit,
        dueDate,
        stripeConnected,
        reraAutoReminder,
        subcontractorRole,
        budgetAlertMargin,
        multiSig,
        auditLogLimit,
        apiKey
      };
      localStorage.setItem(`reos_settings_${organization.slug}`, JSON.stringify(settings));
    }
  }, [
    isLoaded,
    organization.slug,
    darkMode,
    activeColor,
    currency,
    language,
    aiSummarize,
    twoFactor,
    lateFees,
    lateFeeAmount,
    rentReminders,
    escrowDeposit,
    dueDate,
    stripeConnected,
    reraAutoReminder,
    subcontractorRole,
    budgetAlertMargin,
    multiSig,
    auditLogLimit,
    apiKey
  ]);

  const notifyChange = (settingName: string, value: boolean | string) => {
    toast({
      title: "Setting Saved",
      description: `${settingName} has been updated successfully.`,
    });
  };

  const handleUpdateVaultPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (vaultPassword !== vaultPasswordConfirm) {
      toast({
        title: "Match Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Security Updated",
      description: "Your Secure Vault password has been changed successfully.",
    });
    setVaultPassword("");
    setVaultPasswordConfirm("");
    setShowVaultPrompt(false);
  };

  const handleConnectStripe = () => {
    setStripeConnected(true);
    toast({
      title: "Stripe Connected",
      description: "Your Stripe Merchant account has been integrated successfully.",
    });
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      joinedAt: new Date().toISOString().split("T")[0],
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail("");
    setInviteName("");
    setShowInviteModal(false);

    toast({
      title: "Invitation Sent",
      description: `An invite link has been dispatched to ${inviteEmail}.`,
    });
  };

  const handleDeleteMember = (id: string, name: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    toast({
      title: "Member Removed",
      description: `${name} has been revoked from this workspace.`,
    });
  };

  const handleGenerateApiKey = () => {
    const randomHex = Math.random().toString(16).substring(2, 18);
    setApiKey(`re_prod_${randomHex}`);
    toast({
      title: "API Key Rotated",
      description: "A new secure access token has been generated.",
    });
  };

  return (
    <div className="space-y-10 pb-16 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 backdrop-blur-xl border border-border/40 p-8 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          {organization.workspaceType === "personal" && <Shield className="h-32 w-32" />}
          {organization.workspaceType === "rental" && <Coins className="h-32 w-32" />}
          {organization.workspaceType === "enterprise" && <Building className="h-32 w-32" />}
        </div>
        <div className="space-y-2 relative z-10">
          <Badge className="bg-primary/10 text-primary border-none font-bold uppercase tracking-wider px-3 py-1">
            {organization.workspaceType} Workspace
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">{organization.name} Settings</h1>
          <p className="text-muted-foreground text-base">
            Configure system rules, aesthetics, security details, and preferences for your {organization.workspaceType} profile.
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
          <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5 px-3 py-1 font-bold">
            Active Niche: {organization.workspaceType.toUpperCase()}
          </Badge>
          <p className="text-xs text-muted-foreground">Plan: <span className="font-bold text-foreground capitalize">{organization.subscriptionPlan}</span></p>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* NICHE SPECIALIZED SETTINGS SECTIONS */}
        
        {/* A. PERSONAL NICHE */}
        {organization.workspaceType === "personal" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary animate-pulse" /> Secure Vault Security
              </h2>
              <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
                
                {/* Vault Password Changer */}
                <div className="p-6 border-b border-border/40 hover:bg-secondary/10 transition-colors cursor-pointer group" onClick={() => setShowVaultPrompt(!showVaultPrompt)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">Change Vault Password</p>
                        <p className="text-xs text-muted-foreground">Modify your secondary authentication layer for documents.</p>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-all ${showVaultPrompt ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Vault password dropdown flow */}
                <AnimatePresence>
                  {showVaultPrompt && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-secondary/10 border-b border-border/40"
                    >
                      <form onSubmit={handleUpdateVaultPassword} className="p-6 space-y-4 max-w-md">
                        <div className="space-y-2">
                          <Label htmlFor="new-v-pass" className="text-xs font-bold uppercase">New Vault Password</Label>
                          <Input 
                            id="new-v-pass" 
                            type="password" 
                            className="bg-background/50 border-border/60" 
                            value={vaultPassword}
                            onChange={(e) => setVaultPassword(e.target.value)}
                            placeholder="Enter secure secondary password"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-v-pass" className="text-xs font-bold uppercase">Confirm Vault Password</Label>
                          <Input 
                            id="confirm-v-pass" 
                            type="password" 
                            className="bg-background/50 border-border/60" 
                            value={vaultPasswordConfirm}
                            onChange={(e) => setVaultPasswordConfirm(e.target.value)}
                            placeholder="Verify secure secondary password"
                            required
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" type="submit">Update Vault</Button>
                          <Button size="sm" variant="ghost" type="button" onClick={() => setShowVaultPrompt(false)}>Cancel</Button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Summary Toggle */}
                <div className="p-6 flex items-center justify-between border-b border-border/40">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">Gemini AI Document Summarization</p>
                      <p className="text-xs text-muted-foreground">Automatically scan and summarize uploaded property PDFs using AI.</p>
                    </div>
                  </div>
                  <Switch checked={aiSummarize} onCheckedChange={(val) => { setAiSummarize(val); notifyChange("AI Summarization", val); }} />
                </div>

                {/* Two Factor Authentication */}
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-muted-foreground">Enforce phone-based secondary confirmation for vault unlocks.</p>
                    </div>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={(val) => { setTwoFactor(val); notifyChange("Two-Factor Authentication", val); }} />
                </div>

              </Card>
            </section>
          </motion.div>
        )}

        {/* B. RENTAL NICHE */}
        {organization.workspaceType === "rental" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary animate-pulse" /> Rental & Leasing Policies
              </h2>
              <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
                
                {/* Auto Late Fees */}
                <div className="p-6 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">Apply Late Rent Fees</p>
                        <p className="text-xs text-muted-foreground">Apply penalty rules dynamically if tenant rent is overdue.</p>
                      </div>
                    </div>
                    <Switch checked={lateFees} onCheckedChange={(val) => { setLateFees(val); notifyChange("Overdue Rent Penalties", val); }} />
                  </div>
                  
                  {lateFees && (
                    <div className="mt-4 pl-16 flex items-center gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="penalty-amount" className="text-xs font-bold text-muted-foreground uppercase">Penalty Charge (%)</Label>
                        <Input 
                          id="penalty-amount" 
                          type="number" 
                          className="w-32 bg-background/50" 
                          value={lateFeeAmount} 
                          onChange={(e) => { setLateFeeAmount(Number(e.target.value)); }} 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="due-day" className="text-xs font-bold text-muted-foreground uppercase">Grace Period (Days)</Label>
                        <select 
                          id="due-day" 
                          className="h-9 px-3 bg-background/50 border border-border/60 rounded-md text-sm focus:outline-none"
                          value={dueDate}
                          onChange={(e) => { setDueDate(e.target.value); notifyChange("Grace Period Date", e.target.value); }}
                        >
                          <option value="1">1st of Month</option>
                          <option value="5">5th of Month</option>
                          <option value="10">10th of Month</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Auto Tenant Notifications */}
                <div className="p-6 flex items-center justify-between border-b border-border/40">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">Automated Tenant Reminders</p>
                      <p className="text-xs text-muted-foreground">Send payment notices 3 days prior to monthly lease due date.</p>
                    </div>
                  </div>
                  <Switch checked={rentReminders} onCheckedChange={(val) => { setRentReminders(val); notifyChange("Lease notifications", val); }} />
                </div>

                {/* Escrow Locks */}
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">Escrow Security Deposits</p>
                      <p className="text-xs text-muted-foreground">Securely separate tenant security deposit funds under bank escrow locks.</p>
                    </div>
                  </div>
                  <Switch checked={escrowDeposit} onCheckedChange={(val) => { setEscrowDeposit(val); notifyChange("Escrow deposit lock", val); }} />
                </div>

              </Card>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Integrated Gateways
              </h2>
              <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-3xl p-6 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Stripe Payments Merchant</p>
                    <p className="text-xs text-muted-foreground">Collect rent payments securely via Credit Cards, Apple Pay, or ACH transfers.</p>
                  </div>
                </div>
                {stripeConnected ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 py-1.5 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Connected
                  </Badge>
                ) : (
                  <Button size="sm" onClick={handleConnectStripe}>Connect Stripe</Button>
                )}
              </Card>
            </section>
          </motion.div>
        )}

        {/* C. ENTERPRISE NICHE */}
        {organization.workspaceType === "enterprise" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary animate-pulse" /> Team & Workspace Access
                </h2>
                <Button size="sm" className="rounded-full gap-1" onClick={() => setShowInviteModal(true)}>
                  <UserPlus className="h-4 w-4" /> Invite Member
                </Button>
              </div>

              {/* Team list card */}
              <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
                <div className="divide-y divide-border/40">
                  {teamMembers.map(member => (
                    <div key={member.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{member.name}</p>
                            <Badge variant="secondary" className="text-[10px] font-extrabold uppercase px-2 py-0.5">
                              {member.role.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Joined {member.joinedAt}</p>
                        {member.role !== "OWNER" && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-red-500 rounded-full"
                            onClick={() => handleDeleteMember(member.id, member.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Invite Modal */}
            <AnimatePresence>
              {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/40 rounded-[2rem] p-8 shadow-2xl space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <UserPlus className="h-6 w-6 text-primary" /> Invite Team Member
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">Add brokers, legal partners, or observers to your corporate asset catalog.</p>
                    </div>

                    <form onSubmit={handleInviteMember} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="inv-name" className="text-xs font-bold uppercase">Full Name</Label>
                        <Input 
                          id="inv-name" 
                          value={inviteName} 
                          onChange={(e) => setInviteName(e.target.value)} 
                          placeholder="e.g. David Miller" 
                          required
                          className="bg-secondary/20 border-border/40 h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inv-email" className="text-xs font-bold uppercase">Email Address</Label>
                        <Input 
                          id="inv-email" 
                          type="email"
                          value={inviteEmail} 
                          onChange={(e) => setInviteEmail(e.target.value)} 
                          placeholder="dmiller@company.com" 
                          required
                          className="bg-secondary/20 border-border/40 h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inv-role" className="text-xs font-bold uppercase">Member Role</Label>
                        <select 
                          id="inv-role"
                          className="w-full h-11 px-3 bg-secondary/20 border border-border/40 rounded-md text-sm focus:outline-none"
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value)}
                        >
                          <option value="BROKER">BROKER (Manage properties)</option>
                          <option value="LEGAL_MANAGER">LEGAL MANAGER (Manage vaults & AI)</option>
                          <option value="ADMIN">ADMIN (Full corporate access)</option>
                          <option value="VIEWER">VIEWER (Read-only)</option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1 h-11 rounded-xl">Send Invite</Button>
                        <Button variant="ghost" type="button" className="flex-1 h-11 rounded-xl" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Corporate Compliance */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Corporate Compliance
              </h2>
              <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
                
                {/* Multi Sig */}
                <div className="p-6 flex items-center justify-between border-b border-border/40">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">Multi-Signature Authorizations</p>
                      <p className="text-xs text-muted-foreground">Require broker approval from at least 2 partners prior to deleting properties.</p>
                    </div>
                  </div>
                  <Switch checked={multiSig} onCheckedChange={(val) => { setMultiSig(val); notifyChange("Multi-Sig authorization", val); }} />
                </div>

                {/* Audit Retention */}
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                      <Database className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">Audit Log Retention Policy</p>
                      <p className="text-xs text-muted-foreground">Choose the maximum duration that operational audits are cached under high compliance vaults.</p>
                    </div>
                  </div>
                  <select 
                    className="h-9 px-3 bg-secondary/35 border border-border/60 rounded-md text-xs font-bold focus:outline-none"
                    value={auditLogLimit}
                    onChange={(e) => { setAuditLogLimit(e.target.value); notifyChange("Audit Log Retention Days", e.target.value); }}
                  >
                    <option value="90">90 Days</option>
                    <option value="365">1 Year (365 Days)</option>
                    <option value="1825">5 Years (Compliance)</option>
                  </select>
                </div>

              </Card>
            </section>

            {/* External API integrations */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" /> External Access API
              </h2>
              <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6 rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Workspace API Key</p>
                    <p className="text-xs text-muted-foreground">Utilize this credentials key to push property data from automated MLS pipelines.</p>
                  </div>
                  <Button size="sm" onClick={handleGenerateApiKey}>Rotate Token</Button>
                </div>
                
                <div className="flex gap-2 items-center bg-secondary/30 p-4 rounded-2xl border border-border/40">
                  <Key className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input 
                    type={showApiKey ? "text" : "password"} 
                    value={apiKey} 
                    readOnly 
                    className="bg-transparent border-none font-mono text-xs text-primary focus-visible:ring-0 select-all cursor-text"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full" onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </Card>
            </section>
          </motion.div>
        )}

        {/* D. BUILDER NICHE */}
        {organization.workspaceType === "builder" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Developer Regulatory Settings */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary animate-pulse" /> Developer Regulations & RERA Compliance
              </h2>
              <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
                
                {/* RERA Auto Reminder Toggle */}
                <div className="p-6 flex items-center justify-between border-b border-border/40">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">RERA Filing Expiry Auto-Reminders</p>
                      <p className="text-xs text-muted-foreground">Automatically trigger legal reviews and notification alerts 60 days prior to certificate expiry.</p>
                    </div>
                  </div>
                  <Switch checked={reraAutoReminder} onCheckedChange={(val) => { setReraAutoReminder(val); notifyChange("RERA Expiry Reminders", val); }} />
                </div>

                {/* Subcontractor Role Default Selector */}
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">Contractor Workspace Role</p>
                      <p className="text-xs text-muted-foreground">Select the default authorization profile and write credentials assigned to newly boarded site subcontractors.</p>
                    </div>
                  </div>
                  <select 
                    className="h-9 px-3 bg-secondary/35 border border-border/60 rounded-md text-xs font-bold focus:outline-none"
                    value={subcontractorRole}
                    onChange={(e) => { setSubcontractorRole(e.target.value); notifyChange("Default Subcontractor Role", e.target.value); }}
                  >
                    <option value="VIEW_ONLY">Observer (View Only)</option>
                    <option value="STAGE_UPDATE">Field Engineer (Update Stages & Progress)</option>
                    <option value="ADMIN">Manager (Full Site Controls)</option>
                  </select>
                </div>

              </Card>
            </section>

            {/* Financial Margins Guard */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" /> Project Financial Guards
              </h2>
              <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6 rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Construction Budget Overrun Alert Margin</p>
                    <p className="text-xs text-muted-foreground">Flag warning notices in Builder Command Desk if real-time cost-to-margin forecasts exceed thresholds.</p>
                  </div>
                  <select 
                    className="h-9 px-3 bg-secondary/35 border border-border/60 rounded-md text-xs font-bold focus:outline-none"
                    value={budgetAlertMargin}
                    onChange={(e) => { setBudgetAlertMargin(e.target.value); notifyChange("Budget Alert Margin Threshold", e.target.value); }}
                  >
                    <option value="10">10% Budget Buffer</option>
                    <option value="20">20% Budget Buffer (Standard)</option>
                    <option value="30">30% Budget Buffer (Conservative)</option>
                  </select>
                </div>
              </Card>
            </section>
          </motion.div>
        )}

        {/* COMMON SETTINGS SECTIONS (APPEARANCE, PREFERENCES, PRIVACY) */}

        {/* 1. APPEARANCE */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" /> System Appearance
          </h2>
          <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 flex items-center justify-between border-b border-border/40">
              <div className="space-y-1">
                <p className="font-semibold text-sm">Visual Mode</p>
                <p className="text-xs text-muted-foreground">Adjust the visual color space of your workspace environment.</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={darkMode ? "default" : "outline"} className="cursor-pointer font-bold px-3 py-1 rounded-lg" onClick={() => { setDarkMode(true); notifyChange("Dark Mode", true); }}>Dark</Badge>
                <Badge variant={!darkMode ? "default" : "outline"} className="cursor-pointer font-bold px-3 py-1 rounded-lg" onClick={() => { setDarkMode(false); notifyChange("Light Mode", false); }}>Light</Badge>
              </div>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-sm">System Accent Color</p>
                <p className="text-xs text-muted-foreground">Select a curated, sleek tone for your UI buttons, links, and markers.</p>
              </div>
              <div className="flex gap-2">
                {[
                  { hex: "#3b82f6", label: "Blue" },
                  { hex: "#10b981", label: "Emerald" },
                  { hex: "#f59e0b", label: "Amber" },
                  { hex: "#8b5cf6", label: "Violet" }
                ].map(item => (
                  <div 
                    key={item.hex} 
                    className={`h-7 w-7 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 active:scale-95 ${activeColor === item.hex ? 'border-primary scale-105 shadow-lg shadow-primary/20' : 'border-white/10'}`} 
                    style={{ backgroundColor: item.hex }} 
                    title={item.label}
                    onClick={() => { setActiveColor(item.hex); notifyChange("Accent Color", item.label); }}
                  />
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* 2. REGIONAL PREFERENCES */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> Regional Preferences
          </h2>
          <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 flex items-center justify-between border-b border-border/40">
              <div className="space-y-1">
                <p className="font-semibold text-sm">Default Asset Valuations Currency</p>
                <p className="text-xs text-muted-foreground">Select the default currency symbol displayed in lists and cards.</p>
              </div>
              <select 
                className="h-9 px-3 bg-secondary/35 border border-border/60 rounded-md text-xs font-bold focus:outline-none"
                value={currency}
                onChange={(e) => { setCurrency(e.target.value); notifyChange("Default Currency", e.target.value); }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-sm">System UI Language</p>
                <p className="text-xs text-muted-foreground">Modify the text display language for widgets and layouts.</p>
              </div>
              <select 
                className="h-9 px-3 bg-secondary/35 border border-border/60 rounded-md text-xs font-bold focus:outline-none"
                value={language}
                onChange={(e) => { setLanguage(e.target.value); notifyChange("Language", e.target.value); }}
              >
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
                <option value="fr">Français (FR)</option>
              </select>
            </div>
          </Card>
        </section>

        {/* SUBSCRIPTION & BILLING */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary animate-pulse" /> Subscription & Licensing
          </h2>
          <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border/20">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-foreground">Operational Plan Management</h3>
                <p className="text-xs text-muted-foreground">Manage your workspace operating license tier and console capabilities.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Current Level:</span>
                <Badge className={currentPlan === "premium" ? "bg-primary/20 text-primary border-none font-bold uppercase" : "bg-secondary text-muted-foreground border-none font-bold uppercase"}>
                  {currentPlan === "premium" ? "Premium Suite (All Niches)" : `${currentPlan} plan`}
                </Badge>
              </div>
            </div>

            {currentPlan !== "premium" ? (
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" /> Unified Ecosystem Upgrade
                  </div>
                  <h4 className="font-extrabold text-foreground text-lg uppercase tracking-tight">Unlock all 4 Niches</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Gain immediate access to all four custom real estate consoles (Personal, Rental, Builder, and Enterprise) on a single database. Perfect for developers managing landlord accounts and corporate divisions.
                  </p>
                </div>
                <Button 
                  onClick={handleUpgradePlan} 
                  disabled={isUpgrading}
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 px-6 py-5 shrink-0 flex items-center gap-2"
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Upgrading...
                    </>
                  ) : (
                    "Upgrade to Premium Suite"
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground text-sm uppercase">Full Workspace Access Active</h4>
                  <p className="text-xs text-muted-foreground">
                    All 4 Real Estate Operating System consoles (Personal, Rental, Builder, Enterprise) are licensed and active on this profile. Use the selector dropdown to switch portfolios.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* 3. DATA & COMPLIANCE */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-red-500 mb-4 flex items-center gap-2">
            <Database className="h-4 w-4" /> Data Compliance & Control
          </h2>
          <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 flex items-center justify-between border-b border-red-500/10">
              <div className="space-y-1">
                <p className="font-semibold text-sm">Export Workspace Portfolio Data</p>
                <p className="text-xs text-muted-foreground">Download all catalogued properties, deeds, summaries, and history in a ZIP bundle.</p>
              </div>
              <Button variant="outline" size="sm" className="border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold" onClick={() => toast({ title: "Export Initiated", description: "Your workspace package is compressing. Download starting." })}>Export Package</Button>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-red-500 text-sm">Archive Workspace Profile</p>
                <p className="text-xs text-muted-foreground">Permanently delete this organization, members, and revoke credentials from the system.</p>
              </div>
              <Button variant="destructive" size="sm" className="font-bold" onClick={() => toast({ title: "Destruction Request", description: "For safety, contact workspace owner/administrator to confirm profile deletion.", variant: "destructive" })}>Terminate</Button>
            </div>
          </Card>
        </section>

      </div>
    </div>
  );
}
