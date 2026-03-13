import { Truck, MapPin, AlertTriangle, CheckCircle, Package } from "lucide-react";
import StatCard from "./StatCard";
import TruckMap from "./TruckMap";
import AlertPanel from "./AlertPanel";
import { TRUCKS, TRIPS, ALERTS, SHIPMENTS } from "../data/mockData";
import { useState } from "react";

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

export default function Dashboard({ setActive }) {
  const [selectedTruck, setSelectedTruck] = useState(null);

  const inTransit  = TRUCKS.filter((t) => t.status === "in_transit").length;
  const alertCount = ALERTS.filter((a) => !a.acknowledged).length;
  const delivered  = TRIPS.filter((t) => t.status === "delivered").length;
  const totalGoods = TRIPS.reduce((sum, t) => sum + t.goods.length, 0);

  return (
    <div style={{ padding: "20px 24px 24px" }}>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard icon={Truck}         label="Active Trucks"   value={inTransit}  sub="In transit now"  color="#2563EB" bg="#EFF6FF" />
        <StatCard 
          icon={AlertTriangle} 
          label="Active Alerts"   
          value={alertCount} 
          sub="Needs attention"  
          color="#DC2626" 
          bg="#FEF2F2" 
          onClick={() => setActive("alerts")}
        />
        <StatCard icon={CheckCircle}   label="Delivered Today" value={delivered}  sub="On-time: 100%"   color="#16A34A" bg="#F0FDF4" />
        <StatCard icon={Package}       label="Goods Tracked"   value={totalGoods} sub="All shipments"   color="#7C3AED" bg="#F5F3FF" />
      </div>

      {/* Map */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          height: 390, borderRadius: 16, overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: "1px solid #E9EDF5",
        }}>
          <TruckMap selectedTruck={selectedTruck} onSelectTruck={setSelectedTruck} />
        </div>
      </div>

      {/* Fleet overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {TRUCKS.map((truck) => {
          const trip = TRIPS.find((t) => t.truckId === truck.id);
          const color = STATUS_COLORS[truck.status];
          const bg    = STATUS_BG[truck.status];
          const isSelected = selectedTruck?.id === truck.id;

          return (
            <div key={truck.id} onClick={() => setSelectedTruck(isSelected ? null : truck)} style={{
              background: isSelected ? "#EFF6FF" : "#FFFFFF",
              border: `1.5px solid ${isSelected ? "#2563EB" : "#E9EDF5"}`,
              borderRadius: 14, padding: 16, cursor: "pointer",
              transition: "all 0.15s",
              boxShadow: isSelected ? "0 0 0 3px rgba(37,99,235,0.12)" : "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Truck size={18} color={color} />
                </div>
                <div>
                  <div style={{ color: "#111827", fontWeight: 700, fontSize: 13 }}>{truck.id}</div>
                  <div style={{ color: "#9CA3AF", fontSize: 11 }}>{truck.driver}</div>
                </div>
              </div>

              <span style={{
                display: "inline-block", background: bg, color, borderRadius: 20,
                padding: "2px 10px", fontSize: 11, fontWeight: 600, marginBottom: 10,
              }}>{STATUS_LABELS[truck.status]}</span>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  { label: "Temp",     value: `${truck.temp}°C`,      alert: truck.temp > 8 },
                  { label: "Fuel",     value: `${truck.fuel}%`,        warn: truck.fuel < 30 },
                  { label: "Speed",    value: `${truck.speed} km/h` },
                  { label: "Humidity", value: `${truck.humidity}%` },
                ].map((m) => (
                  <div key={m.label} style={{
                    background: m.alert ? "#FEF2F2" : m.warn ? "#FFFBEB" : "#F8FAFC",
                    border: `1px solid ${m.alert ? "#FECACA" : m.warn ? "#FDE68A" : "#F1F5F9"}`,
                    borderRadius: 8, padding: "6px 9px",
                  }}>
                    <div style={{ color: m.alert ? "#DC2626" : m.warn ? "#D97706" : "#111827", fontSize: 13, fontWeight: 700 }}>{m.value}</div>
                    <div style={{ color: "#9CA3AF", fontSize: 10 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {trip && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "#9CA3AF", fontSize: 10 }}>Route</span>
                    <span style={{ color: "#6B7280", fontSize: 10, fontWeight: 600 }}>{trip.progress}%</span>
                  </div>
                  <div style={{ background: "#F1F5F9", borderRadius: 4, height: 5 }}>
                    <div style={{
                      width: `${trip.progress}%`, height: "100%", borderRadius: 4,
                      background: truck.status === "alert"
                        ? "linear-gradient(90deg,#F59E0B,#DC2626)"
                        : `linear-gradient(90deg,#2563EB,#7C3AED)`,
                      transition: "width 0.4s",
                    }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
