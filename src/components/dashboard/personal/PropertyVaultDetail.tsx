"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Sparkles, 
  ArrowLeft,
  Search,
  MoreVertical,
  Shield,
  Clock,
  Calendar
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PersonalProperty, PropertyDocument } from "@/types/personal";
import DocumentUploadModal from "@/components/dashboard/personal/DocumentUploadModal";

import VaultPasswordFlow from "./VaultPasswordFlow";
import { useVault } from "@/store/useVaultStore";
import { useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface PropertyVaultDetailProps {
  property: PersonalProperty;
  initialDocuments: PropertyDocument[];
  userId: string;
  orgSlug: string;
}

export default function PropertyVaultDetail({ property, initialDocuments, userId, orgSlug }: PropertyVaultDetailProps) {
  const [documents, setDocuments] = useState<PropertyDocument[]>(initialDocuments);
  const [search, setSearch] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { isUnlocked, unlockVault } = useVault();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredDocs = documents.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <VaultPasswordFlow userId={userId} onSuccess={() => unlockVault()} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-6">
        <Link href={`/dashboard/${orgSlug}/documents`}>
          <Button variant="ghost" size="sm" className="w-fit text-muted-foreground hover:text-foreground gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Vault
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/30 backdrop-blur-xl border border-border/40 p-8 rounded-[2.5rem]">
          <div className="flex items-center gap-8">
            <div className="h-24 w-24 rounded-3xl bg-secondary/30 flex items-center justify-center overflow-hidden shrink-0 border border-border/40 shadow-xl">
              {property.images ? (
                <img src={JSON.parse(property.images)[0]} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-12 w-12 text-muted-foreground/30" />
              )}
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight">{property.name} Vault</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                <p className="flex items-center gap-1"><Shield className="h-4 w-4 text-emerald-500" /> Securely Vaulted</p>
                <p className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Added {new Date(property.createdAt).toLocaleDateString()}</p>
                <Badge className="bg-primary/10 text-primary border-none font-bold">
                  ${property.estimatedValue?.toLocaleString()}
                </Badge>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-2"
          >
            <Upload className="h-5 w-5" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search documents..." 
            className="pl-10 h-11 bg-secondary/20 border-border/40 rounded-xl focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1">
        {filteredDocs.length === 0 ? (
          <Card className="p-20 flex flex-col items-center justify-center text-center border-dashed border-2 border-border/60 bg-secondary/5 rounded-[2rem]">
            <FileText className="h-16 w-16 text-muted-foreground/20 mb-6" />
            <h3 className="text-xl font-bold">No documents yet</h3>
            <p className="text-muted-foreground mt-2 max-w-xs">
              Upload deeds, titles, tax records, or any other property-related documents.
            </p>
            <Button variant="outline" className="mt-8 rounded-full" onClick={() => setIsUploadModalOpen(true)}>
              Upload First Document
            </Button>
          </Card>
        ) : (
          filteredDocs.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group p-6 border-border/40 bg-card/40 backdrop-blur-md rounded-[2rem] transition-all hover:bg-secondary/20 hover:border-primary/20">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">{doc.name}</h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <p className="flex items-center gap-1 uppercase font-bold tracking-widest">
                            <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(doc.createdAt))} ago
                          </p>
                          <p className="uppercase font-bold tracking-widest">{doc.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-full h-10 px-4 gap-2 hover:bg-primary/5 hover:text-primary">
                          <Download className="h-4 w-4" /> Download
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={(props) => (
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" {...props}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          )} />

                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/40 backdrop-blur-xl">
                            <DropdownMenuItem className="gap-2 focus:bg-primary/5 focus:text-primary cursor-pointer">
                              <Eye className="h-4 w-4" /> View Online
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 focus:bg-destructive/5 focus:text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {doc.aiSummary && (
                      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 relative overflow-hidden group/ai">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <Sparkles className="h-12 w-12" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                          <h4 className="text-sm font-bold text-primary uppercase tracking-[0.15em]">AI Intelligence Summary</h4>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed italic">
                          &quot;{doc.aiSummary}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <DocumentUploadModal 
        propertyId={property.id}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(newDoc: PropertyDocument) => {
          setDocuments([newDoc, ...documents]);
          setIsUploadModalOpen(false);
        }}
      />

    </div>
  );
}
