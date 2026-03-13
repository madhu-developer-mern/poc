import { useState } from "react";
import { MapPin, Package, Clock, CheckCircle, Truck, AlertCircle, Loader } from "lucide-react";
import { SHIPMENTS, TRUCKS } from "../data/mockData";
import TripDetail from "./TripDetail";

const STATUS_CONFIG = {
  in_transit: { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", icon: Truck,        label: "In Transit" },
  loading:    { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: Loader,       label: "Loading"    },
  delivered:  { color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", icon: CheckCircle,  label: "Delivered"  },
  alert:      { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: AlertCircle,  label: "Alert"      },
};

export default function TripList({ onSelectTrip, setActive }) {
  const [filter, setFilter]         = useState("all");
  const [selectedTrip, setSelectedTrip] = useState(null);

  const filtered = filter === "all" ? SHIPMENTS : SHIPMENTS.filter((t) => t.status === filter);

  if (selectedTrip) {
    return <TripDetail trip={selectedTrip} onBack={() => setSelectedTrip(null)} />;
  }

  return (
    <div style={{ padding: "20px 24px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ color: "#111827", fontSize: 18, fontWeight: 700, margin: 0 }}>All Trips</h2>
          <button 
            onClick={() => setActive && setActive("create")}
            style={{
              padding: "4px 10px", background: "#EEF2FF", border: "1px solid #E0E7FF",
              borderRadius: 6, color: "#2563EB", fontSize: 11, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
              transition: "all 0.2s"
            }}
          >
            <span>+ Create New Trip</span>
          </button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "in_transit", "loading", "delivered", "alert"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                background: filter === s ? "#2563EB" : "#FFFFFF",
                border: filter === s ? "1px solid #2563EB" : "1px solid #E9EDF5",
                borderRadius: 8, padding: "5px 12px", cursor: "pointer",
                color: filter === s ? "#fff" : "#6B7280",
                fontSize: 12, fontWeight: filter === s ? 600 : 400,
                textTransform: "capitalize",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map((trip) => {
          const cfg        = STATUS_CONFIG[trip.status];
          const StatusIcon = cfg.icon;
          const truck      = TRUCKS.find((t) => t.id === trip.truckId);
          const eta        = new Date(trip.eta).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
          const start      = new Date(trip.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
          const tempSensitive = trip.goods.some((g) => g.tempSensitive);
          const isAlert    = trip.status === "alert";

          return (
            <div
              key={trip.id}
              onClick={() => setSelectedTrip(trip)}
              style={{
                background: "#FFFFFF",
                border: `1px solid ${isAlert ? "#FECACA" : "#E9EDF5"}`,
                borderRadius: 14,
                padding: "16px 20px",
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = cfg.color;
                e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.08)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isAlert ? "#FECACA" : "#E9EDF5";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <StatusIcon size={16} color={cfg.color} />
                </div>
                <div>
                  <div style={{ color: "#111827", fontWeight: 700, fontSize: 14 }}>{trip.id}</div>
                  <div style={{ color: "#9CA3AF", fontSize: 11 }}>{truck?.vehicle}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                  {tempSensitive && (
                    <span style={{
                      background: "#FEF2F2", border: "1px solid #FECACA",
                      borderRadius: 6, padding: "2px 7px", color: "#DC2626", fontSize: 10, fontWeight: 600,
                    }}>🌡️ Cold Chain</span>
                  )}
                  <span style={{
                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                    borderRadius: 6, padding: "2px 8px", color: cfg.color, fontSize: 11, fontWeight: 600,
                  }}>{cfg.label}</span>
                </div>
              </div>

              {/* Route */}
              <div style={{ display: "flex", alignItems: "stretch", gap: 0, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A" }} />
                    <span style={{ color: "#9CA3AF", fontSize: 11 }}>FROM</span>
                  </div>
                  <div style={{ color: "#111827", fontSize: 13, marginLeft: 14, marginTop: 2 }}>{trip.origin}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px" }}>
                  <div style={{ flex: 1, width: 1, background: "#E9EDF5" }} />
                  <span style={{ color: "#9CA3AF", fontSize: 10, padding: "4px 0" }}>→</span>
                  <div style={{ flex: 1, width: 1, background: "#E9EDF5" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB" }} />
                    <span style={{ color: "#9CA3AF", fontSize: 11 }}>TO</span>
                  </div>
                  <div style={{ color: "#111827", fontSize: 13, marginLeft: 14, marginTop: 2 }}>{trip.destination}</div>
                </div>
              </div>

              {/* Progress */}
              {(trip.status === "in_transit" || trip.status === "alert") && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "#9CA3AF", fontSize: 11 }}>Progress</span>
                    <span style={{ color: "#6B7280", fontSize: 11, fontWeight: 600 }}>{trip.progress}%</span>
                  </div>
                  <div style={{ background: "#F1F5F9", borderRadius: 4, height: 5 }}>
                    <div style={{
                      width: `${trip.progress}%`, height: "100%", borderRadius: 4,
                      background: isAlert
                        ? "linear-gradient(90deg,#F59E0B,#DC2626)"
                        : "linear-gradient(90deg,#2563EB,#7C3AED)",
                    }} />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, borderTop: "1px solid #F1F5F9", paddingTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={12} color="#9CA3AF" />
                  <span style={{ color: "#9CA3AF", fontSize: 11 }}>Started {start}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={12} color="#9CA3AF" />
                  <span style={{ color: "#9CA3AF", fontSize: 11 }}>{trip.distance} km</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Package size={12} color="#9CA3AF" />
                  <span style={{ color: "#9CA3AF", fontSize: 11 }}>{trip.goods.length} item{trip.goods.length > 1 ? "s" : ""}</span>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <span style={{ color: "#9CA3AF", fontSize: 11 }}>ETA: <strong style={{ color: "#111827" }}>{eta}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
