"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Files, 
  Search, 
  ChevronRight, 
  Building2, 
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PersonalProperty } from "@/types/personal";
import Link from "next/link";

interface DocumentVaultProps {
  properties: PersonalProperty[];
  orgSlug: string;
}

export default function DocumentVault({ properties, orgSlug }: DocumentVaultProps) {
  const [search, setSearch] = React.useState("");

  const filteredProperties = properties.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Document Vault</h1>
        </div>
        <p className="text-muted-foreground text-lg">Secure, encrypted storage for your critical property documentation.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="p-6 border-border/40 bg-primary/5 backdrop-blur-md rounded-3xl border-primary/20">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Files className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold">Total Vaulted Files</h3>
          <p className="text-3xl font-bold mt-2">24</p>
          <p className="text-xs text-muted-foreground mt-2">Across {properties.length} properties</p>
        </Card>
        <Card className="p-6 border-border/40 bg-card/40 backdrop-blur-md rounded-3xl">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold">Missing Records</h3>
          <p className="text-3xl font-bold mt-2">3</p>
          <p className="text-xs text-muted-foreground mt-2">Action recommended</p>
        </Card>
        <Card className="p-6 border-border/40 bg-card/40 backdrop-blur-md rounded-3xl">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold">AI Summaries</h3>
          <p className="text-3xl font-bold mt-2">18</p>
          <p className="text-xs text-muted-foreground mt-2">Intelligence active</p>
        </Card>
      </div>

      <div className="flex items-center gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search property vaults..." 
            className="pl-10 h-12 bg-secondary/20 border-border/40 rounded-2xl focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1">
        {filteredProperties.map((property, i) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/dashboard/${orgSlug}/documents/${property.id}`}>
              <Card className="group p-6 border-border/40 bg-card/40 backdrop-blur-md rounded-[2rem] transition-all hover:bg-secondary/20 hover:border-primary/20 cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-secondary/30 flex items-center justify-center overflow-hidden shrink-0 border border-border/40">
                    {property.images ? (
                      <img src={JSON.parse(property.images)[0]} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="h-8 w-8 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{property.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated 2 days ago
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden md:flex items-center gap-8 text-right">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Files</p>
                      <p className="font-bold">8 Documents</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Status</p>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        Secure
                      </Badge>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-secondary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
