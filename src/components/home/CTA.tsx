"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="bg-background py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/10 blur-[100px] -z-10 translate-y-1/2" />
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-border/50 bg-card/50 p-12 text-center backdrop-blur-sm">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            Ready to transform your <br /> real estate operations?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Join the world&apos;s most innovative luxury real estate developers and 
            asset managers. Start your 30-day free trial today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" className="h-12 bg-foreground px-8 text-background hover:bg-foreground/90">
              Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 border-border bg-secondary/50 px-8 text-foreground hover:bg-secondary/80">
              Schedule a Personal Demo
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
