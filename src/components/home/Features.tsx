"use client";

import { motion } from "framer-motion";
import { 
  Building, 
  ShieldCheck, 
  Sparkles, 
  BarChart3, 
  Map as MapIcon, 
  Users2 
} from "lucide-react";

const features = [
  {
    title: "Property Management",
    description: "Full lifecycle management for luxury portfolios, from acquisition to tenant relations.",
    icon: Building,
  },
  {
    title: "Legal Document Vault",
    description: "Secure, encrypted storage for sensitive real estate contracts and titles.",
    icon: ShieldCheck,
  },
  {
    title: "AI Property Insights",
    description: "Gemini-powered analysis of market trends and legal document summaries.",
    icon: Sparkles,
  },
  {
    title: "Portfolio Analytics",
    description: "Real-time performance metrics and financial reporting across all assets.",
    icon: BarChart3,
  },
  {
    title: "Precision Mapping",
    description: "Interactive GIS and Leaflet-based mapping for geographical asset tracking.",
    icon: MapIcon,
  },
  {
    title: "Team Collaboration",
    description: "Multi-tenant organization management with granular permission controls.",
    icon: Users2,
  },
];

export function Features() {
  return (
    <section id="features" className="bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to scale
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A comprehensive suite of tools designed specifically for the complexities 
            of modern real estate development and management.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-secondary/50 p-8 hover:bg-secondary/80 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
