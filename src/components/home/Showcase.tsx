"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Bath, Square, ArrowUpRight } from "lucide-react";

const properties = [
  {
    name: "Astra Penthouse",
    location: "Miami, FL",
    price: "$8,500,000",
    beds: 4,
    baths: 4.5,
    sqft: "4,200",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "The Glass House",
    location: "Los Angeles, CA",
    price: "$12,000,000",
    beds: 6,
    baths: 7,
    sqft: "8,500",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
  },
];

export function Showcase() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Exquisite Portfolio Display
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Showcase your assets with stunning high-resolution visuals and 
              instant data overlays for prospective buyers and investors.
            </p>
          </div>
          <button className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors font-medium">
            View All Properties <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {properties.map((property, index) => (
            <motion.div
              key={property.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={property.image} 
                  alt={property.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{property.name}</h3>
                      <p className="text-zinc-300">{property.location}</p>
                    </div>
                    <div className="text-2xl font-bold text-white">{property.price}</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  <span className="text-sm">{property.beds} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4" />
                  <span className="text-sm">{property.baths} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  <span className="text-sm">{property.sqft} sqft</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

          {properties.map((property, index) => (
            <motion.div
              key={property.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl border border-border/30 bg-secondary/20"
            >
              <div className="text-3xl font-bold text-foreground mb-2">{property.name}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{property.location}</div>
            </motion.div>
          ))}
      </div>
    </section>
  );
}
