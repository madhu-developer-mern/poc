import { useState, useEffect } from "react";
import { Cpu, Search, Plus, Battery, Activity, Wifi, RefreshCw, MoreHorizontal, X } from "lucide-react";
import { api } from "../../lib/api";

export default function DeviceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await api.getCollection("devices");
      setDevices(data || []);
    } catch (err) {
      console.error("Failed to fetch devices", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newData) => {
    try {
      await api.updateItem("devices", { 
        ...newData, 
        status: "Active", 
        battery: 100, 
        firmware: "v2.0.0",
        type: "TF10 Sensor"
      });
      fetchDevices();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create device", err);
    }
  };

  const filteredDevices = (devices || []).filter(dev => 
    dev.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (dev.gateway && dev.gateway.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <button 
            onClick={() => setShowModal(true)}
            style={{ 
              background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", 
              borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 
            }}>
            <Plus size={18} /> Register Device
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        <DeviceStat label="Total Devices" value={devices.length} sub="Overall inventory" icon={Cpu} color="#2563eb" />
        <DeviceStat label="Healthy" value={devices.filter(d => d.status === "Active").length} sub="Optimal performance" icon={Activity} color="#16a34a" />
        <DeviceStat label="Low Battery" value={devices.filter(d => d.battery < 20).length} sub="Needs attention" icon={Battery} color="#f59e0b" />
        <DeviceStat label="Offline" value={devices.filter(d => d.status === "Offline").length} sub="Connection lost" icon={Wifi} color="#ef4444" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ position: "relative", maxWidth: 400 }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              type="text" 
              placeholder="Search ID ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%", padding: "10px 12px 10px 40px", borderRadius: 8, border: "1px solid #e2e8f0",
                fontSize: 14, outline: "none"
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading devices...</div>
        ) : (
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
              {filteredDevices.map((dev) => (
                <tr key={dev.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: getStatusColor(dev.status) }}></div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{dev.id}</div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "#475569" }}>{dev.gateway || "Unassigned"}</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "#475569" }}>
                    {dev.trip && dev.trip !== "N/A" ? <span style={{ color: "#2563eb", fontWeight: 500 }}>{dev.trip}</span> : "N/A"}
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
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "#64748b" }}>{dev.firmware || "v1.0.0"}</td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                      <MoreHorizontal size={18} />
                    </button>
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

function RegisterModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({ id: "", gateway: "" });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", padding: 32, borderRadius: 16, width: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Register New Device</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>TF10 Device ID</label>
            <input 
              type="text" placeholder="TF10-XXXX" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4 }}
              value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Assign to Gateway</label>
            <input 
              type="text" placeholder="GTW-XXXX" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4 }}
              value={formData.gateway} onChange={e => setFormData({ ...formData, gateway: e.target.value })}
            />
          </div>
          <button 
            onClick={() => onSubmit(formData)}
            style={{ background: "#2563eb", color: "#fff", border: "none", padding: 12, borderRadius: 8, fontWeight: 600, cursor: "pointer", marginTop: 10 }}
          >
            Register Device
          </button>
        </div>
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
