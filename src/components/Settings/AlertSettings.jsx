import { useState } from "react";
import { BellRing, Bell, Mail, MessageSquare, Smartphone, Save, AlertTriangle, ShieldAlert } from "lucide-react";

export function AlertConfiguration() {
  const [alerts, setAlerts] = useState([
    { id: "temp", label: "Temperature Breach", severity: "High", enabled: true, escalation: "Immediate" },
    { id: "hum", label: "Humidity Breach", severity: "Medium", enabled: true, escalation: "After 5 mins" },
    { id: "offline", label: "Device Offline", severity: "Critical", enabled: true, escalation: "Immediate" },
    { id: "battery", label: "Battery Low", severity: "Low", enabled: true, escalation: "Daily" },
    { id: "missing", label: "Data Missing", severity: "Medium", enabled: false, escalation: "After 15 mins" },
  ]);

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>Alert Configuration</h2>
          <p style={{ color: "#64748b", marginTop: 4 }}>Define what triggers system alerts and how they should be escalated.</p>
        </div>
        <button style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Save size={18} /> Save Alert Rules
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>ALERT TYPE</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>SEVERITY</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>ESCALATION</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>STATUS</th>
              <th style={{ padding: "14px 20px", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{alert.label}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Triggered on threshold crossing</div>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ 
                    padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                    background: getSeverityColor(alert.severity).bg,
                    color: getSeverityColor(alert.severity).text
                  }}>
                    {alert.severity}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: "#475569" }}>{alert.escalation}</td>
                <td style={{ padding: "16px 20px" }}>
                  <button 
                    onClick={() => {
                      const newAlerts = [...alerts];
                      const idx = newAlerts.findIndex(a => a.id === alert.id);
                      newAlerts[idx].enabled = !newAlerts[idx].enabled;
                      setAlerts(newAlerts);
                    }}
                    style={{ 
                      width: 40, height: 20, borderRadius: 20, border: "none", cursor: "pointer",
                      background: alert.enabled ? "#2563eb" : "#e2e8f0",
                      position: "relative", transition: "all 0.2s"
                    }}
                  >
                    <div style={{ 
                      width: 14, height: 14, borderRadius: "50%", background: "#fff",
                      position: "absolute", top: 3, left: alert.enabled ? 23 : 3,
                      transition: "all 0.2s"
                    }} />
                  </button>
                </td>
                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                  <button style={{ background: "transparent", border: "none", color: "#64748b", fontWeight: 500, cursor: "pointer", fontSize: 13 }}>Configure Recipients</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getSeverityColor(sev) {
  if (sev === "Critical") return { bg: "#fef2f2", text: "#dc2626" };
  if (sev === "High") return { bg: "#fff7ed", text: "#c2410c" };
  if (sev === "Medium") return { bg: "#fefce8", text: "#854d0e" };
  return { bg: "#f0fdf4", text: "#16a34a" };
}

export function NotificationSettings() {
  const [channels, setChannels] = useState({
    email: { active: true, freq: "Instant" },
    sms: { active: false, freq: "Instant" },
    push: { active: true, freq: "Instant" },
  });

  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 32 }}>Notification Channels</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        <ChannelCard 
          icon={Mail} title="Email Notifications" 
          active={channels.email.active} 
          desc="Send alerts and reports to team members." 
          onToggle={() => setChannels({...channels, email: {...channels.email, active: !channels.email.active}})}
        />
        <ChannelCard 
          icon={MessageSquare} title="SMS Notifications" 
          active={channels.sms.active} 
          desc="Emergency alerts via text message." 
          onToggle={() => setChannels({...channels, sms: {...channels.sms, active: !channels.sms.active}})}
        />
        <ChannelCard 
          icon={Smartphone} title="Mobile Push" 
          active={channels.push.active} 
          desc="Real-time alerts via FreightIQ app." 
          onToggle={() => setChannels({...channels, push: {...channels.push, active: !channels.push.active}})}
        />
      </div>

      <div style={{ marginTop: 40, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 20 }}>Notification Rules</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <RuleItem label="Notify Admin on Critical Temperature Breach" />
          <RuleItem label="Send Weekly Performance Report to Management" />
          <RuleItem label="Alert Fleet Manager if Vehicle deviates from Route" />
          <RuleItem label="Notify Customer when Shipment enters Geofence" />
        </div>
      </div>
    </div>
  );
}

function ChannelCard({ icon: Icon, title, desc, active, onToggle }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: active ? "#eff6ff" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: active ? "#2563eb" : "#94a3b8" }}>
          <Icon size={20} />
        </div>
        <button 
          onClick={onToggle}
          style={{ 
            width: 44, height: 22, borderRadius: 22, border: "none", cursor: "pointer",
            background: active ? "#2563eb" : "#e2e8f0",
            position: "relative", transition: "all 0.2s"
          }}
        >
          <div style={{ 
            width: 16, height: 16, borderRadius: "50%", background: "#fff",
            position: "absolute", top: 3, left: active ? 25 : 3,
            transition: "all 0.2s"
          }} />
        </button>
      </div>
      <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>{title}</h4>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>{desc}</p>
      <button style={{ marginTop: 20, background: "transparent", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer" }}>
        Configure Settings
      </button>
    </div>
  );
}

function RuleItem({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 8, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
      <span style={{ fontSize: 14, color: "#334155", fontWeight: 500 }}>{label}</span>
      <button style={{ color: "#2563eb", background: "transparent", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Edit Rule</button>
    </div>
  );
}
