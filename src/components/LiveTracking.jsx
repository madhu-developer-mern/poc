import { useEffect, useMemo, useState } from "react";
import TruckMap from "./TruckMap";
import { TRUCKS, TRIPS } from "../data/mockData";
import { Truck, Thermometer, Gauge, Zap, Droplets, Phone, Maximize2, Minimize2, Clock } from "lucide-react";

const STATUS_COLORS = {
  in_transit: "#2563EB",
  loading:    "#D97706",
  delivered:  "#16A34A",
  alert:      "#DC2626",
};

const STATUS_BG = {
  in_transit: "#EFF6FF",
  loading:    "#FFFBEB",
  delivered:  "#F0FDF4",
  alert:      "#FEF2F2",
};

const STATUS_LABELS = {
  in_transit: "In Transit",
  loading:    "Loading",
  delivered:  "Delivered",
  alert:      "Alert",
};

export default function LiveTracking() {
  const [selectedTruck, setSelectedTruck] = useState(() => {
    if (typeof window !== "undefined" && window.__TRACKING_SELECTED_TRUCK_ID) {
      const t = TRUCKS.find((x) => x.id === window.__TRACKING_SELECTED_TRUCK_ID);
      if (t) return t;
    }
    return TRUCKS[0];
  });
  const [fullScreen, setFullScreen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  const trip = TRIPS.find((t) => t.truckId === selectedTruck?.id);
  const etaText = useMemo(() => {
    if (!trip) return null;
    const eta = new Date(trip.eta);
    const now = new Date();
    const diff = Math.max(0, eta.getTime() - now.getTime());
    const mins = Math.round(diff / 60000);
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  }, [trip]);

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 980);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div style={{
      padding: fullScreen ? 0 : "20px 24px 24px",
      height: fullScreen ? "calc(100vh - 0px)" : "calc(100vh - 120px)",
      display: "flex",
      flexDirection: "column",
      gap: 16,
    }}>
      <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0 }}>
        {/* Map */}
        <div style={{
          flex: 1, minHeight: 0, borderRadius: 16, overflow: "hidden",
          border: "1px solid #E9EDF5",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          position: "relative",
          ...(fullScreen ? { borderRadius: 0, border: "none", boxShadow: "none" } : {}),
        }}>
          {/* Full-screen toggle */}
          <button
            onClick={() => setFullScreen((v) => !v)}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 20,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #E9EDF5",
              borderRadius: 12,
              padding: "8px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
              color: "#111827",
              fontWeight: 700,
              fontSize: 12,
              backdropFilter: "blur(8px)",
            }}
          >
            {fullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {fullScreen ? "Exit" : "Full screen"}
          </button>

          {/* Live ETA chip */}
          {trip && (
            <div style={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 20,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #E9EDF5",
              borderRadius: 999,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
              backdropFilter: "blur(8px)",
            }}>
              <Clock size={14} color="#2563EB" />
              <span style={{ color: "#111827", fontWeight: 800, fontSize: 12 }}>
                ETA {etaText || "—"}
              </span>
              <span style={{ color: "#6B7280", fontSize: 12 }}>
                · {selectedTruck.speed} km/h
              </span>
            </div>
          )}
          <TruckMap selectedTruck={selectedTruck} onSelectTruck={setSelectedTruck} />
        </div>

        {/* Side panel */}
        {!fullScreen && !isNarrow && (
          <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 12, overflow: "auto" }}>

          {/* Truck selector */}
          <div style={{
            background: "#FFFFFF", border: "1px solid #E9EDF5",
            borderRadius: 14, padding: 14,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              Select Truck
            </div>
            {TRUCKS.map((t) => {
              const isSelected = selectedTruck?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTruck(t)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 10px",
                    background: isSelected ? STATUS_BG[t.status] : "transparent",
                    border: isSelected ? `1px solid ${STATUS_COLORS[t.status]}40` : "1px solid transparent",
                    borderRadius: 10, cursor: "pointer", marginBottom: 4, textAlign: "left",
                    transition: "all 0.13s",
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                    background: STATUS_COLORS[t.status],
                    boxShadow: t.status === "alert" ? `0 0 0 3px ${STATUS_COLORS.alert}30` : "none",
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#111827", fontSize: 13, fontWeight: 600 }}>{t.id}</div>
                    <div style={{ color: "#9CA3AF", fontSize: 11 }}>{t.driver}</div>
                  </div>
                  <span style={{
                    color: STATUS_COLORS[t.status], fontSize: 10, fontWeight: 600,
                    background: STATUS_BG[t.status], borderRadius: 4, padding: "2px 6px",
                  }}>
                    {STATUS_LABELS[t.status]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected truck details */}
          {selectedTruck && (
            <>
              <div style={{
                background: "#FFFFFF",
                border: `1px solid ${STATUS_COLORS[selectedTruck.status]}40`,
                borderRadius: 14, padding: 14,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: STATUS_BG[selectedTruck.status],
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Truck size={16} color={STATUS_COLORS[selectedTruck.status]} />
                  </div>
                  <span style={{ color: "#111827", fontWeight: 700, fontSize: 14 }}>{selectedTruck.id}</span>
                  <span style={{
                    marginLeft: "auto",
                    background: STATUS_BG[selectedTruck.status],
                    color: STATUS_COLORS[selectedTruck.status],
                    borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600,
                  }}>{STATUS_LABELS[selectedTruck.status]}</span>
                </div>
                <div style={{ color: "#6B7280", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "#9CA3AF" }}>Driver: </span>{selectedTruck.driver}
                </div>
                <div style={{ color: "#6B7280", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "#9CA3AF" }}>Vehicle: </span>{selectedTruck.vehicle}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                  <Phone size={12} color="#9CA3AF" />
                  <span style={{ color: "#6B7280", fontSize: 12 }}>{selectedTruck.phone}</span>
                </div>
              </div>

              {/* IoT live readings */}
              <div style={{
                background: "#FFFFFF", border: "1px solid #E9EDF5",
                borderRadius: 14, padding: 14,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <div style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
                  Live IoT Readings
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { icon: Gauge,       label: "Speed",      value: `${selectedTruck.speed} km/h`,  color: "#2563EB",  alert: false },
                    { icon: Thermometer, label: "Cargo Temp", value: `${selectedTruck.temp}°C`,       color: selectedTruck.temp > 8 ? "#DC2626" : "#F59E0B", alert: selectedTruck.temp > 8 },
                    { icon: Zap,         label: "Fuel",       value: `${selectedTruck.fuel}%`,        color: "#16A34A",  alert: false },
                    { icon: Droplets,    label: "Humidity",   value: `${selectedTruck.humidity}%`,    color: "#06B6D4",  alert: false },
                  ].map((m) => (
                    <div key={m.label} style={{
                      background: m.alert ? "#FEF2F2" : "#F8FAFC",
                      border: m.alert ? "1px solid #FECACA" : "1px solid #F1F5F9",
                      borderRadius: 10, padding: "10px 12px",
                    }}>
                      <m.icon size={14} color={m.color} />
                      <div style={{ color: m.alert ? "#DC2626" : "#111827", fontSize: 16, fontWeight: 700, marginTop: 4 }}>{m.value}</div>
                      <div style={{ color: "#9CA3AF", fontSize: 10 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trip info */}
              {trip && (
                <div style={{
                  background: "#FFFFFF", border: "1px solid #E9EDF5",
                  borderRadius: 14, padding: 14,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}>
                  <div style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
                    Current Trip · {trip.id}
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A", marginTop: 3, flexShrink: 0 }} />
                    <div>
                      <div style={{ color: "#9CA3AF", fontSize: 10 }}>FROM</div>
                      <div style={{ color: "#111827", fontSize: 12, fontWeight: 500 }}>{trip.origin}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB", marginTop: 3, flexShrink: 0 }} />
                    <div>
                      <div style={{ color: "#9CA3AF", fontSize: 10 }}>TO</div>
                      <div style={{ color: "#111827", fontSize: 12, fontWeight: 500 }}>{trip.destination}</div>
                    </div>
                  </div>
                  <div style={{ background: "#F1F5F9", borderRadius: 6, height: 5, marginBottom: 4 }}>
                    <div style={{
                      width: `${trip.progress}%`, height: "100%", borderRadius: 6,
                      background: "linear-gradient(90deg,#2563EB,#7C3AED)",
                      transition: "width 0.4s",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#9CA3AF", fontSize: 11 }}>{trip.progress}% complete</span>
                    <span style={{ color: "#9CA3AF", fontSize: 11 }}>{trip.distance} km</span>
                  </div>
                </div>
              )}
            </>
          )}
          </div>
        )}
      </div>

      {/* Mobile/tablet bottom sheet panel */}
      {!fullScreen && isNarrow && selectedTruck && (
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E9EDF5",
          borderRadius: 16,
          padding: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ color: "#111827", fontWeight: 800, fontSize: 13 }}>{selectedTruck.id} · {selectedTruck.driver}</div>
              <div style={{ color: "#6B7280", fontSize: 12 }}>{selectedTruck.vehicle}</div>
            </div>
            <div style={{
              background: STATUS_BG[selectedTruck.status],
              color: STATUS_COLORS[selectedTruck.status],
              borderRadius: 10,
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}>
              {STATUS_LABELS[selectedTruck.status]}
            </div>
          </div>
          {trip && (
            <div style={{ marginTop: 10, color: "#6B7280", fontSize: 12 }}>
              {trip.origin.split(",")[0]} → {trip.destination.split(",")[0]} · ETA {etaText || "—"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
