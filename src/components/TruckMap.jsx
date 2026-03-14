import { Suspense, lazy, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, OverlayView, Polyline } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { TRUCKS, TRIPS } from "../data/mockData";
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_LOADER_OPTIONS,
  GOOGLE_MAPS_MAP_ID,
  withGoogleMapId,
} from "../lib/googleMaps";

const ThreeTruckIcon = lazy(() => import("./ThreeTruckIcon"));

const STATUS_COLORS = {
  in_transit: "#2563EB",
  loading:    "#D97706",
  delivered:  "#16A34A",
  alert:      "#DC2626",
};

const STATUS_LABELS = {
  in_transit: "In Transit",
  loading:    "Loading",
  delivered:  "Delivered",
  alert:      "Alert",
};

const MOVEMENT_SPEED_FACTOR = 0.35;

// Light Ola/Uber style map
const OLA_MAP_STYLE = [
  { featureType: "poi",             stylers: [{ visibility: "off" }] },
  { featureType: "poi.park",        elementType: "geometry",   stylers: [{ color: "#E8F5E9" }] },
  { featureType: "poi.park",        elementType: "labels.text.fill", stylers: [{ color: "#A5D6A7" }] },
  { featureType: "water",           elementType: "geometry",   stylers: [{ color: "#C8DCF0" }] },
  { featureType: "water",           elementType: "labels.text.fill", stylers: [{ color: "#78AACF" }] },
  { featureType: "landscape",       elementType: "geometry",   stylers: [{ color: "#F5F5F0" }] },
  { featureType: "road",            elementType: "geometry",   stylers: [{ color: "#FFFFFF" }] },
  { featureType: "road",            elementType: "geometry.stroke", stylers: [{ color: "#E0E0E0" }] },
  { featureType: "road.highway",    elementType: "geometry",   stylers: [{ color: "#FFF3E0" }] },
  { featureType: "road.highway",    elementType: "geometry.stroke", stylers: [{ color: "#FFB74D" }] },
  { featureType: "road.highway",    elementType: "labels.text.fill", stylers: [{ color: "#E65100" }] },
  { featureType: "road",            elementType: "labels.text.fill", stylers: [{ color: "#9E9E9E" }] },
  { featureType: "transit",         stylers: [{ visibility: "off" }] },
  { featureType: "administrative",  elementType: "geometry.stroke", stylers: [{ color: "#BDBDBD" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#555555" }] },
];

// Detailed side-view truck used in cards and lightweight markers.
function TruckSVG({ color, size = 56, speed = 0 }) {
  const s = Math.max(0, speed || 0);
  const hasMotion = s > 1;
  const dur = hasMotion ? Math.max(0.3, 6 / s) : 0;
  const w1 = hasMotion
    ? { transformOrigin: "52px 76px", animation: `truck-wheel-spin ${dur}s linear infinite` }
    : { transformOrigin: "52px 76px" };
  const w2 = hasMotion
    ? { transformOrigin: "118px 76px", animation: `truck-wheel-spin ${dur}s linear infinite` }
    : { transformOrigin: "118px 76px" };
  const w3 = hasMotion
    ? { transformOrigin: "142px 76px", animation: `truck-wheel-spin ${dur}s linear infinite` }
    : { transformOrigin: "142px 76px" };

  return (
    <svg width={size * 1.55} height={size} viewBox="0 0 160 92" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="92" cy="84" rx="60" ry="8" fill="rgba(15,23,42,0.16)" />

      <path d="M66 18h78c4 0 7 3 7 7v33c0 4-3 7-7 7H66V18Z" fill="url(#cont)" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={72 + i * 6} y={24} width={2} height={36} rx={1} fill="rgba(120,53,15,0.22)" />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={`t${i}`} x={74 + i * 7} y={20} width={4.5} height={1.6} rx={0.8} fill="rgba(120,53,15,0.25)" />
      ))}

      <path d="M40 62h112c3 0 5 2 5 5v6H35v-6c0-3 2-5 5-5Z" fill="#0F172A" opacity={0.9} />
      <rect x="96" y="60" width="20" height="7" rx="3.5" fill={color} opacity={0.55} />

      <path
        d="M18 36c0-7 6-13 13-13h22c6 0 10 4 10 10v24c0 3-2 5-5 5H24c-3 0-6-3-6-6V36Z"
        fill="url(#cab)"
      />
      <path d="M10 50c0-6 4-10 10-10h20c3 0 6 2 6 6v16H10V50Z" fill="#111827" />
      <path d="M8 62h40c3 0 5 2 5 5v6H8v-11Z" fill="#0B1220" />
      <rect x="14" y="66" width="12" height="6" rx="2" fill="#E5E7EB" opacity={0.9} />

      <rect x="16" y="52" width="18" height="9" rx="3" fill="url(#gr)" />
      <rect x="17.5" y="54" width="15" height="1.6" rx="0.8" fill="rgba(255,255,255,0.28)" />
      <rect x="17.5" y="57" width="15" height="1.6" rx="0.8" fill="rgba(255,255,255,0.18)" />
      <rect x="17.5" y="60" width="15" height="1.6" rx="0.8" fill="rgba(255,255,255,0.12)" />

      <path d="M26 28h22c5 0 9 4 9 9v10H24V30c0-1 1-2 2-2Z" fill="url(#glass)" />
      <path d="M26 29.5h22c4.2 0 7.5 3.4 7.5 7.5v2.5H24v-8c0-1.1.9-2 2-2Z" fill="rgba(255,255,255,0.10)" />
      <rect x="18.5" y="34" width="4.5" height="6" rx="2" fill="#0F172A" opacity={0.9} />

      {[
        { cx: 52, cy: 76, style: w1 },
        { cx: 118, cy: 76, style: w2 },
        { cx: 142, cy: 76, style: w3 },
      ].map((wheel, idx) => (
        <g key={`w${idx}`} style={wheel.style}>
          <circle cx={wheel.cx} cy={wheel.cy} r="11.5" fill="#0B1220" />
          <circle cx={wheel.cx} cy={wheel.cy} r="8.2" fill="#111827" />
          <circle cx={wheel.cx} cy={wheel.cy} r="6.2" fill="url(#rim)" />
          <rect x={wheel.cx - 0.9} y={wheel.cy - 6.2} width={1.8} height={12.4} rx={0.9} fill="rgba(255,255,255,0.22)" />
          <rect x={wheel.cx - 6.2} y={wheel.cy - 0.9} width={12.4} height={1.8} rx={0.9} fill="rgba(255,255,255,0.14)" />
        </g>
      ))}

      <path d="M40 72c1-10 8-18 18-18s17 8 18 18h-8c-1-6-5-10-10-10s-9 4-10 10h-8Z" fill="#0F172A" opacity={0.85} />
      <path d="M106 72c1-10 8-18 18-18s17 8 18 18h-8c-1-6-5-10-10-10s-9 4-10 10h-8Z" fill="#0F172A" opacity={0.85} />
      <path d="M130 72c1-10 8-18 18-18s17 8 18 18h-8c-1-6-5-10-10-10s-9 4-10 10h-8Z" fill="#0F172A" opacity={0.85} />

      <defs>
        <linearGradient id="cont" x1="66" y1="18" x2="151" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8B36B" />
          <stop offset="0.55" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="cab" x1="18" y1="20" x2="64" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4B5563" />
          <stop offset="0.55" stopColor="#111827" />
          <stop offset="1" stopColor="#0B1220" />
        </linearGradient>
        <linearGradient id="glass" x1="24" y1="28" x2="60" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CBD5E1" stopOpacity="0.9" />
          <stop offset="1" stopColor="#94A3B8" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="gr" x1="16" y1="52" x2="34" y2="61" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <radialGradient id="rim" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.5 0.4) rotate(45) scale(18)">
          <stop stopColor="#FDE68A" />
          <stop offset="1" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Interpolate lat/lng
function interp(from, to, p) {
  return { lat: from.lat + (to.lat - from.lat) * p, lng: from.lng + (to.lng - from.lng) * p };
}

// Bearing between two lat/lng points (for truck rotation)
function bearing(from, to) {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function metersToDegrees(m) {
  // Rough conversion suitable for small tolerances (deviation checks).
  return m / 111_320;
}

function extractOverviewPath(dirResult) {
  const route = dirResult?.routes?.[0];
  if (!route) return null;
  const path = route.overview_path;
  if (!Array.isArray(path) || path.length < 2) return null;
  return path;
}

function ensureLatLngLiteral(p) {
  if (!p) return null;
  if (typeof p.lat === "function" && typeof p.lng === "function") return { lat: p.lat(), lng: p.lng() };
  if (typeof p.lat === "number" && typeof p.lng === "number") return p;
  return null;
}

function distanceMeters(a, b) {
  if (!window.google?.maps?.geometry?.spherical) return null;
  const A = new window.google.maps.LatLng(a.lat, a.lng);
  const B = new window.google.maps.LatLng(b.lat, b.lng);
  return window.google.maps.geometry.spherical.computeDistanceBetween(A, B);
}

function routePointToLiteral(p) {
  // p may be google.maps.LatLng or a literal.
  return ensureLatLngLiteral(p);
}

function interpolateAlongSegment(a, b, t01) {
  if (!window.google?.maps?.geometry?.spherical) return null;
  const A = new window.google.maps.LatLng(a.lat, a.lng);
  const B = new window.google.maps.LatLng(b.lat, b.lng);
  const ll = window.google.maps.geometry.spherical.interpolate(A, B, t01);
  return { lat: ll.lat(), lng: ll.lng() };
}

function headingBetween(a, b) {
  if (!window.google?.maps?.geometry?.spherical) return 0;
  const A = new window.google.maps.LatLng(a.lat, a.lng);
  const B = new window.google.maps.LatLng(b.lat, b.lng);
  // Can be negative; normalize to 0..360
  const h = window.google.maps.geometry.spherical.computeHeading(A, B);
  return (h + 360) % 360;
}

function renderTruckMarkerRoot(root, { rotationDeg, size = 46 }) {
  root.render(
    <Suspense fallback={<div style={{ width: size, height: size }} />}>
      <div
        style={{
          width: size,
          height: size,
          transformOrigin: "center center",
          filter: "drop-shadow(0 4px 8px rgba(15,23,42,0.18))",
        }}
      >
        <ThreeTruckIcon size={size} rotation={rotationDeg} />
      </div>
    </Suspense>
  );
}

function svgToDataUrl(svg) {
  // Use base64 for maximum compatibility in Data URLs
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

function getFallbackTruckMarkerIcon({ rotationDeg, size = 48 }) {
  // Simplified SVG without complex defs for maximum robustness in legacy Markers
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <g transform="rotate(${rotationDeg} 32 32)">
        <ellipse cx="32" cy="56" rx="14" ry="5" fill="rgba(0,0,0,0.12)" />
        <rect x="20" y="44" width="24" height="6" rx="2" fill="#1e293b" />
        <rect x="21" y="16" width="22" height="32" rx="2" fill="#f8fafc" />
        <rect x="18" y="4" width="28" height="15" rx="5" fill="#2563eb" />
        <rect x="20" y="6" width="24" height="9" rx="2" fill="#ffffff" opacity="0.3" />
        <circle cx="21" cy="16" r="1.5" fill="#ffffff" />
        <circle cx="43" cy="16" r="1.5" fill="#ffffff" />
        <rect x="17" y="10" width="4.5" height="9" rx="2.2" fill="#0f172a" />
        <rect x="42.5" y="10" width="4.5" height="9" rx="2.2" fill="#0f172a" />
        <rect x="17" y="38" width="4.5" height="9" rx="2.2" fill="#0f172a" />
        <rect x="42.5" y="38" width="4.5" height="9" rx="2.2" fill="#0f172a" />
      </g>
    </svg>
  `;

  return {
    url: svgToDataUrl(svg),
    scaledSize: new window.google.maps.Size(size, size),
    anchor: new window.google.maps.Point(size / 2, size / 2),
  };
}

function getClusterMarkerIcon({ count, mean }) {
  const isLargeCluster = count > Math.max(10, mean || 0);
  const fill = isLargeCluster ? "#1D4ED8" : "#2563EB";
  const ring = isLargeCluster ? "#93C5FD" : "#BFDBFE";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
      <circle cx="27" cy="27" r="24" fill="${ring}" fill-opacity="0.42" />
      <circle cx="27" cy="27" r="19" fill="${fill}" fill-opacity="0.24" />
      <circle cx="27" cy="27" r="14" fill="${fill}" />
      <text x="27" y="31" text-anchor="middle" font-size="13" font-weight="700" font-family="Arial, sans-serif" fill="#FFFFFF">${count}</text>
    </svg>
  `;

  return {
    url: svgToDataUrl(svg),
    scaledSize: new window.google.maps.Size(54, 54),
    anchor: new window.google.maps.Point(27, 27),
  };
}

function createClusterRenderer() {
  return {
    render(cluster, stats) {
      const count = cluster.count || cluster.markers?.length || 0;
      return new window.google.maps.Marker({
        position: cluster.position,
        zIndex: (window.google.maps.Marker.MAX_ZINDEX || 1000) + count,
        title: `Cluster of ${count} trucks`,
        icon: getClusterMarkerIcon({
          count,
          mean: stats?.clusters?.markers?.mean,
        }),
      });
    },
  };
}

// Truck marker with rotation like Ola
function TruckMarker({ truck, isSelected, onClick, position, rotation }) {
  const color  = STATUS_COLORS[truck.status];
  const isAlert = truck.status === "alert";
  const markerSize = isSelected ? 62 : 46;

  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div
        onClick={() => onClick(truck)}
        style={{
          transform: "translate(-50%, -50%)",
          cursor: "pointer",
          position: "relative",
          userSelect: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Alert pulse */}
        {isAlert && (
          <div style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            border: `2px solid ${color}`,
            animation: "alertPulse 1.4s ease-out infinite",
            pointerEvents: "none",
          }} />
        )}
        {/* Selected glow ring */}
        {isSelected && (
          <div style={{
            position: "absolute", inset: -7, borderRadius: 18,
            border: `2px solid ${color}`,
            boxShadow: `0 0 0 4px ${color}20`,
            pointerEvents: "none",
          }} />
        )}
        {/* Render the high-fidelity 3D model ONLY for the selected truck. */}
        {/* For others, use a lightweight SVG to save WebGL contexts and boost performance. */}
        <div
          style={{
            width: markerSize,
            height: markerSize,
            transformOrigin: "center center",
            filter: "drop-shadow(0 6px 10px rgba(15,23,42,0.20))",
          }}
        >
          {isSelected ? (
            <Suspense fallback={<div style={{ width: markerSize, height: markerSize }} />}>
              <ThreeTruckIcon size={markerSize} rotation={rotation} />
            </Suspense>
          ) : (
            <div 
              style={{ width: "100%", height: "100%" }}
              dangerouslySetInnerHTML={{ __html: `
                <svg xmlns="http://www.w3.org/2000/svg" width="${markerSize}" height="${markerSize}" viewBox="0 0 64 64">
                  <g transform="rotate(${rotation} 32 32)">
                    <rect x="21" y="16" width="22" height="32" rx="2" fill="#f8fafc" />
                    <rect x="18" y="4" width="28" height="15" rx="5" fill="#2563eb" />
                    <rect x="20" y="6" width="24" height="9" rx="2" fill="#ffffff" opacity="0.3" />
                  </g>
                </svg>
              `}} 
            />
          )}
        </div>
        {/* Keep badges on the selected truck only to avoid map clutter. */}
        {isSelected && truck.speed > 0 && (
          <div style={{
            position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
            background: "#FFFFFF", border: `1px solid ${color}`,
            borderRadius: 20, padding: "1px 7px",
            color, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}>
            {truck.speed} km/h
          </div>
        )}
        {isSelected && (
          <div style={{
            position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)",
            background: "#FFFFFF", border: `1px solid ${color}`,
            borderRadius: 6, padding: "1px 6px",
            color: "#111827", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}>
            {truck.id.split("-")[1]}
          </div>
        )}
      </div>
    </OverlayView>
  );
}

// Origin/destination pin
function RoutePin({ position, label, color, isOrigin }) {
  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_LAYER}>
      <div style={{ transform: "translate(-50%, -100%)", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
        <div style={{
          background: "#FFFFFF", border: `1.5px solid ${color}`,
          borderRadius: 8, padding: "3px 9px",
          color: "#111827", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
          <span style={{ color }}>{isOrigin ? "📦" : "🏁"}</span> {label}
        </div>
        <div style={{ width: 2, height: 8, background: color }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
      </div>
    </OverlayView>
  );
}

// Bottom truck info popup (Ola-style card)
function TruckInfoCard({ truck, trip, onClose }) {
  const color = STATUS_COLORS[truck.status];
  const bg    = { in_transit: "#EFF6FF", loading: "#FFFBEB", delivered: "#F0FDF4", alert: "#FEF2F2" }[truck.status];

  return (
    <div style={{
      position: "absolute", bottom: 14, left: 14, right: 14,
      background: "#FFFFFF",
      borderRadius: 18,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      border: "1px solid #E9EDF5",
      overflow: "hidden",
      zIndex: 50,
    }}>
      {/* Color header bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg,${color},${color}88)` }} />
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <ThreeTruckIcon size={40} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{
                  background: bg, color, borderRadius: 20,
                  padding: "2px 9px", fontSize: 11, fontWeight: 700,
                }}>{STATUS_LABELS[truck.status]}</span>
                <span style={{ color: "#111827", fontWeight: 700, fontSize: 15 }}>{truck.id}</span>
              </div>
              <div style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>
                {truck.driver} · {truck.vehicle}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "#F4F6FB", border: "1px solid #E9EDF5", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer", color: "#6B7280", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[
            { icon: "🚀", label: "Speed",      value: `${truck.speed} km/h` },
            { icon: "🌡️", label: "Cargo Temp", value: `${truck.temp}°C`,   alert: truck.temp > 8 },
            { icon: "⛽", label: "Fuel",        value: `${truck.fuel}%`,    warn: truck.fuel < 30 },
            { icon: "💧", label: "Humidity",    value: `${truck.humidity}%` },
          ].map((m) => (
            <div key={m.label} style={{
              background: m.alert ? "#FEF2F2" : m.warn ? "#FFFBEB" : "#F8FAFC",
              border: `1px solid ${m.alert ? "#FECACA" : m.warn ? "#FDE68A" : "#F1F5F9"}`,
              borderRadius: 10, padding: "8px 10px", textAlign: "center",
            }}>
              <div style={{ fontSize: 16 }}>{m.icon}</div>
              <div style={{ color: m.alert ? "#DC2626" : m.warn ? "#D97706" : "#111827", fontWeight: 700, fontSize: 14, marginTop: 2 }}>{m.value}</div>
              <div style={{ color: "#9CA3AF", fontSize: 10 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {trip && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#6B7280", fontSize: 12 }}>
                📦 {trip.origin.split(",")[0]} → 🏁 {trip.destination.split(",")[0]}
              </span>
              <span style={{ color: "#111827", fontSize: 12, fontWeight: 700 }}>{trip.progress}% · {trip.distance} km</span>
            </div>
            <div style={{ background: "#F1F5F9", borderRadius: 4, height: 6 }}>
              <div style={{
                width: `${trip.progress}%`, height: "100%", borderRadius: 4,
                background: truck.status === "alert"
                  ? "linear-gradient(90deg,#F59E0B,#DC2626)"
                  : "linear-gradient(90deg,#2563EB,#7C3AED)",
                transition: "width 0.4s",
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const MAP_OPTIONS = withGoogleMapId({
  styles: OLA_MAP_STYLE,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  clickableIcons: false,
  backgroundColor: "#F5F5F0",
});

export default function TruckMap({
  selectedTruck,
  onSelectTruck,
  showFleetRouteGuides = true,
  showOnlySelectedTruck = false,
}) {
  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);

  const gmapsKeyMissing = !GOOGLE_MAPS_API_KEY || String(GOOGLE_MAPS_API_KEY).trim().length < 10;

  const [mapRef, setMapRef]         = useState(null);
  const [directions, setDirections] = useState({});
  const [suggestedDirections, setSuggestedDirections] = useState({});
  const [offRouteByTruckId, setOffRouteByTruckId] = useState({});
  const [actualPathByTruckId, setActualPathByTruckId] = useState(() =>
    TRUCKS.reduce((acc, t) => {
      acc[t.id] = [{ lat: t.lat, lng: t.lng }];
      return acc;
    }, {})
  );
  const actualPathRef = useRef(actualPathByTruckId);
  const plannedOverviewPathRef = useRef({});
  const offRouteInternalRef = useRef({});
  const [truckPositions, setTruckPositions] = useState(() =>
    TRUCKS.reduce((acc, t) => {
      const trip = TRIPS.find((tr) => tr.truckId === t.id);
      if (trip) {
        acc[t.id] = { pos: interp(trip.originCoords, trip.destCoords, trip.progress / 100), heading: bearing(trip.originCoords, trip.destCoords) };
      } else {
        acc[t.id] = { pos: { lat: t.lat, lng: t.lng }, heading: 0 };
      }
      return acc;
    }, {})
  );

  const clustererRef = useRef(null);
  const markerByTruckIdRef = useRef(new Map());
  const [zoom, setZoom] = useState(5);

  const progressRef = useRef(
    TRUCKS.reduce((acc, t) => {
      const trip = TRIPS.find((tr) => tr.truckId === t.id);
      return { ...acc, [t.id]: (trip?.progress || 0) / 100 };
    }, {})
  );

  // Cursor along the planned route polyline (Rapido-style movement)
  // { [truckId]: { segIdx:number, segT:number } } where segT is 0..1 within segment segIdx->segIdx+1
  const routeCursorRef = useRef({});

  const tripByTruckId = useMemo(() => {
    const map = {};
    TRIPS.forEach((t) => { map[t.truckId] = t; });
    return map;
  }, []);

  const deviationToleranceMeters = 220;
  const deviationToleranceDeg = metersToDegrees(deviationToleranceMeters);
  const onRouteHysteresisMeters = 140;
  const onRouteHysteresisDeg = metersToDegrees(onRouteHysteresisMeters);

  // Animate trucks
  useEffect(() => {
    const interval = setInterval(() => {
      const newState = {};
      const pathAdds = {};
      const nextOffRoute = {};
      TRUCKS.forEach((truck) => {
        const trip = TRIPS.find((tr) => tr.truckId === truck.id);
        if (!trip) return;
        // If we have a Directions polyline for this trip, move along it.
        const plannedPathRaw = plannedOverviewPathRef.current?.[trip.id];
        const plannedPath = Array.isArray(plannedPathRaw) ? plannedPathRaw.map(routePointToLiteral).filter(Boolean) : null;

        // Default fallback (straight interpolation) if route is not ready.
        let pos = null;
        let heading = 0;

        const isMoving = truck.status === "in_transit" || truck.status === "alert";
        const speedKmph = Math.max(0, truck.speed || 0);
        const dtSec = 0.08; // matches the interval (80ms)
        const metersToAdvance = isMoving ? (speedKmph * 1000 / 3600) * dtSec * MOVEMENT_SPEED_FACTOR : 0;

        if (plannedPath && plannedPath.length >= 2 && window.google?.maps?.geometry?.spherical) {
          const cursor = routeCursorRef.current[truck.id] || { segIdx: 0, segT: Math.min(1, Math.max(0, (trip.progress || 0) / 100)) };
          let segIdx = cursor.segIdx;
          let segT = cursor.segT;

          // Clamp segIdx to valid range
          if (segIdx < 0) segIdx = 0;
          if (segIdx > plannedPath.length - 2) segIdx = plannedPath.length - 2;

          // Compute current position based on current segment
          let a = plannedPath[segIdx];
          let b = plannedPath[segIdx + 1];
          const curPos = interpolateAlongSegment(a, b, segT) || a;

          // Advance along the route by metersToAdvance
          let remaining = metersToAdvance;
          let newSegIdx = segIdx;
          let newSegT = segT;
          let lastPos = curPos;

          while (remaining > 0 && newSegIdx < plannedPath.length - 1) {
            const pA = plannedPath[newSegIdx];
            const pB = plannedPath[newSegIdx + 1];
            const segLen = distanceMeters(pA, pB) || 0;
            if (segLen <= 0.1) {
              newSegIdx += 1;
              newSegT = 0;
              continue;
            }

            const distLeftOnSeg = (1 - newSegT) * segLen;
            if (remaining < distLeftOnSeg) {
              newSegT = newSegT + (remaining / segLen);
              remaining = 0;
              lastPos = interpolateAlongSegment(pA, pB, newSegT) || pB;
              break;
            } else {
              // jump to next segment
              remaining -= distLeftOnSeg;
              newSegIdx += 1;
              newSegT = 0;
              lastPos = pB;
            }
          }

          // Loop back to start if reached end (demo)
          if (newSegIdx >= plannedPath.length - 1) {
            newSegIdx = 0;
            newSegT = 0;
            lastPos = plannedPath[0];
          }

          routeCursorRef.current[truck.id] = { segIdx: newSegIdx, segT: newSegT };
          pos = lastPos;

          // Heading uses the direction of travel (next point)
          const nextIdx = Math.min(plannedPath.length - 1, newSegIdx + 1);
          const nextPoint = plannedPath[nextIdx];
          heading = headingBetween(pos, nextPoint);
        } else {
          // fallback straight interpolation
          if (isMoving) {
            progressRef.current[truck.id] = progressRef.current[truck.id] >= 1
              ? 0
              : progressRef.current[truck.id] + 0.00025;
          }
          const p = progressRef.current[truck.id];
          const prev = interp(trip.originCoords, trip.destCoords, Math.max(0, p - 0.002));
          pos = interp(trip.originCoords, trip.destCoords, p);
          heading = bearing(prev, pos);
        }

        newState[truck.id] = { pos, heading };

        // Actual path accumulation (throttled by distance)
        const arr = actualPathRef.current?.[truck.id] || [];
        const last = arr[arr.length - 1];
        const lastLit = ensureLatLngLiteral(last);
        const dist = lastLit ? distanceMeters(lastLit, pos) : null;
        if (dist == null || dist > 18) {
          pathAdds[truck.id] = pos;
        }

        // Deviation detection vs planned route
        const planned = plannedOverviewPathRef.current?.[trip.id];
        if (planned && window.google?.maps?.geometry?.poly) {
          const ll = new window.google.maps.LatLng(pos.lat, pos.lng);
          const poly = new window.google.maps.Polyline({ path: planned });
          const internal = offRouteInternalRef.current[truck.id] || { off: false };
          const onEdge = window.google.maps.geometry.poly.isLocationOnEdge(ll, poly, deviationToleranceDeg);
          const onEdgeForClear = window.google.maps.geometry.poly.isLocationOnEdge(ll, poly, onRouteHysteresisDeg);

          if (!internal.off && !onEdge) {
            internal.off = true;
            internal.deviationStartIndex = Math.max(0, (arr.length || 1) - 1);
          } else if (internal.off && onEdgeForClear) {
            internal.off = false;
            internal.deviationStartIndex = undefined;
          }
          offRouteInternalRef.current[truck.id] = internal;
          nextOffRoute[truck.id] = internal.off;
        }
      });

      if (Object.keys(pathAdds).length) {
        setActualPathByTruckId((prev) => {
          const next = { ...prev };
          for (const [truckId, point] of Object.entries(pathAdds)) {
            const cur = next[truckId] ? [...next[truckId]] : [];
            cur.push(point);
            if (cur.length > 2200) cur.splice(0, cur.length - 2200);
            next[truckId] = cur;
          }
          actualPathRef.current = next;
          return next;
        });
      }

      if (Object.keys(nextOffRoute).length) {
        setOffRouteByTruckId((prev) => ({ ...prev, ...nextOffRoute }));
      }
      setTruckPositions((prev) => ({ ...prev, ...newState }));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Fetch driving directions ONLY for the selected trip.
  // With 2000 trucks, requesting Directions for every trip will quickly hit OVER_QUERY_LIMIT.
  useEffect(() => {
    if (!isLoaded) return;
    if (!selectedTruck) return;
    const trip = tripByTruckId[selectedTruck.id];
    if (!trip || trip.status === "delivered") return;

    // If we already have an overview path, do not refetch.
    if (plannedOverviewPathRef.current?.[trip.id]) return;

    new window.google.maps.DirectionsService().route(
      {
        origin: trip.originCoords,
        destination: trip.destCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections({ [trip.id]: result });
          const overview = extractOverviewPath(result);
          if (overview) plannedOverviewPathRef.current[trip.id] = overview;
        }
      }
    );
  }, [isLoaded, selectedTruck, tripByTruckId]);

  const requestReroute = useCallback((truckId) => {
    if (!isLoaded) return;
    const trip = tripByTruckId[truckId];
    if (!trip) return;
    const posState = truckPositions[truckId];
    const origin = posState?.pos || trip.originCoords;
    new window.google.maps.DirectionsService().route(
      {
        origin,
        destination: trip.destCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === "OK") setSuggestedDirections((p) => ({ ...p, [trip.id]: result }));
      }
    );
  }, [isLoaded, tripByTruckId, truckPositions]);

  const applySuggestedRoute = useCallback((truckId) => {
    const trip = tripByTruckId[truckId];
    if (!trip) return;
    const sug = suggestedDirections[trip.id];
    if (!sug) return;
    setDirections((p) => ({ ...p, [trip.id]: sug }));
    const overview = extractOverviewPath(sug);
    if (overview) plannedOverviewPathRef.current[trip.id] = overview;
    setSuggestedDirections((p) => {
      const next = { ...p };
      delete next[trip.id];
      return next;
    });
  }, [tripByTruckId, suggestedDirections]);

  const onMapLoad = useCallback((map) => {
    setMapRef(map);
    const bounds = new window.google.maps.LatLngBounds(
      { lat: 8.0, lng: 68.0 },
      { lat: 37.0, lng: 97.0 }
    );
    map.fitBounds(bounds);

    // init clusterer once
    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({
        map,
        renderer: createClusterRenderer(),
      });
    } else {
      clustererRef.current.setMap(map);
    }

    setZoom(map.getZoom?.() ?? 5);
  }, []);

  const selectedTrip = selectedTruck ? TRIPS.find((t) => t.truckId === selectedTruck.id) : null;
  const showRouteGuides = showFleetRouteGuides && (zoom ?? 5) < 11;
  const showClusterMarkers = !showOnlySelectedTruck && (zoom ?? 5) < 12;
  const showFleetOverlays = !showOnlySelectedTruck && !showClusterMarkers;

  // Keep clustered markers in sync with truck positions (for large fleets)
  useEffect(() => {
    if (!mapRef || !clustererRef.current || !window.google?.maps) return;

    const clusterer = clustererRef.current;
    const markerMap = markerByTruckIdRef.current;

    if (!showClusterMarkers) {
      // Clear markers when zoomed in; selected truck uses OverlayView marker
      if (markerMap.size) {
        clusterer.clearMarkers(true);
        for (const entry of markerMap.values()) {
          if (entry.listener?.remove) entry.listener.remove();
          if (entry.root) entry.root.unmount();
          if (entry.marker) {
            if (entry.isAdvanced) entry.marker.map = null;
            else entry.marker.setMap(null);
          }
        }
        markerMap.clear();
        clusterer.render();
      }
      return;
    }

    const markersToRemove = [];

    for (const [id, entry] of Array.from(markerMap.entries())) {
      const truckExists = TRUCKS.some((truck) => truck.id === id);
      const isSelectedTruck = selectedTruck?.id === id;

      if (!truckExists || isSelectedTruck) {
        if (entry.listener?.remove) entry.listener.remove();
        if (entry.root) entry.root.unmount();
        if (entry.marker) {
          if (entry.isAdvanced) entry.marker.map = null;
          else entry.marker.setMap(null);
        }
        markerMap.delete(id);
        markersToRemove.push(entry.marker);
      }
    }

    if (markersToRemove.length) clusterer.removeMarkers(markersToRemove, true);

    const markersToAdd = [];

    for (const truck of TRUCKS) {
      const state = truckPositions[truck.id];
      if (!state) continue;

      // Keep selected truck as OverlayView (animated), skip in cluster
      if (selectedTruck?.id === truck.id) continue;

      let entry = markerMap.get(truck.id);
      const AdvancedMarkerElement = GOOGLE_MAPS_MAP_ID
        ? window.google.maps.marker?.AdvancedMarkerElement
        : null;

      if (!entry) {
        if (AdvancedMarkerElement) {
          const content = document.createElement("div");
          content.style.width = "46px";
          content.style.height = "46px";
          content.style.display = "flex";
          content.style.alignItems = "center";
          content.style.justifyContent = "center";

          const root = createRoot(content);
          renderTruckMarkerRoot(root, { rotationDeg: state.heading, size: 46 });

          const marker = new AdvancedMarkerElement({
            position: state.pos,
            content,
            gmpClickable: true,
            title: truck.id,
          });

          const listener = marker.addListener("gmp-click", () => {
            const currentPos = marker.position;
            const panTarget = currentPos && typeof currentPos.lat === "function"
              ? { lat: currentPos.lat(), lng: currentPos.lng() }
              : currentPos;
            onSelectTruck(truck);
            if (panTarget) mapRef.panTo(panTarget);
            mapRef.setZoom(Math.max(12, mapRef.getZoom?.() ?? 12));
          });

          entry = { marker, root, listener, isAdvanced: true };
        } else {
          const marker = new window.google.maps.Marker({
            position: state.pos,
            title: truck.id,
            icon: getFallbackTruckMarkerIcon({ rotationDeg: state.heading, size: 44 }),
          });

          const listener = marker.addListener("click", () => {
            const currentPos = marker.getPosition?.();
            const panTarget = currentPos?.toJSON?.() || state.pos;
            onSelectTruck(truck);
            if (panTarget) mapRef.panTo(panTarget);
            mapRef.setZoom(Math.max(12, mapRef.getZoom?.() ?? 12));
          });

          entry = { marker, listener, isAdvanced: false };
        }

        markerMap.set(truck.id, entry);
        markersToAdd.push(entry.marker);
      } else if (entry.isAdvanced) {
        entry.marker.position = state.pos;
        renderTruckMarkerRoot(entry.root, { rotationDeg: state.heading, size: 46 });
      } else {
        entry.marker.setPosition(state.pos);
        entry.marker.setIcon(getFallbackTruckMarkerIcon({ rotationDeg: state.heading, size: 44 }));
      }
    }

    if (markersToAdd.length) clusterer.addMarkers(markersToAdd, true);

    clusterer.render();
  }, [mapRef, showClusterMarkers, truckPositions, selectedTruck, onSelectTruck]);

  if (gmapsKeyMissing) return (
    <div style={{ width: "100%", height: "100%", background: "#F4F6FB", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, color: "#111827", padding: 16, textAlign: "center" }}>
      <div style={{ fontSize: 28 }}>🗝️</div>
      <div style={{ fontSize: 14, fontWeight: 800 }}>Google Maps API key is missing</div>
      <div style={{ fontSize: 12, color: "#6B7280", maxWidth: 520 }}>
        Create a <code style={{ background: "#EEF2FF", padding: "1px 6px", borderRadius: 6 }}>.env</code> file and set{" "}
        <code style={{ background: "#EEF2FF", padding: "1px 6px", borderRadius: 6 }}>VITE_GOOGLE_MAPS_API_KEY</code>.
      </div>
    </div>
  );

  if (loadError) return (
    <div style={{ width: "100%", height: "100%", background: "#F4F6FB", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, color: "#DC2626" }}>
      <span style={{ fontSize: 28 }}>⚠️</span>
      <span style={{ fontSize: 14, fontWeight: 600 }}>Google Maps failed to load</span>
      <span style={{ fontSize: 12, color: "#9CA3AF" }}>{loadError.message}</span>
    </div>
  );

  if (!isLoaded) return (
    <div style={{ width: "100%", height: "100%", background: "#F4F6FB", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#9CA3AF" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #E9EDF5", borderTop: "3px solid #2563EB", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <span style={{ fontSize: 13 }}>Loading Google Maps...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", borderRadius: 16, overflow: "hidden" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%", borderRadius: 16 }}
        options={MAP_OPTIONS}
        onLoad={onMapLoad}
        onZoomChanged={() => setZoom(mapRef?.getZoom?.() ?? zoom)}
      >
        {/* Fleet dotted route guides */}
        {showRouteGuides && TRUCKS.map((truck) => {
          const trip = tripByTruckId[truck.id];
          const state = truckPositions[truck.id];
          if (!trip || !state || trip.status === "delivered" || selectedTruck?.id === truck.id) return null;

          const color = STATUS_COLORS[truck.status] || "#2563EB";
          return (
            <Polyline
              key={`guide_${truck.id}`}
              path={[trip.originCoords, trip.destCoords]}
              options={{
                clickable: false,
                geodesic: true,
                strokeOpacity: 0,
                strokeWeight: 2,
                zIndex: 0,
                icons: [
                  {
                    icon: {
                      path: "M 0,-1 0,1",
                      strokeOpacity: 0.28,
                      strokeColor: color,
                      scale: 2,
                    },
                    offset: "0",
                    repeat: "10px",
                  },
                  {
                    icon: {
                      path: window.google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                      scale: 2.2,
                      strokeColor: color,
                      strokeOpacity: 0.55,
                    },
                    offset: "100%",
                  },
                ],
              }}
            />
          );
        })}

        {/* Route polylines from Directions API */}
        {Object.entries(directions).map(([tripId, dir]) => {
          const trip  = TRIPS.find((t) => t.id === tripId);
          const truck = TRUCKS.find((t) => t.id === trip?.truckId);
          const color = STATUS_COLORS[truck?.status] || "#2563EB";
          return (
            <DirectionsRenderer
              key={tripId}
              directions={dir}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: color,
                  strokeOpacity: 0.75,
                  strokeWeight: 5,
                  icons: [{
                    icon: {
                      path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                      scale: 3, fillColor: color, fillOpacity: 1, strokeWeight: 0,
                    },
                    offset: "50%", repeat: "100px",
                  }],
                },
              }}
            />
          );
        })}

        {/* Actual traveled path + deviation segment (selected truck only for performance) */}
        {selectedTruck && (() => {
          const truckId = selectedTruck.id;
          const trip = tripByTruckId[truckId];
          const path = actualPathByTruckId[truckId];
          if (!trip || trip.status === "delivered" || !Array.isArray(path)) return null;
          const internal = offRouteInternalRef.current[truckId];
          const off = offRouteByTruckId[truckId];
          const devStart = internal?.deviationStartIndex;
          const safePath = path;
          const deviationPath = (off && typeof devStart === "number" && devStart >= 0)
            ? safePath.slice(devStart)
            : null;

          return (
            <span key={`paths_${truckId}`}>
              <Polyline
                path={safePath}
                options={{
                  strokeColor: "#64748B",
                  strokeOpacity: 0.5,
                  strokeWeight: 3,
                  clickable: false,
                  zIndex: 1,
                }}
              />
              {deviationPath && deviationPath.length >= 2 && (
                <Polyline
                  path={deviationPath}
                  options={{
                    strokeColor: "#DC2626",
                    strokeOpacity: 0.9,
                    strokeWeight: 5,
                    clickable: false,
                    zIndex: 3,
                  }}
                />
              )}
            </span>
          );
        })()}

        {/* Suggested reroute overlay */}
        {Object.entries(suggestedDirections).map(([tripId, dir]) => (
          <DirectionsRenderer
            key={`sug_${tripId}`}
            directions={dir}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#7C3AED",
                strokeOpacity: 0.0,
                strokeWeight: 6,
                icons: [{
                  icon: {
                    path: "M 0,-1 0,1",
                    strokeOpacity: 1,
                    strokeColor: "#7C3AED",
                    scale: 3,
                  },
                  offset: "0",
                  repeat: "16px",
                }],
              },
            }}
          />
        ))}

        {/* Origin / destination pins (selected trip only for performance) */}
        {selectedTrip && selectedTrip.status !== "delivered" && (
          <span key={selectedTrip.id}>
            <RoutePin position={selectedTrip.originCoords} label={selectedTrip.origin.split(",")[0]} color="#16A34A" isOrigin />
            <RoutePin position={selectedTrip.destCoords}   label={selectedTrip.destination.split(",")[0]} color={STATUS_COLORS[selectedTruck?.status] || "#2563EB"} isOrigin={false} />
          </span>
        )}

        {/* Zoomed-in view: render each truck directly so all headings stay aligned. */}
        {showFleetOverlays && TRUCKS.map((truck) => {
          const state = truckPositions[truck.id];
          if (!state) return null;
          return (
            <TruckMarker
              key={truck.id}
              truck={truck}
              position={state.pos}
              rotation={state.heading}
              isSelected={selectedTruck?.id === truck.id}
              onClick={(t) => onSelectTruck(t)}
            />
          );
        })}

        {/* Selected truck marker when fleet overlays are not active. */}
        {!showFleetOverlays && selectedTruck && truckPositions[selectedTruck.id] && (
          <TruckMarker
            key={selectedTruck.id}
            truck={selectedTruck}
            position={truckPositions[selectedTruck.id].pos}
            rotation={truckPositions[selectedTruck.id].heading}
            isSelected
            onClick={(t) => onSelectTruck(t)}
          />
        )}
      </GoogleMap>

      {/* Top-left: Fleet legend */}
      <div style={{
        position: "absolute", top: 12, left: 12,
        background: "#FFFFFF", border: "1px solid #E9EDF5",
        borderRadius: 12, padding: "10px 14px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)", zIndex: 10,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A", display: "inline-block", boxShadow: "0 0 0 2px #BBF7D0" }} />
          <span style={{ color: "#16A34A", fontSize: 11, fontWeight: 700 }}>LIVE</span>
        </div>
        <div style={{ width: 1, height: 14, background: "#E9EDF5" }} />
        {Object.entries(STATUS_LABELS).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: STATUS_COLORS[k] }} />
            <span style={{ color: "#6B7280", fontSize: 11 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Selected truck info card */}
      {selectedTruck && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {offRouteByTruckId[selectedTruck.id] && (
            <div style={{
              position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
              background: "#FEF2F2", border: "1px solid #FECACA",
              color: "#991B1B", fontWeight: 800, fontSize: 12,
              padding: "8px 12px", borderRadius: 999,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              pointerEvents: "auto",
              display: "flex", alignItems: "center", gap: 10,
              zIndex: 60,
            }}>
              <span>⛔ Off route</span>
              <button
                onClick={() => requestReroute(selectedTruck.id)}
                style={{
                  background: "#DC2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                Suggest reroute
              </button>
              {suggestedDirections[selectedTrip?.id] && (
                <button
                  onClick={() => applySuggestedRoute(selectedTruck.id)}
                  style={{
                    background: "#7C3AED",
                    color: "#fff",
                    border: "none",
                    borderRadius: 999,
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  Apply
                </button>
              )}
            </div>
          )}
          <div style={{ pointerEvents: "auto" }}>
            <TruckInfoCard truck={selectedTruck} trip={selectedTrip} onClose={() => onSelectTruck(null)} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes alertPulse {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0; }
        }
        @keyframes truck-wheel-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
