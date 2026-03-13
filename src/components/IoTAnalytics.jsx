import { useState } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Cell,
} from "recharts";
import { TRUCKS, TEMP_HISTORY, SPEED_HISTORY, TRUCK_IOT_SUMMARY } from "../data/mockData";
import { Thermometer, Gauge, Zap, Droplets, Wind, Activity } from "lucide-react";

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid #E9EDF5",
      borderRadius: 10, padding: "10px 14px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}>
      <div style={{ color: "#9CA3AF", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
          {p.name}: {p.value}{unit || ""}
        </div>
      ))}
    </div>
  );
};

const GaugeCard = ({ icon: Icon, label, value, unit, max, color, alertVal }) => {
  const pct = Math.min((value / max) * 100, 100);
  const isAlert = alertVal && value > alertVal;
  return (
    <div style={{
      background: "#FFFFFF",
      border: `1.5px solid ${isAlert ? "#FECACA" : "#E9EDF5"}`,
      borderRadius: 14, padding: "16px 18px",
      boxShadow: isAlert ? "0 0 0 3px rgba(220,38,38,0.08)" : "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: isAlert ? "#FEF2F2" : `${color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={18} color={isAlert ? "#DC2626" : color} />
        </div>
        <div>
          <div style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
          <div style={{ color: isAlert ? "#DC2626" : "#111827", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
            {value}<span style={{ fontSize: 13, fontWeight: 400, color: "#9CA3AF", marginLeft: 3 }}>{unit}</span>
          </div>
        </div>
        {isAlert && (
          <div style={{
            marginLeft: "auto", background: "#FEF2F2", border: "1px solid #FECACA",
            color: "#DC2626", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px",
          }}>⚠ BREACH</div>
        )}
      </div>
      <div style={{ background: "#F1F5F9", borderRadius: 6, height: 7, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 6,
          background: isAlert ? "linear-gradient(90deg,#F59E0B,#DC2626)" : `linear-gradient(90deg,${color},${color}99)`,
          transition: "width 0.5s",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ color: "#D1D5DB", fontSize: 10 }}>0</span>
        {alertVal && <span style={{ color: "#FCA5A5", fontSize: 10 }}>Limit: {alertVal}{unit}</span>}
        <span style={{ color: "#D1D5DB", fontSize: 10 }}>{max}{unit}</span>
      </div>
    </div>
  );
};

export default function IoTAnalytics({ setActive }) {
  const [selectedTruckId, setSelectedTruckId] = useState(TRUCKS[0]?.id || "");
  const alertTruck  = TRUCKS.find((t) => t.status === "alert");
  const selectedTruck = TRUCKS.find((t) => t.id === selectedTruckId) || alertTruck || TRUCKS[0];
  const iotSummary = TRUCK_IOT_SUMMARY[selectedTruck?.id] || null;
  const fuelData    = TRUCKS.map((t) => ({ name: t.id.split("-")[1], fuel: t.fuel, low: t.fuel < 40 }));

  return (
    <div style={{ padding: "20px 24px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Activity size={20} color="#2563EB" />
        <h2 style={{ color: "#111827", fontSize: 18, fontWeight: 700, margin: 0 }}>IoT Analytics</h2>
        <span style={{ color: "#9CA3AF", fontSize: 13 }}>· Truck-wise sensors & history</span>
      </div>

      {/* Truck selector row */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 16 }}>
        {TRUCKS.map((t) => {
          const isActive = t.id === selectedTruck?.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTruckId(t.id)}
              style={{
                flexShrink: 0,
                borderRadius: 999,
                border: isActive ? "1px solid #2563EB" : "1px solid #E5E7EB",
                background: isActive ? "#EEF2FF" : "#FFFFFF",
                padding: "6px 10px",
                fontSize: 11,
                color: isActive ? "#1D4ED8" : "#4B5563",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.status === "alert" ? "#DC2626" : "#16A34A" }} />
              <span>{t.id}</span>
            </button>
          );
        })}
      </div>

      {alertTruck && alertTruck.id === selectedTruck?.id && (
        <div style={{
          background: "#FEF2F2", border: "1.5px solid #FECACA",
          borderRadius: 14, padding: "14px 18px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontSize: 22 }}>🚨</div>
          <div>
            <div style={{ color: "#DC2626", fontWeight: 700, fontSize: 14 }}>
              Active Breach: {alertTruck.id} ({alertTruck.driver})
            </div>
            <div style={{ color: "#6B7280", fontSize: 12 }}>
              Temperature {alertTruck.temp}°C exceeds cold-chain limit (8°C) · Engine temp {alertTruck.engineTemp}°C
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
          Live Sensors — {selectedTruck?.id}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          <GaugeCard icon={Thermometer} label="Cargo Temp"  value={selectedTruck?.temp}          unit="°C"    max={30}  color="#F59E0B" alertVal={8}   />
          <GaugeCard icon={Droplets}   label="Humidity"     value={selectedTruck?.humidity}       unit="%"     max={100} color="#06B6D4" alertVal={80}  />
          <GaugeCard icon={Gauge}      label="Speed"        value={selectedTruck?.speed}          unit=" km/h" max={120} color="#2563EB"               />
          <GaugeCard icon={Zap}        label="Fuel Level"   value={selectedTruck?.fuel}           unit="%"     max={100} color="#16A34A" alertVal={20}  />
          <GaugeCard icon={Wind}       label="Engine Temp"  value={selectedTruck?.engineTemp}     unit="°C"    max={120} color="#7C3AED" alertVal={100} />
          <GaugeCard icon={Activity}   label="Battery"      value={selectedTruck?.batteryVoltage} unit="V"   max={15}  color="#F59E0B" alertVal={12}  />
        </div>
      </div>

      <div style={{
        background: "#FFFFFF", border: "1px solid #E9EDF5",
        borderRadius: 14, padding: 20, marginBottom: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ color: "#111827", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
          🌡️ Temperature Trend (Fleet Avg)
        </div>
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TEMP_HISTORY}>
            <defs>
              <linearGradient id="t1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="t2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#DC2626" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="time" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} unit="°C" />
            <Tooltip content={<CustomTooltip unit="°C" />} />
            <ReferenceLine y={8} stroke="#DC2626" strokeDasharray="4 4"
              label={{ value: "Limit 8°C", fill: "#DC2626", fontSize: 10, position: "right" }} />
            <Legend wrapperStyle={{ color: "#6B7280", fontSize: 12 }} />
            <Area type="monotone" dataKey="Avg" name="Average" stroke="#2563EB" fill="url(#t1)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="Alert" name="Alert Corridor" stroke="#DC2626" fill="url(#t2)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{
          background: "#FFFFFF", border: "1px solid #E9EDF5",
          borderRadius: 14, padding: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ color: "#111827", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🚀 Speed History (Fleet)</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={SPEED_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="time" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} unit=" km/h" />
              <Tooltip content={<CustomTooltip unit=" km/h" />} />
              <Line type="monotone" dataKey="Avg" name="Average" stroke="#2563EB" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Peak" name="Peak" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{
          background: "#FFFFFF", border: "1px solid #E9EDF5",
          borderRadius: 14, padding: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ color: "#111827", fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>⛽ Fuel Levels</span>
            {setActive && (
              <button
                onClick={() => {
                  window.__TRACKING_SELECTED_TRUCK_ID = selectedTruck?.id;
                  setActive("tracking");
                }}
                style={{
                  borderRadius: 999,
                  border: "1px solid #2563EB",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  padding: "6px 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                View on map
              </button>
            )}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={fuelData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} unit="%" />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <ReferenceLine y={30} stroke="#DC2626" strokeDasharray="4 4" />
              <Bar dataKey="fuel" name="Fuel %" radius={[5,5,0,0]}>
                {fuelData.map((entry, i) => (
                  <Cell key={i} fill={entry.low ? "#DC2626" : "#2563EB"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
