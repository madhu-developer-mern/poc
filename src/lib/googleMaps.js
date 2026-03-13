export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export const GOOGLE_MAPS_MAP_ID = String(import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "").trim();

export const GOOGLE_MAPS_LIBRARIES = ["geometry", "places", "marker"];

export const GOOGLE_MAPS_LOADER_OPTIONS = {
  id: "script-loader",
  version: "weekly",
  language: "en",
  region: "US",
  authReferrerPolicy: "origin",
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  libraries: GOOGLE_MAPS_LIBRARIES,
  ...(GOOGLE_MAPS_MAP_ID ? { mapIds: [GOOGLE_MAPS_MAP_ID] } : {}),
};

export function withGoogleMapId(options = {}) {
  if (!GOOGLE_MAPS_MAP_ID) return options;

  const { styles, ...rest } = options;
  return { ...rest, mapId: GOOGLE_MAPS_MAP_ID };
}
