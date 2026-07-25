"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2, 
  Upload, 
  Map as MapIcon,
  Search,
  Filter,
  Plus
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
import { PersonalProperty } from "@/types/personal";
import PropertyFormModal from "@/components/dashboard/personal/PropertyFormModal";

import Link from "next/link";

interface PropertyListingProps {
  initialProperties: PersonalProperty[];
  userId: string;
  orgId: string;
  orgSlug: string;
}

export default function PropertyListing({ initialProperties, userId, orgId, orgSlug }: PropertyListingProps) {
  const [properties, setProperties] = useState<PersonalProperty[]>(initialProperties);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProperties = properties.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Property Portfolio</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor all your personal real estate assets.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-12 px-6 shadow-xl transition-all hover:scale-105 active:scale-95 gap-2"
        >
          <Plus className="h-5 w-5" />
          New Property
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search properties by name or address..." 
            className="pl-10 h-11 bg-secondary/20 border-border/40 rounded-xl focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 rounded-xl border-border/40 bg-secondary/10 gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {filteredProperties.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-border/60 bg-secondary/5 rounded-3xl">
          <div className="h-20 w-20 rounded-full bg-secondary/40 flex items-center justify-center mb-6">
            <Building2 className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold">No properties found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            {search ? "Try adjusting your search filters." : "Start by adding your first personal property to your portfolio."}
          </p>
          {!search && (
            <Button 
              variant="outline" 
              className="mt-8 rounded-full border-primary/30 hover:bg-primary/5 text-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Add Your First Property
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group overflow-hidden border-border/40 bg-card/40 backdrop-blur-md rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20">
                <div className="h-48 w-full bg-secondary/30 relative overflow-hidden">
                  {property.images ? (
                    <img 
                      src={JSON.parse(property.images)[0]} 
                      alt={property.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none font-bold">
                      {property.status}
                    </Badge>
                  </div>
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={(props) => (
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80" {...props}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        )} />

                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/40 backdrop-blur-xl">
                        <DropdownMenuItem className="gap-2 focus:bg-primary/5 focus:text-primary cursor-pointer">
                          <Edit3 className="h-4 w-4" /> Edit Property
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 focus:bg-primary/5 focus:text-primary cursor-pointer">
                          <Upload className="h-4 w-4" /> Upload Docs
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 focus:bg-destructive/5 focus:text-destructive cursor-pointer">
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight truncate group-hover:text-primary transition-colors">
                      {property.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {property.address}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Estimated Value</p>
                      <p className="text-lg font-bold text-foreground">
                        ${property.estimatedValue?.toLocaleString()}
                      </p>
                    </div>
                    <Link href={`/dashboard/${orgSlug}/properties/${property.id}`}>
                      <Button variant="ghost" size="sm" className="rounded-full gap-2 hover:bg-primary/5 hover:text-primary">
                        View
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/${orgSlug}/documents`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full rounded-xl bg-secondary/50 hover:bg-secondary/70 gap-2">
                        <Upload className="h-3 w-3" />
                        Docs
                      </Button>
                    </Link>
                    <Link href={`/dashboard/${orgSlug}/maps`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full rounded-xl bg-secondary/50 hover:bg-secondary/70 gap-2">
                        <MapIcon className="h-3 w-3" />
                        Map
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <PropertyFormModal 
        userId={userId}
        orgId={orgId}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newProp: PersonalProperty) => {
          setProperties([newProp, ...properties]);
          setIsModalOpen(false);
        }}
      />

    </div>
  );
}
