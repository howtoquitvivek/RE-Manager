"use client";

import dynamic from "next/dynamic";
import { MapMarker } from "@/lib/maps/coordinates";
import { Loader2 } from "lucide-react";

// Dynamically import the map components to avoid SSR issues with Leaflet
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

interface PropertyMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  orgSlug?: string;
}

export default function PropertyMap({ markers, center, zoom = 14, orgSlug }: PropertyMapProps) {
  const mapCenter = center || (markers.length > 0 ? [markers[0].lat, markers[0].lng] as [number, number] : [40.7128, -74.0060] as [number, number]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden">
      <MapProvider center={mapCenter} zoom={zoom} className="h-full w-full">
        <PropertyMarkers markers={markers} orgSlug={orgSlug} />
      </MapProvider>
    </div>
  );
}
