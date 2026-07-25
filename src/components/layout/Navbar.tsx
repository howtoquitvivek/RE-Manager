"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useOnboardingStore } from "@/store/onboarding-store";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/40 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground shadow-sm">
            <Building2 className="h-5 w-5 text-background" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            RE Manager <span className="text-muted-foreground font-normal">OS</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#workflow" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Workflow
          </Link>
          <Link href="#ai" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            AI Intelligence
          </Link>
          <Link href="#maps" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Mapping
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="text-foreground hover:bg-secondary/80">
              Sign In
            </Button>
          </Link>
          <Button 
            className="bg-foreground text-background hover:bg-foreground/90"
            onClick={() => useOnboardingStore.getState().openOnboarding()}
          >
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
