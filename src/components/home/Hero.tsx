"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { useOnboardingStore } from "@/store/onboarding-store";

export function Hero() {
  const openOnboarding = useOnboardingStore((state) => state.openOnboarding);

  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-20 lg:pt-28 lg:pb-32">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500" />
            Next-Gen Real Estate OS is here
            <ChevronRight className="h-3 w-3" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl uppercase"
          >
            The Operating System for <br />
            <span>
              Real Estate and Assets
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Manage multi-tenant property and asset portfolios, legal documents, and development 
            workflows with enterprise-grade AI and precision mapping.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row px-4 sm:px-0"
          >
            <Button 
              size="lg" 
              className="h-12 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.15)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={openOnboarding}
            >
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 w-full sm:w-auto border-border/50 bg-secondary/50 px-8 text-foreground hover:bg-secondary/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95">
              <Play className="mr-2 h-4 w-4 fill-current" /> Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative mx-auto max-w-6xl"
        >
          <div className="relative rounded-2xl border border-border/50 bg-card/50 p-2 backdrop-blur-sm shadow-2xl shadow-blue-500/5">
            <div className="overflow-hidden rounded-xl border border-border/50 bg-background/50">
              <div className="flex h-12 items-center gap-2 border-b border-border/50 bg-secondary/50 px-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/40" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/40" />
                  <div className="h-3 w-3 rounded-full bg-green-500/40" />
                </div>
                <div className="ml-4 flex h-6 w-64 items-center rounded-md bg-background/40 px-2 text-[10px] text-muted-foreground">
                  dashboard.re-manager.os/luxury-estates
                </div>
              </div>
              {/* This is a placeholder for a screenshot. I'll use a styled div to mimic a dashboard if no image is available. */}
              <div className="aspect-[16/9] w-full bg-background p-8">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-3 space-y-4">
                    <div className="h-32 rounded-lg bg-secondary/30 border border-border/30" />
                    <div className="h-64 rounded-lg bg-secondary/30 border border-border/30" />
                  </div>
                  <div className="col-span-6 space-y-6">
                    <div className="h-48 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-border/30" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 rounded-lg bg-secondary/30 border border-border/30" />
                      <div className="h-32 rounded-lg bg-secondary/30 border border-border/30" />
                    </div>
                  </div>
                  <div className="col-span-3 space-y-4">
                    <div className="h-96 rounded-lg bg-secondary/30 border border-border/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
