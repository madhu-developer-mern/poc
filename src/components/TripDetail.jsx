import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  GoogleMap, useJsApiLoader, DirectionsRenderer, OverlayView,
} from "@react-google-maps/api";
import {
  ArrowLeft, MapPin, Clock, Package, Thermometer, Droplets,
  Gauge, Zap, Wind, Activity, AlertTriangle, CheckCircle, Truck,
  Navigation, Phone, User, ChevronRight,
} from "lucide-react";
import { TRUCKS, TRIPS, ALERTS } from "../data/mockData";
import { GOOGLE_MAPS_LOADER_OPTIONS } from "../lib/googleMaps";

const STATUS_CFG = {
  in_transit: { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", label: "In Transit"  },
  loading:    { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", label: "Loading"     },
  delivered:  { color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", label: "Delivered"   },
  alert:      { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", label: "Alert"       },
};

// Ola/Uber light map style
const OLA_MAP_STYLE = [
  { featureType: "poi",          stylers: [{ visibility: "off" }] },
  { featureType: "poi.park",     elementType: "geometry",          stylers: [{ color: "#E8F5E9" }] },
  { featureType: "water",        elementType: "geometry",          stylers: [{ color: "#C8DCF0" }] },
  { featureType: "landscape",    elementType: "geometry",          stylers: [{ color: "#F5F5F0" }] },
  { featureType: "road",         elementType: "geometry",          stylers: [{ color: "#FFFFFF" }] },
  { featureType: "road",         elementType: "geometry.stroke",   stylers: [{ color: "#E0E0E0" }] },
  { featureType: "road.highway", elementType: "geometry",          stylers: [{ color: "#FFF3E0" }] },
  { featureType: "road.highway", elementType: "geometry.stroke",   stylers: [{ color: "#FFB74D" }] },
  { featureType: "road.highway", elementType: "labels.text.fill",  stylers: [{ color: "#E65100" }] },
  { featureType: "road",         elementType: "labels.text.fill",  stylers: [{ color: "#9E9E9E" }] },
  { featureType: "transit",      stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#555555" }] },
];

function interp(from, to, p) {
  return { lat: from.lat + (to.lat - from.lat) * p, lng: from.lng + (to.lng - from.lng) * p };
}
function bearing(from, to) {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// Realistic truck SVG top-down view
function TruckSVG({ color, size = 36 }) {
  return (
    <svg width={size} height={size * 1.8} viewBox="0 0 44 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="22" cy="72" rx="10" ry="4" fill="rgba(0,0,0,0.12)" />
      <rect x="7" y="10" width="30" height="52" rx="6" fill={color} />
      <rect x="9" y="8" width="26" height="16" rx="5" fill={color} />
      <rect x="12" y="10" width="20" height="10" rx="3" fill="rgba(255,255,255,0.55)" />
      <rect x="10" y="26" width="24" height="30" rx="3" fill={color} opacity="0.82" />
      <line x1="10" y1="33" x2="34" y2="33" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <line x1="10" y1="40" x2="34" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <line x1="10" y1="47" x2="34" y2="47" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <rect x="3"  y="12" width="6" height="10" rx="2" fill="#222" />
      <rect x="35" y="12" width="6" height="10" rx="2" fill="#222" />
      <rect x="3"  y="48" width="6" height="10" rx="2" fill="#222" />
      <rect x="35" y="48" width="6" height="10" rx="2" fill="#222" />
      <rect x="11" y="8"  width="6" height="3" rx="1.5" fill="#FFFDE7" opacity="0.9" />
      <rect x="27" y="8"  width="6" height="3" rx="1.5" fill="#FFFDE7" opacity="0.9" />
      <rect x="11" y="58" width="6" height="3" rx="1.5" fill="#FF5252" opacity="0.9" />
      <rect x="27" y="58" width="6" height="3" rx="1.5" fill="#FF5252" opacity="0.9" />
      <rect x="20" y="27" width="4" height="28" rx="2" fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}

// Animated truck overlay on the real Google Map
function AnimatedTruck({ trip, truck, color }) {
  const progressRef = useRef(trip.progress / 100);
  const [state, setState] = useState(() => {
    const p   = trip.progress / 100;
    const pos = interp(trip.originCoords, trip.destCoords, p);
    const prev = interp(trip.originCoords, trip.destCoords, Math.max(0, p - 0.002));
    return { pos, heading: bearing(prev, pos) };
  });

  useEffect(() => {
    if (truck.status !== "in_transit" && truck.status !== "alert") return;
    const interval = setInterval(() => {
      progressRef.current = progressRef.current >= 1 ? 0 : progressRef.current + 0.0007;
      const p    = progressRef.current;
      const prev = interp(trip.originCoords, trip.destCoords, Math.max(0, p - 0.002));
      const pos  = interp(trip.originCoords, trip.destCoords, p);
      setState({ pos, heading: bearing(prev, pos) });
    }, 80);
    return () => clearInterval(interval);
  }, [trip, truck.status]);

  return (
    <OverlayView position={state.pos} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div style={{ transform: "translate(-50%,-50%)", position: "relative" }}>
        {truck.status === "alert" && (
          <div style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            border: `2px solid ${color}`,
            animation: "alertPulse 1.4s ease-out infinite",
            pointerEvents: "none",
          }} />
        )}
        <div style={{ transform: `rotate(${state.heading}deg)`, transformOrigin: "center" }}>
          <TruckSVG color={color} size={34} />
        </div>
        {/* Speed badge */}
        {truck.speed > 0 && (
          <div style={{
            position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)",
            background: "#FFFFFF", border: `1px solid ${color}`,
            borderRadius: 20, padding: "1px 7px",
            color, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}>{truck.speed} km/h</div>
        )}
      </div>
    </OverlayView>
  );
}

// Pin for origin / destination
function RoutePin({ position, label, isOrigin }) {
  const color = isOrigin ? "#16A34A" : "#2563EB";
  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_LAYER}>
      <div style={{ transform: "translate(-50%,-100%)", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
        <div style={{
          background: "#FFFFFF", border: `1.5px solid ${color}`,
          borderRadius: 8, padding: "3px 10px",
          color: "#111827", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}>
          <span style={{ color }}>{isOrigin ? "📦" : "🏁"}</span> {label}
        </div>
        <div style={{ width: 2, height: 8, background: color }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
      </div>
    </OverlayView>
  );
}

// IoT metric chip
function MetricChip({ icon: Icon, label, value, alert, warn }) {
  return (
    <div style={{
      background: alert ? "#FEF2F2" : warn ? "#FFFBEB" : "#F8FAFC",
      border: `1px solid ${alert ? "#FECACA" : warn ? "#FDE68A" : "#F1F5F9"}`,
      borderRadius: 10, padding: "10px 12px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <Icon size={13} color={alert ? "#DC2626" : warn ? "#D97706" : "#6B7280"} />
        <span style={{ color: "#9CA3AF", fontSize: 11 }}>{label}</span>
        {alert && <span style={{ marginLeft: "auto", color: "#DC2626", fontSize: 10, fontWeight: 700 }}>⚠ BREACH</span>}
      </div>
      <div style={{ color: alert ? "#DC2626" : warn ? "#D97706" : "#111827", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

export default function TripDetail({ trip: tripSummary, onBack }) {
  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);

  const trip = useMemo(() => {
    if (!tripSummary) return null;
    if (tripSummary.originCoords && tripSummary.destCoords) return tripSummary;
    return TRIPS.find((t) => t.id === tripSummary.id)
      || TRIPS.find((t) => t.truckId === tripSummary.truckId)
      || tripSummary;
  }, [tripSummary]);

  if (!trip) return null;

  const hasRouteCoords = Boolean(trip.originCoords && trip.destCoords);
  const truck        = TRUCKS.find((t) => t.id === trip.truckId);
  const cfg          = STATUS_CFG[trip.status] || STATUS_CFG.in_transit;
  const tripAlerts   = ALERTS.filter((a) => a.tripId === trip.id && !a.acknowledged);
  const isActive     = trip.status === "in_transit" || trip.status === "alert";

  const [direction, setDirection] = useState(null);
  const [mapRef, setMapRef]       = useState(null);

  const eta   = new Date(trip.eta).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const start = new Date(trip.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    if (!isLoaded || !hasRouteCoords) return;
    new window.google.maps.DirectionsService().route(
      {
        origin: trip.originCoords,
        destination: trip.destCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") setDirection(result);
      }
    );
  }, [hasRouteCoords, isLoaded, trip]);

  const onMapLoad = useCallback((map) => {
    setMapRef(map);
    if (!hasRouteCoords) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(trip.originCoords);
    bounds.extend(trip.destCoords);
    map.fitBounds(bounds, { top: 80, bottom: 80, left: 80, right: 80 });
  }, [hasRouteCoords, trip]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "#F4F6FB",
      display: "flex", flexDirection: "column",
    }}>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E9EDF5",
        padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 14,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        zIndex: 10, flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "#F4F6FB", border: "1px solid #E9EDF5",
            borderRadius: 9, padding: "8px 14px",
            color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >
          <ArrowLeft size={15} /> Back to Trips
        </button>

        {/* Trip ID + status */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#111827", fontWeight: 800, fontSize: 17 }}>{trip.id}</span>
          <span style={{
            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
            borderRadius: 20, padding: "3px 11px", fontSize: 12, fontWeight: 700,
          }}>{cfg.label}</span>
          {trip.goods.some((g) => g.tempSensitive) && (
            <span style={{
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 20, padding: "3px 11px", color: "#DC2626", fontSize: 12, fontWeight: 600,
            }}>🌡️ Cold Chain</span>
          )}
        </div>

        {/* Live badge */}
        {isActive && (
          <div style={{
            marginLeft: "auto",
            display: "flex", alignItems: "center", gap: 6,
            background: "#F0FDF4", border: "1px solid #BBF7D0",
            borderRadius: 20, padding: "6px 13px",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />
            <span style={{ color: "#16A34A", fontSize: 12, fontWeight: 700 }}>LIVE TRACKING</span>
          </div>
        )}
      </div>

      {/* ── Body: Map (left) + Panel (right) ──────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── MAP ──────────────────────────────────────────────── */}
        <div style={{ flex: 1, position: "relative" }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{ styles: OLA_MAP_STYLE, disableDefaultUI: false, zoomControl: true, mapTypeControl: false, streetViewControl: false, fullscreenControl: false, clickableIcons: false }}
              onLoad={onMapLoad}
            >
              {/* Driving route */}
              {direction && (
                <DirectionsRenderer
                  directions={direction}
                  options={{
                    suppressMarkers: true,
                    polylineOptions: {
                      strokeColor: cfg.color,
                      strokeOpacity: 0.8,
                      strokeWeight: 6,
                      icons: [{
                        icon: { path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3.5, fillColor: cfg.color, fillOpacity: 1, strokeWeight: 0 },
                        offset: "50%", repeat: "100px",
                      }],
                    },
                  }}
                />
              )}

              {/* Origin / destination pins */}
              {hasRouteCoords && (
                <>
                  <RoutePin position={trip.originCoords} label={trip.origin.split(",")[0]} isOrigin />
                  <RoutePin position={trip.destCoords}   label={trip.destination.split(",")[0]} isOrigin={false} />
                </>
              )}

              {/* Animated truck */}
              {hasRouteCoords && truck && <AnimatedTruck trip={trip} truck={truck} color={cfg.color} />}
            </GoogleMap>
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#F4F6FB", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#9CA3AF" }}>
              <div style={{ width: 36, height: 36, border: "3px solid #E9EDF5", borderTop: `3px solid ${cfg.color}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span>Loading map...</span>
            </div>
          )}

          {/* Map progress overlay (bottom) */}
          {isActive && (
            <div style={{
              position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #E9EDF5",
              borderRadius: 14, padding: "12px 20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              minWidth: 320,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#6B7280", fontSize: 12 }}>Route progress</span>
                <span style={{ color: "#111827", fontWeight: 700, fontSize: 12 }}>{trip.progress}% · {trip.distance} km</span>
              </div>
              <div style={{ background: "#F1F5F9", borderRadius: 4, height: 7 }}>
                <div style={{
                  width: `${trip.progress}%`, height: "100%", borderRadius: 4,
                  background: trip.status === "alert"
                    ? "linear-gradient(90deg,#F59E0B,#DC2626)"
                    : "linear-gradient(90deg,#2563EB,#7C3AED)",
                  transition: "width 0.5s",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ color: "#9CA3AF", fontSize: 11 }}>{trip.origin.split(",")[0]}</span>
                <span style={{ color: "#9CA3AF", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={11} /> ETA <strong style={{ color: "#111827" }}>{eta}</strong>
                </span>
                <span style={{ color: "#9CA3AF", fontSize: 11 }}>{trip.destination.split(",")[0]}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── SIDE PANEL ───────────────────────────────────────── */}
        <div style={{
          width: 380, background: "#F4F6FB",
          borderLeft: "1px solid #E9EDF5",
          overflow: "auto", flexShrink: 0,
          display: "flex", flexDirection: "column", gap: 12,
          padding: 16,
        }}>

          {/* Alert banner */}
          {tripAlerts.length > 0 && (
            <div style={{
              background: "#FEF2F2", border: "1.5px solid #FECACA",
              borderRadius: 12, padding: "12px 14px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                <AlertTriangle size={14} color="#DC2626" />
                <span style={{ color: "#DC2626", fontWeight: 700, fontSize: 13 }}>Active Alerts</span>
              </div>
              {tripAlerts.map((a) => (
                <div key={a.id} style={{ color: "#6B7280", fontSize: 12, marginBottom: 4, lineHeight: 1.4 }}>
                  • {a.message}
                </div>
              ))}
            </div>
          )}

          {/* Driver card */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E9EDF5", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Driver & Vehicle</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${cfg.color}30,${cfg.color}60)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <User size={20} color={cfg.color} />
              </div>
              <div>
                <div style={{ color: "#111827", fontWeight: 700, fontSize: 14 }}>{truck?.driver}</div>
                <div style={{ color: "#9CA3AF", fontSize: 12 }}>{truck?.vehicle}</div>
              </div>
              <a href={`tel:${truck?.phone}`} style={{
                marginLeft: "auto", background: "#F0FDF4", border: "1px solid #BBF7D0",
                borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 5,
                color: "#16A34A", fontSize: 12, fontWeight: 600, textDecoration: "none",
              }}>
                <Phone size={12} /> Call
              </a>
            </div>
            <div style={{ background: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: 8, padding: "8px 12px" }}>
              <span style={{ color: "#9CA3AF", fontSize: 11 }}>Vehicle ID: </span>
              <span style={{ color: "#374151", fontSize: 12, fontWeight: 600 }}>{trip.truckId}</span>
            </div>
          </div>

          {/* Route card */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E9EDF5", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Route</div>
            <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
              {/* Timeline line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16A34A", border: "2px solid #fff", boxShadow: "0 0 0 2px #16A34A" }} />
                <div style={{ flex: 1, width: 2, background: "linear-gradient(#16A34A,#2563EB)", margin: "4px 0", minHeight: 28 }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563EB", border: "2px solid #fff", boxShadow: "0 0 0 2px #2563EB" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: "#9CA3AF", fontSize: 10, textTransform: "uppercase" }}>From</div>
                  <div style={{ color: "#111827", fontWeight: 600, fontSize: 13, marginTop: 1 }}>{trip.origin}</div>
                  <div style={{ color: "#9CA3AF", fontSize: 11, marginTop: 2 }}>Started {start}</div>
                </div>
                <div>
                  <div style={{ color: "#9CA3AF", fontSize: 10, textTransform: "uppercase" }}>To</div>
                  <div style={{ color: "#111827", fontWeight: 600, fontSize: 13, marginTop: 1 }}>{trip.destination}</div>
                  <div style={{ color: "#9CA3AF", fontSize: 11, marginTop: 2 }}>ETA <strong style={{ color: "#111827" }}>{eta}</strong></div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[
                { label: "Distance", value: `${trip.distance} km`, icon: Navigation },
                { label: "Progress", value: `${trip.progress}%`,  icon: Activity   },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} style={{ flex: 1, background: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={14} color="#9CA3AF" />
                  <div>
                    <div style={{ color: "#9CA3AF", fontSize: 10 }}>{label}</div>
                    <div style={{ color: "#111827", fontWeight: 700, fontSize: 13 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IoT live sensors */}
          {truck && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E9EDF5", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <Activity size={13} color="#2563EB" />
                <span style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Live IoT Sensors</span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />
                  <span style={{ color: "#16A34A", fontSize: 10, fontWeight: 600 }}>Live</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <MetricChip icon={Thermometer} label="Cargo Temp"  value={`${truck.temp}°C`}       alert={truck.temp > 8} />
                <MetricChip icon={Droplets}   label="Humidity"     value={`${truck.humidity}%`}     warn={truck.humidity > 80} />
                <MetricChip icon={Gauge}      label="Speed"        value={`${truck.speed} km/h`} />
                <MetricChip icon={Zap}        label="Fuel"         value={`${truck.fuel}%`}         warn={truck.fuel < 30} />
                <MetricChip icon={Wind}       label="Engine Temp"  value={`${truck.engineTemp}°C`}  warn={truck.engineTemp > 95} />
                <MetricChip icon={Activity}   label="Battery"      value={`${truck.batteryVoltage}V`} warn={truck.batteryVoltage < 12} />
              </div>
            </div>
          )}

          {/* Goods */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E9EDF5", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Package size={13} color="#7C3AED" />
              <span style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Cargo ({trip.goods.length} items)</span>
            </div>
            {trip.goods.map((good, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 12px",
                background: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: 9,
                marginBottom: i < trip.goods.length - 1 ? 8 : 0,
              }}>
                <div>
                  <div style={{ color: "#111827", fontWeight: 600, fontSize: 13 }}>{good.name}</div>
                  <div style={{ color: "#9CA3AF", fontSize: 11, marginTop: 1 }}>{good.qty} · {good.weight}</div>
                </div>
                {good.tempSensitive && (
                  <span style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, padding: "2px 7px", color: "#DC2626", fontSize: 10, fontWeight: 600 }}>🌡️</span>
                )}
              </div>
            ))}
          </div>

          {/* Timeline events */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E9EDF5", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Timeline</div>
            {[
              { time: start,        label: "Trip started",          color: "#16A34A", done: true  },
              { time: "En route",   label: `${trip.progress}% complete – ${trip.distance} km`,  color: "#2563EB", done: isActive },
              { time: eta,          label: "Estimated arrival",     color: "#9CA3AF", done: false },
            ].map((ev, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < 2 ? 12 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.done ? ev.color : "#E9EDF5", border: `2px solid ${ev.done ? ev.color : "#D1D5DB"}`, flexShrink: 0, marginTop: 2 }} />
                  {i < 2 && <div style={{ width: 1.5, height: 20, background: ev.done ? ev.color : "#E9EDF5", marginTop: 2 }} />}
                </div>
                <div>
                  <div style={{ color: ev.done ? "#111827" : "#9CA3AF", fontWeight: 600, fontSize: 12 }}>{ev.label}</div>
                  <div style={{ color: "#9CA3AF", fontSize: 11 }}>{ev.time}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes alertPulse {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
