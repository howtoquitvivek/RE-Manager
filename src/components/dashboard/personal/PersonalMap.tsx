"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Building2, Navigation, ExternalLink, Sparkles, Hammer, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Custom marker icons for each workspace type
const createCustomIcon = (type: string) => {
  let color = "bg-primary";
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;

  if (type === "rental") {
    color = "bg-emerald-500";
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>`;
  } else if (type === "builder") {
    color = "bg-primary";
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.34 18.65a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>`;
  } else if (type === "enterprise") {
    color = "bg-amber-500";
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  }

  return L.divIcon({
    html: `<div class="w-8 h-8 rounded-full ${color} border-4 border-white shadow-xl flex items-center justify-center text-white">${svg}</div>`,
    className: "custom-div-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface MapPageProps {
  properties?: any[];
  workspaceType?: string;
  orgSlug?: string;
  isMini?: boolean;
}

export default function PersonalMap({ 
  properties = [], 
  workspaceType = "personal", 
  orgSlug = "", 
  isMini = false 
}: MapPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-secondary/20 animate-pulse rounded-xl" />;

  // Fill in mock lat/lons if not present to ensure beautiful visual presentation
  const mappedProperties = properties.map((p, idx) => {
    const latOffsets = [0.05, -0.04, 0.02, -0.03];
    const lonOffsets = [-0.03, 0.04, -0.01, 0.05];
    return {
      ...p,
      latitude: p.latitude || (28.6139 + (latOffsets[idx % 4])),
      longitude: p.longitude || (77.2090 + (lonOffsets[idx % 4])),
    };
  });

  const center: [number, number] = mappedProperties.length > 0 
    ? [mappedProperties[0].latitude || 28.6139, mappedProperties[0].longitude || 77.2090] 
    : [28.6139, 77.2090]; // Default to New Delhi NCR region for luxury showcase

  return (
    <div className="w-full h-full relative group">
      <MapContainer
        center={center}
        zoom={isMini ? 11 : 12}
        className="w-full h-full"
        scrollWheelZoom={!isMini}
        zoomControl={!isMini}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        {mappedProperties.map((property) => {
          let badgeText = `$${(property.estimatedValue || 180000).toLocaleString()}`;
          let subText = property.address || "New Delhi NCR Cluster";
          let actionLabel = "View details";
          let actionHref = `/dashboard/${orgSlug}/properties`;

          if (workspaceType === "rental") {
            badgeText = `$${(property.rentAmount || 4200).toLocaleString()}/mo`;
            subText = `Rent Yield — ${property.occupancyStatus === "occupied" ? "Occupied" : "Vacant"}`;
            actionLabel = "Rent Tracker";
            actionHref = `/dashboard/${orgSlug}/rent`;
          } else if (workspaceType === "builder") {
            badgeText = "Site Stage Active";
            subText = property.description || "Excavation & slab planning";
            actionLabel = "Construction Log";
            actionHref = `/dashboard/${orgSlug}/construction`;
          } else if (workspaceType === "enterprise") {
            badgeText = "Regional Cluster Hub";
            subText = property.address || "Corporate portfolio";
            actionLabel = "Global Inventory";
            actionHref = `/dashboard/${orgSlug}/inventory`;
          }

          return (
            <Marker 
              key={property.id} 
              position={[property.latitude, property.longitude]}
              icon={createCustomIcon(workspaceType)}
            >
              <Popup className="premium-popup">
                <Card className="border-none shadow-none bg-transparent w-56 p-0">
                  <div className="h-28 w-full bg-secondary/50 rounded-t-xl relative overflow-hidden">
                    {property.images ? (
                      <img src={JSON.parse(property.images)[0]} alt={property.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/80">
                        <Building2 className="h-8 w-8 opacity-25" />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2 bg-primary/80 backdrop-blur-md text-[9px] font-extrabold uppercase tracking-wider">
                      {badgeText}
                    </Badge>
                  </div>
                  <div className="p-3 bg-card">
                    <h4 className="font-extrabold text-sm truncate text-foreground">{property.name}</h4>
                    <p className="text-[10px] text-muted-foreground truncate mb-3 mt-1 font-semibold">{subText}</p>
                    <Link href={actionHref}>
                      <Button size="sm" className="w-full h-8 text-[10px] font-extrabold uppercase tracking-widest gap-1 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl">
                        {actionLabel}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Popup>
            </Marker>
          );
        })}
        {mappedProperties.length > 0 && <MapUpdater center={center} />}
      </MapContainer>

      {isMini && (
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
}
