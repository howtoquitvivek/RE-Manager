import L from "leaflet";

/**
 * Modern tile layer configurations for a premium look.
 * Voyager: Clean, modern, great for dashboards.
 */
export const MAP_TILES = {
  VOYAGER: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  VOYAGER_NOLABELS: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
  LIGHT: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  DARK: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

/**
 * Fixes the default Leaflet marker icon issue in Next.js/Webpack environments.
 * This should be called before rendering any Leaflet map.
 */
export const fixLeafletIcon = () => {
  if (typeof window === "undefined") return;
  
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

/**
 * Formats a price for display in map popups.
 */
export const formatMapPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};
