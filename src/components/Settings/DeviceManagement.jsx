import { useState } from "react";
import { Cpu, Search, Plus, Battery, Activity, Wifi, Settings, RefreshCw, MoreHorizontal, Trash2, Edit } from "lucide-react";

const MOCK_DEVICES = [
  { id: "TF10-8923", type: "TF10 Sensor", gateway: "GTW-201", trip: "TRIP-449", battery: 88, status: "Active", health: "Healthy", firmware: "v2.4.1" },
  { id: "TF10-4421", type: "TF10 Sensor", gateway: "GTW-201", trip: "TRIP-449", battery: 12, status: "Low Battery", health: "Healthy", firmware: "v2.4.1" },
  { id: "TF10-1092", type: "TF10 Sensor", gateway: "GTW-105", trip: "TRIP-502", battery: 95, status: "Active", health: "Healthy", firmware: "v2.5.0" },
  { id: "TF10-7732", type: "TF10 Sensor", gateway: "Unassigned", trip: "N/A", battery: 0, status: "Offline", health: "Unknown", firmware: "v2.3.8" },
];

export default function DeviceManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>Device Management</h2>
          <p style={{ color: "#64748b", marginTop: 4 }}>Register and monitor TF10 sensors and component health.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ 
            background: "#fff", border: "1px solid #e2e8f0", padding: "10px 16px", borderRadius: 8, 
            display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, cursor: "pointer"
          }}>
            <RefreshCw size={18} /> Update Firmware
          </button>
          <button style={{ 
            background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", 
            borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 
          }}>
            <Plus size={18} /> Register Device
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        <DeviceStat label="Total Devices" value={142} sub="8 active trips" icon={Cpu} color="#2563eb" />
        <DeviceStat label="Healthy" value={128} sub="Optimal performance" icon={Activity} color="#16a34a" />
        <DeviceStat label="Low Battery" value={9} sub="Needs attention" icon={Battery} color="#f59e0b" />
        <DeviceStat label="Offline" value={5} sub="Connection lost" icon={Wifi} color="#ef4444" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ position: "relative", maxWidth: 400 }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              type="text" 
              placeholder="Search ID, Gateway or Trip..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%", padding: "10px 12px 10px 40px", borderRadius: 8, border: "1px solid #e2e8f0",
                fontSize: 14, outline: "none"
              }}
            />
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Device ID</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Gateway</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Trip</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Battery</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Firmware</th>
              <th style={{ padding: "14px 20px", textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DEVICES.map((dev) => (
              <tr key={dev.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: getStatusColor(dev.status) }}></div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{dev.id}</div>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: "#475569" }}>{dev.gateway}</td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: "#475569" }}>
                  {dev.trip !== "N/A" ? <span style={{ color: "#2563eb", fontWeight: 500 }}>{dev.trip}</span> : dev.trip}
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Battery size={14} color={dev.battery < 20 ? "#ef4444" : "#16a34a"} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{dev.battery}%</span>
                  </div>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ 
                    padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                    ...getStatusStyles(dev.status)
                  }}>
                    {dev.status}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: "#64748b" }}>{dev.firmware}</td>
                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                  <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeviceStat({ label, value, sub, icon: Icon, color }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}10`, display: "flex", alignItems: "center", justifyContent: "center", color: color }}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>{value}</div>
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  if (status === "Active") return "#16a34a";
  if (status === "Low Battery") return "#f59e0b";
  return "#ef4444";
}

function getStatusStyles(status) {
  if (status === "Active") return { background: "#f0fdf4", color: "#16a34a" };
  if (status === "Low Battery") return { background: "#fff7ed", color: "#c2410c" };
  return { background: "#fef2f2", color: "#dc2626" };
}
