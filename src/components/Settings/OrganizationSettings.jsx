import { useState } from "react";
import { Building2, Save, Globe, Phone, Mail, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

export default function OrganizationSettings() {
  const [orgData, setOrgData] = useState({
    name: "FreightIQ Solutions",
    legalName: "FreightIQ Global Logistics Pvt Ltd",
    domain: "freightiq.com",
    email: "admin@freightiq.com",
    phone: "+1 (555) 000-1234",
    address: "123 Tech Park, Bangalore, India",
    status: "Active",
    limits: {
      devices: 500,
      gateways: 100,
      tripsPerMonth: 5000
    }
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>Organization Profile</h2>
          <p style={{ color: "#64748b", marginTop: 4 }}>Manage company branding, contact info, and usage limits.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{
            background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px",
            borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.2s", opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      {success && (
        <div style={{ 
          background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", 
          padding: "12px 16px", borderRadius: 8, marginBottom: 24, display: "flex", alignItems: "center", gap: 10
        }}>
          <CheckCircle2 size={18} /> Organization details updated successfully.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        {/* Basic Info */}
        <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#334155", marginBottom: 20 }}>Basic Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <InputGroup label="Display Name" value={orgData.name} onChange={v => setOrgData({...orgData, name: v})} icon={Building2} />
              <InputGroup label="Legal Entity Name" value={orgData.legalName} onChange={v => setOrgData({...orgData, legalName: v})} />
              <InputGroup label="Primary Domain" value={orgData.domain} onChange={v => setOrgData({...orgData, domain: v})} icon={Globe} />
              <InputGroup label="Admin Email" value={orgData.email} onChange={v => setOrgData({...orgData, email: v})} icon={Mail} />
              <InputGroup label="Phone Number" value={orgData.phone} onChange={v => setOrgData({...orgData, phone: v})} icon={Phone} />
              <div style={{ gridColumn: "span 2" }}>
                <InputGroup label="Address" value={orgData.address} onChange={v => setOrgData({...orgData, address: v})} icon={MapPin} />
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#334155", marginBottom: 20 }}>Account Limits</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <LimitCard label="Max Devices" current={342} limit={orgData.limits.devices} />
              <LimitCard label="Max Gateways" current={89} limit={orgData.limits.gateways} />
              <LimitCard label="Trips / Month" current={1240} limit={orgData.limits.tripsPerMonth} />
            </div>
          </div>
        </section>

        {/* Side Panel */}
        <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 16 }}>Organization Status</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#16a34a", fontSize: 14, fontWeight: 600 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a" }}></div>
              Active & Verified
            </div>
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
              This organization is currently active and has full access to the platform features.
            </p>
            <button style={{ 
              marginTop: 20, width: "100%", background: "#fee2e2", color: "#dc2626", border: "none", 
              padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
              Deactivate Organization
            </button>
          </div>

          <div style={{ border: "1px dashed #cbd5e1", borderRadius: 12, padding: 24, textAlign: "center" }}>
            <div style={{ 
              width: 64, height: 64, background: "#f1f5f9", borderRadius: "50%", margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8"
            }}>
              <Building2 size={32} />
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>Organization Logo</h4>
            <p style={{ fontSize: 12, color: "#64748b", margin: "8px 0 16px" }}>PNG or JPG, max 5MB. 512x512px recommended.</p>
            <button style={{ background: "transparent", border: "1px solid #e2e8f0", padding: "6px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Upload New</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, icon: Icon }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>{label}</label>
      <div style={{ position: "relative" }}>
        {Icon && <Icon size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />}
        <input 
          type="text" 
          value={value} 
          onChange={e => onChange(e.target.value)}
          style={{
            width: "100%", padding: "10px 12px", paddingLeft: Icon ? 38 : 12,
            borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, outline: "none",
            transition: "all 0.2s", background: "#fcfdfe"
          }}
        />
      </div>
    </div>
  );
}

function LimitCard({ label, current, limit }) {
  const percent = Math.round((current / limit) * 100);
  const color = percent > 90 ? "#ef4444" : percent > 70 ? "#f59e0b" : "#2563eb";
  
  return (
    <div style={{ border: "1px solid #f1f5f9", borderRadius: 10, padding: 16, background: "#f8fafc" }}>
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "4px 0" }}>{current} <span style={{ fontSize: 12, fontWeight: 400, color: "#94a3b8" }}>/ {limit}</span></div>
      <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 10, marginTop: 8, overflow: "hidden" }}>
        <div style={{ width: `${percent}%`, height: "100%", background: color, borderRadius: 10 }}></div>
      </div>
    </div>
  );
}
