import { useState } from "react";
import { AlertTriangle, AlertCircle, Info, Check, Bell } from "lucide-react";
import { ALERTS, TRUCKS } from "../data/mockData";

const SEVERITY = {
  critical: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: AlertTriangle, label: "Critical" },
  warning:  { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: AlertCircle,   label: "Warning"  },
  info:     { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", icon: Info,           label: "Info"     },
};

export default function AlertPanel({ compact = false }) {
  const [alerts, setAlerts] = useState(ALERTS);

  const acknowledge = (id) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const unread = alerts.filter((a) => !a.acknowledged);
  const read   = alerts.filter((a) =>  a.acknowledged);

  const AlertItem = ({ alert }) => {
    const sev  = SEVERITY[alert.severity];
    const Icon = sev.icon;
    const truck = TRUCKS.find((t) => t.id === alert.truckId);
    const time  = new Date(alert.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    return (
      <div style={{
        background: sev.bg,
        border: `1px solid ${sev.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 8,
        opacity: alert.acknowledged ? 0.6 : 1,
        transition: "opacity 0.2s",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#FFFFFF",
            border: `1px solid ${sev.border}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon size={15} color={sev.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <span style={{
                background: sev.color, color: "#fff", borderRadius: 4,
                padding: "1px 6px", fontSize: 10, fontWeight: 700, textTransform: "uppercase",
              }}>{sev.label}</span>
              <span style={{ color: "#9CA3AF", fontSize: 11 }}>{truck?.id} · {time}</span>
              {!alert.acknowledged && (
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#EF4444", marginLeft: "auto", flexShrink: 0,
                }} />
              )}
            </div>
            <div style={{ color: "#111827", fontSize: 13, lineHeight: 1.5 }}>{alert.message}</div>
            <div style={{ color: "#6B7280", fontSize: 11, marginTop: 4 }}>
              Driver: {truck?.driver} · Trip: {alert.tripId}
            </div>
          </div>
        </div>
        {!alert.acknowledged && !compact && (
          <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => acknowledge(alert.id)}
              style={{
                background: "#FFFFFF", border: "1px solid #E9EDF5",
                borderRadius: 8, padding: "5px 12px", color: "#374151", fontSize: 12,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <Check size={12} /> Acknowledge
            </button>
          </div>
        )}
      </div>
    );
  };

  if (compact) {
    return (
      <div>
        {alerts.slice(0, 4).map((a) => <AlertItem key={a.id} alert={a} />)}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 24px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Bell size={20} color="#D97706" />
        <h2 style={{ color: "#111827", fontSize: 18, fontWeight: 700, margin: 0 }}>Alert Center</h2>
        <span style={{
          background: "#EF4444", color: "#fff", borderRadius: 10,
          padding: "2px 8px", fontSize: 12, fontWeight: 700,
        }}>{unread.length} Active</span>
      </div>

      {unread.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            Active Alerts
          </div>
          {unread.map((a) => <AlertItem key={a.id} alert={a} />)}
        </div>
      )}

      {read.length > 0 && (
        <div>
          <div style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            Acknowledged
          </div>
          {read.map((a) => <AlertItem key={a.id} alert={a} />)}
        </div>
      )}
    </div>
  );
}
