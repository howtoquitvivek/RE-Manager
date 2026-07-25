export interface Coordinate {
  lat: number;
  lng: number;
}

export interface MapMarker extends Coordinate {
  id: string;
  title: string;
  description?: string;
  price?: number;
  status?: string;
  location?: string;
  imageUrl?: string;
  type: "property" | "project";
}

export const DEFAULT_CENTER: Coordinate = {
  lat: 40.7128,
  lng: -74.0060, // NYC default center
};

export const DEFAULT_ZOOM = 12;
