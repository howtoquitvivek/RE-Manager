"use client";

import { Marker, Popup } from "react-leaflet";
import { MapMarker } from "@/lib/maps/coordinates";
import { formatMapPrice } from "@/lib/maps/map-utils";
import { MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PropertyMarkersProps {
  markers: MapMarker[];
  orgSlug?: string;
}

export default function PropertyMarkers({
  markers,
  orgSlug,
}: PropertyMarkersProps) {
  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
        >
          <Popup>
            <div className="w-64 rounded-xl overflow-hidden bg-white shadow-lg">

              {marker.imageUrl && (
                <div className="h-32 w-full overflow-hidden bg-slate-100">
                  <img
                    src={marker.imageUrl}
                    alt={marker.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4 space-y-3">

                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {marker.title}
                  </h3>

                  {marker.status && (
                    <span className="text-[10px] border border-slate-300 rounded-full px-2 py-0.5 text-slate-600">
                      {marker.status}
                    </span>
                  )}
                </div>

                {marker.location && (
                  <div className="flex items-center text-slate-500 text-xs">
                    <MapPin className="h-3 w-3 mr-1" />

                    <span className="line-clamp-1">
                      {marker.location}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">

                  <span className="text-sm font-bold text-blue-600">
                    {marker.price
                      ? formatMapPrice(marker.price)
                      : "Contact for price"}
                  </span>

                  {orgSlug && (
                    <Link
                      href={`/dashboard/${orgSlug}/properties/${marker.id}`}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>

              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}