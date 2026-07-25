"use client";

import dynamic from "next/dynamic";
import { MapMarker } from "@/lib/maps/coordinates";
import { Loader2 } from "lucide-react";

const MapProvider = dynamic(() => import("./MapProvider"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center rounded-xl">
      <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
    </div>
  ),
});

const PropertyMarkers = dynamic(() => import("./PropertyMarkers"), {
  ssr: false,
});

interface ProjectMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  orgSlug?: string;
}

export default function ProjectMap({ markers, center, zoom = 13, orgSlug }: ProjectMapProps) {
  // Calculate center from markers if not provided
  const mapCenter = center || (markers.length > 0 
    ? [markers[0].lat, markers[0].lng] as [number, number] 
    : [40.7128, -74.0060] as [number, number]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-slate-100 shadow-sm">
      <MapProvider center={mapCenter} zoom={zoom} className="h-full w-full">
        <PropertyMarkers markers={markers} orgSlug={orgSlug} />
      </MapProvider>
      
      {/* Optional Overlay UI for Project Map */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 text-xs font-medium text-slate-600">
        {markers.length} {markers.length === 1 ? "Location" : "Locations"}
      </div>
    </div>
  );
}
