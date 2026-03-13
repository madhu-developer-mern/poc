import { useState } from "react";
import { Truck, Search, Plus, MapPin, Activity, History, Edit, Trash2, MoreVertical } from "lucide-react";

const MOCK_VEHICLES = [
  { id: "VEH-101", plate: "KA-01-HH-1234", model: "Tata Prima 4923", status: "On Trip", driver: "Rajesh Kumar", location: "Bangalore" },
  { id: "VEH-102", plate: "MH-02-AB-5678", model: "Ashok Leyland 3518", status: "Idle", driver: "Suresh Mani", location: "Mumbai" },
  { id: "VEH-103", plate: "DL-01-XY-9012", model: "BharatBenz 3723", status: "Maintenance", driver: "None", location: "Delhi Workshop" },
  { id: "VEH-104", plate: "TN-05-CD-3456", model: "Tata Prima 4923", status: "On Trip", driver: "Anand R", location: "Chennai" },
];

export default function FleetManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>Vehicle / Fleet Management</h2>
          <p style={{ color: "#64748b", marginTop: 4 }}>Register vehicles and assign communication gateways/drivers.</p>
        </div>
        <button style={{ 
          background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", 
          borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 
        }}>
          <Plus size={18} /> Register Vehicle
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
        <FleetStat label="Total Vehicles" value={48} icon={Truck} color="#2563eb" />
        <FleetStat label="Active on Road" value={32} icon={Activity} color="#16a34a" />
        <FleetStat label="Under Maintenance" value={4} icon={History} color="#f59e0b" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ position: "relative", maxWidth: 400 }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              type="text" 
              placeholder="Search Plate, Driver or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "10px 12px 10px 40px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14 }} 
            />
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>VEHICLE</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>MODEL</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>ASSIGNED DRIVER</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>CURRENT STATUS</th>
              <th style={{ padding: "14px 20px", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_VEHICLES.map((v) => (
              <tr key={v.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{v.plate}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>ID: {v.id}</div>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: "#475569" }}>{v.model}</td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: "#475569" }}>
                  {v.driver !== "None" ? v.driver : <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Unassigned</span>}
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ 
                    padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: getStatusStyles(v.status).bg,
                    color: getStatusStyles(v.status).text
                  }}>
                    {v.status}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                    <button style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}><Edit size={16} /></button>
                    <button style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}><History size={16} /></button>
                    <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FleetStat({ label, value, icon: Icon, color }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}10`, display: "flex", alignItems: "center", justifyContent: "center", color: color }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>{value}</div>
        <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function getStatusStyles(status) {
  if (status === "On Trip") return { bg: "#eff6ff", text: "#2563eb" };
  if (status === "Maintenance") return { bg: "#fef2f2", text: "#dc2626" };
  return { bg: "#f1f5f9", text: "#475569" };
}
