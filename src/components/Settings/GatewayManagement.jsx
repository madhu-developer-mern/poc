import { useState, useEffect } from "react";
import { Network, Search, Plus, Signal, Activity, RefreshCw, Unplug, MapPin, X } from "lucide-react";
import { api } from "../../lib/api";

export default function GatewayManagement() {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    setLoading(true);
    try {
      const data = await api.getCollection("gateways");
      setGateways(data || []);
    } catch (err) {
      console.error("Failed to fetch gateways", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newData) => {
    try {
      await api.updateItem("gateways", { ...newData, status: "Online", signal: "Strong", firmware: "v1.0.0" });
      fetchGateways();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create gateway", err);
    }
  };

  const filteredGateways = (gateways || []).filter(gtw => 
    gtw.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (gtw.assignedTo && gtw.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>Gateway Management</h2>
          <p style={{ color: "#64748b", marginTop: 4 }}>Manage and monitor the communication units installed in your fleet.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ 
            background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", 
            borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 
          }}
        >
          <Plus size={18} /> Register Gateway
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
        <GatewayCard label="Total Gateways" value={gateways.length} sub={`${gateways.filter(g => g.status !== 'Online').length} offline`} icon={Network} color="#2563eb" />
        <GatewayCard label="Avg. Signal" value="82%" sub="Strong connectivity" icon={Signal} color="#16a34a" />
        <GatewayCard label="Data Ingestion" value="1.2 GB" sub="Last 24 hours" icon={Activity} color="#7c3aed" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ position: "relative", maxWidth: 400 }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              type="text" 
              placeholder="Search Gateway ID or Vehicle..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "10px 12px 10px 40px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14 }} 
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading gateways...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Gateway ID</th>
                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Assigned Vehicle</th>
                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Signal</th>
                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Firmware</th>
                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Status</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGateways.map((gtw) => (
                <tr key={gtw.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{gtw.id}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b", fontSize: 11, marginTop: 2 }}>
                      <MapPin size={10} /> {gtw.location || "Last known location"}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "#475569" }}>{gtw.assignedTo || "Unassigned"}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex", gap: 1, alignItems: "flex-end", height: 12 }}>
                        {[1, 2, 3, 4].map(idx => (
                          <div key={idx} style={{ 
                            width: 3, height: idx * 3, borderRadius: 1,
                            background: (gtw.signal === 'Strong' ? 100 : (gtw.signal === 'Good' ? 75 : 25)) >= idx * 25 ? "#16a34a" : "#e2e8f0" 
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{gtw.signal || "0%"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "#64748b" }}>{gtw.firmware}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ 
                      padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: gtw.status === "Online" ? "#f0fdf4" : "#fef2f2",
                      color: gtw.status === "Online" ? "#16a34a" : "#dc2626"
                    }}>
                      {gtw.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <button title="Restart" style={{ padding: 6, background: "transparent", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", color: "#64748b" }}><RefreshCw size={14} /></button>
                      <button title="Unassign" style={{ padding: 6, background: "transparent", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", color: "#64748b" }}><Unplug size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <RegisterModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />
      )}
    </div>
  );
}

function GatewayCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, display: "flex", gap: 20 }}>
      <div style={{ 
        width: 52, height: 52, borderRadius: 14, background: `${color}10`, 
        display: "flex", alignItems: "center", justifyContent: "center", color: color, flexShrink: 0
      }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600, marginTop: 4 }}>{label}</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}

function RegisterModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({ id: "", assignedTo: "" });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", padding: 32, borderRadius: 16, width: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Register Gateway</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Gateway ID</label>
            <input 
              type="text" placeholder="GTW-XXXX" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4 }}
              value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Assign to Vehicle</label>
            <input 
              type="text" placeholder="MH 01 AB 1234" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4 }}
              value={formData.assignedTo} onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
            />
          </div>
          <button 
            onClick={() => onSubmit(formData)}
            style={{ background: "#2563eb", color: "#fff", border: "none", padding: 12, borderRadius: 8, fontWeight: 600, cursor: "pointer", marginTop: 10 }}
          >
            Confirm Registration
          </button>
        </div>
      </div>
    </div>
  );
}
