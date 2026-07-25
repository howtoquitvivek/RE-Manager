"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { MAP_TILES, MAP_ATTRIBUTION, fixLeafletIcon } from "@/lib/maps/map-utils";
import { useEffect } from "react";
import L from "leaflet";

interface MapProviderProps {
  center: [number, number];
  zoom: number;
  children?: React.ReactNode;
  className?: string;
}

// Helper to handle map resize and icon fixing
function MapEffects() {
  const map = useMap();
  
  useEffect(() => {
    fixLeafletIcon();
    // Invalidate size after a short delay to ensure the container is ready
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export default function MapProvider({ center, zoom, children, className }: MapProviderProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className={className}
      zoomControl={false} // We'll add custom zoom controls or use default in a different position
    >
      <TileLayer
        attribution={MAP_ATTRIBUTION}
        url={MAP_TILES.VOYAGER}
      />
      <MapEffects />
      {children}
    </MapContainer>
  );
}
