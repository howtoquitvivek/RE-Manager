"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Search } from "lucide-react";

export function MapsSection() {
  return (
    <section id="maps" className="bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 order-2 lg:order-1">
            <div className="relative rounded-2xl border border-border/50 bg-card/50 overflow-hidden aspect-[4/3] shadow-2xl">
              {/* Map Mockup Background */}
              <div className="absolute inset-0 bg-muted opacity-50">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }} />
              </div>
              
              {/* Map UI Elements */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-2 rounded-full bg-background/80 border border-border/50 px-4 py-2 backdrop-blur-md">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Search locations...</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 border border-border/50 backdrop-blur-md">
                  <Navigation className="h-4 w-4 text-foreground" />
                </div>
              </div>

              {/* Map Pins */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-1/4 left-1/3 z-10"
              >
                <div className="flex flex-col items-center">
                  <div className="rounded-lg bg-blue-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg">
                    $2.4M - Villa Royale
                  </div>
                  <div className="h-4 w-0.5 bg-blue-500" />
                  <MapPin className="h-6 w-6 text-blue-500 fill-blue-500/20" />
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute top-2/3 right-1/4 z-10"
              >
                <div className="flex flex-col items-center">
                  <div className="rounded-lg bg-purple-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg">
                    $5.1M - Sky Loft
                  </div>
                  <div className="h-4 w-0.5 bg-purple-500" />
                  <MapPin className="h-6 w-6 text-purple-500 fill-purple-500/20" />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="flex-1 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Geospatial Precision
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Visualize your entire portfolio on a global scale. Our integrated 
                OpenStreetMap and Leaflet solution provides real-time location 
                intelligence without the heavy overhead of legacy mapping APIs.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-foreground font-semibold mb-2">Local First</h4>
                  <p className="text-sm text-muted-foreground">Performant mapping that works anywhere, even offline.</p>
                </div>
                <div>
                  <h4 className="text-foreground font-semibold mb-2">Custom Layers</h4>
                  <p className="text-sm text-muted-foreground">Overlay zoning, traffic, and market heatmaps easily.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
