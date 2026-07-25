"use client";

import { motion } from "framer-motion";
import { BrainCircuit, FileSearch, Sparkles, Wand2 } from "lucide-react";

export function AIFeatures() {
  return (
    <section id="ai" className="bg-background py-24 sm:py-32 overflow-hidden relative">
      {/* Animated background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background">
                <BrainCircuit className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Gemini Intelligence</span>
          </motion.h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Leverage advanced Large Language Models to automate legal analysis, 
            summarize complex property documents, and generate market insights.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Legal Extraction",
              description: "Automatically extract key clauses and dates from thousands of legal documents in seconds.",
              icon: FileSearch,
            },
            {
              title: "Property Summaries",
              description: "Get instant AI-generated summaries for every asset in your portfolio.",
              icon: Sparkles,
            },
            {
              title: "Smart Recommendations",
              description: "AI-driven insights to optimize your portfolio performance and identify risks.",
              icon: Wand2,
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm"
            >
              <feature.icon className="h-8 w-8 text-blue-400 mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
