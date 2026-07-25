"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Unlock, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVaultStore } from "@/store/useVaultStore";
import { setupVaultPassword, verifyVaultPassword, checkVaultSetup } from "@/actions/personal";
import { useToast } from "@/hooks/use-toast";

interface VaultPasswordFlowProps {
  userId: string;
  onSuccess?: () => void;
  mode?: "verify" | "setup" | "auto";
}

export default function VaultPasswordFlow({ userId, onSuccess, mode = "auto" }: VaultPasswordFlowProps) {
  const [currentMode, setCurrentMode] = useState<"verify" | "setup">("verify");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unlockVault = useVaultStore((state) => state.unlockVault);
  const { toast } = useToast();

  useEffect(() => {
    async function init() {
      if (mode === "auto") {
        const hasSetup = await checkVaultSetup(userId);
        setCurrentMode(hasSetup ? "verify" : "setup");
      } else {
        setCurrentMode(mode);
      }
      setIsChecking(false);
    }
    init();
  }, [userId, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (currentMode === "setup") {
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        await setupVaultPassword(userId, password);
        toast({ title: "Vault Secured", description: "Your vault password has been set." });
        unlockVault();
        onSuccess?.();
      } else {
        const res = await verifyVaultPassword(userId, password);
        if (res.success) {
          unlockVault();
          onSuccess?.();
        } else {
          throw new Error("Incorrect password.");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="max-w-md w-full mx-auto border-border/40 bg-card/40 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Shield className="h-24 w-24" />
      </div>
      
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-primary/20">
          {currentMode === "setup" ? (
            <KeyRound className="h-8 w-8 text-primary" />
          ) : (
            <Lock className="h-8 w-8 text-primary" />
          )}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {currentMode === "setup" ? "Secure Your Vault" : "Vault Access Required"}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {currentMode === "setup" 
            ? "Create a dedicated password for your sensitive property documents and records."
            : "Please enter your vault password to continue."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="vault-password">
            {currentMode === "setup" ? "Vault Password" : "Password"}
          </Label>
          <div className="relative">
            <Input
              id="vault-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary/20 border-border/50 h-11 focus-visible:ring-primary/30"
              required
            />
          </div>
        </div>

        {currentMode === "setup" && (
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-secondary/20 border-border/50 h-11 focus-visible:ring-primary/30"
              required
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full h-11 text-base font-semibold transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : currentMode === "setup" ? (
            "Create Secure Vault"
          ) : (
            "Unlock Vault"
          )}
        </Button>
      </form>

      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
          <Shield className="h-3 w-3" />
          End-to-End Encrypted Handling
        </div>
      </div>
    </Card>
  );
}
