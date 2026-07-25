"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Layout, Milestone, Settings } from "lucide-react";

export function Workflow() {
  return (
    <section id="workflow" className="bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-3 py-1 text-sm font-medium text-blue-400"
            >
              <Layout className="h-4 w-4" />
              Developer First
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Streamline your development <br />
              lifecycle from start to finish.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              Our workflow engine automates the tedious parts of property management, 
              allowing you to focus on high-impact decision making.
            </motion.p>

            <div className="mt-10 space-y-6">
              {[
                { title: "Automated Milestone Tracking", icon: Milestone },
                { title: "Integrated Property Logic", icon: Settings },
                { title: "Seamless Document Approvals", icon: CheckCircle2 },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4 text-foreground"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{item.title}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square w-full rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-6 h-full">
                <div className="space-y-6">
                  <div className="h-1/2 rounded-xl bg-gradient-to-br from-blue-500/20 to-transparent border border-border/30 p-4">
                    <div className="h-2 w-12 rounded bg-blue-400/20" />
                    <div className="mt-4 h-4 w-full rounded bg-muted" />
                    <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
                  </div>
                  <div className="h-[calc(50%-1.5rem)] rounded-xl bg-secondary/30 border border-border/30 p-4" />
                </div>
                <div className="space-y-6 pt-12">
                  <div className="h-[calc(50%-1.5rem)] rounded-xl bg-secondary/30 border border-border/30 p-4" />
                  <div className="h-1/2 rounded-xl bg-gradient-to-br from-purple-500/20 to-transparent border border-border/30 p-4">
                    <div className="h-2 w-12 rounded bg-purple-400/20" />
                    <div className="mt-4 h-4 w-full rounded bg-muted" />
                    <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

