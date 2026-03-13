import { Bell, Search, RefreshCw } from "lucide-react";
import { ALERTS } from "../data/mockData";

export default function Header({ title, subtitle, setActive }) {
  const unread = ALERTS.filter((a) => !a.acknowledged).length;

  return (
    <header style={{
      background: "#FFFFFF",
      borderBottom: "1px solid #E9EDF5",
      padding: "12px 24px",
      display: "flex", alignItems: "center", gap: 14,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ color: "#111827", fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: -0.3 }}>{title}</h1>
        {subtitle && <p style={{ color: "#9CA3AF", fontSize: 12, margin: 0 }}>{subtitle}</p>}
      </div>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "#F4F6FB", border: "1px solid #E9EDF5", borderRadius: 10,
        padding: "8px 14px", color: "#9CA3AF",
      }}>
        <Search size={14} />
        <input placeholder="Search trucks, trips..." style={{
          background: "none", border: "none", outline: "none",
          color: "#374151", fontSize: 13, width: 190,
        }} />
      </div>

      {/* Live badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "#F0FDF4", border: "1px solid #BBF7D0",
        borderRadius: 20, padding: "6px 13px",
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: "50%", background: "#16A34A",
          boxShadow: "0 0 0 2px #BBF7D0",
          display: "inline-block",
        }} />
        <span style={{ color: "#16A34A", fontSize: 12, fontWeight: 700 }}>LIVE</span>
      </div>

      {/* Refresh */}
      <button 
        onClick={() => window.location.reload()}
        style={{
        background: "#F4F6FB", border: "1px solid #E9EDF5", borderRadius: 10,
        padding: "8px 10px", cursor: "pointer", color: "#6B7280",
        display: "flex", alignItems: "center", transition: "all 0.2s"
      }}>
        <RefreshCw size={15} />
      </button>

      {/* Alerts */}
      <button 
        onClick={() => setActive("alerts")}
        style={{
        position: "relative", background: "#F4F6FB", border: "1px solid #E9EDF5",
        borderRadius: 10, padding: "8px 10px", cursor: "pointer", color: "#6B7280",
        display: "flex", alignItems: "center", transition: "all 0.2s"
      }}>
        <Bell size={17} />
        {unread > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "#EF4444", color: "#fff", borderRadius: "50%",
            width: 18, height: 18, fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{unread}</span>
        )}
      </button>
    </header>
  );
}
