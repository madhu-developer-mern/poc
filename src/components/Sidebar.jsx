import { LayoutDashboard, Truck, MapPin, Bell, PlusCircle, BarChart2, Settings, Menu, X, ChevronRight, History } from "lucide-react";
import { useState } from "react";
import { ALERTS } from "../data/mockData";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",     id: "dashboard" },
  { icon: MapPin,          label: "Live Tracking", id: "tracking"  },
  { icon: Truck,           label: "Trips",         id: "trips"     },
  { icon: History,         label: "History",       id: "history"   },
  { icon: Bell,            label: "Alerts",        id: "alerts"    },
  { icon: BarChart2,       label: "IoT Analytics", id: "analytics" },
  { icon: PlusCircle,      label: "Create Trip",   id: "create"    },
];

export default function Sidebar({ active, setActive, onProfileClick }) {
  const [collapsed, setCollapsed] = useState(false);
  const unread = ALERTS.filter((a) => !a.acknowledged).length;

  return (
    <aside style={{
      width: collapsed ? 68 : 232,
      background: "#FFFFFF",
      borderRight: "1px solid #E9EDF5",
      display: "flex", flexDirection: "column", flexShrink: 0,
      transition: "width 0.22s ease",
      overflow: "hidden",
      boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "18px 16px" : "18px 20px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid #F1F5F9",
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg,#2563EB,#7C3AED)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
        }}>
          <Truck size={20} color="#fff" />
        </div>
        {!collapsed && (
          <div style={{ flex: 1 }}>
            <div style={{ color: "#111827", fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>FreightIQ</div>
            <div style={{ color: "#9CA3AF", fontSize: 11 }}>Smart Logistics</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: "#F4F6FB", border: "1px solid #E9EDF5", borderRadius: 8,
          width: 28, height: 28, cursor: "pointer", color: "#6B7280",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {collapsed ? <Menu size={15} /> : <X size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ icon: Icon, label, id }) => {
          const isActive = active === id;
          const badge = id === "alerts" ? unread : 0;
          return (
            <button key={id} onClick={() => setActive(id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 11,
              padding: collapsed ? "10px 15px" : "10px 13px",
              borderRadius: 10, border: "none", cursor: "pointer",
              background: isActive ? "#EEF2FF" : "transparent",
              color: isActive ? "#2563EB" : "#6B7280",
              fontWeight: isActive ? 600 : 400, fontSize: 14,
              transition: "all 0.13s",
              justifyContent: collapsed ? "center" : "flex-start",
              position: "relative",
            }}>
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              {!collapsed && (
                <>
                  <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                  {badge > 0 && (
                    <span style={{
                      background: "#EF4444", color: "#fff", borderRadius: 20,
                      padding: "1px 7px", fontSize: 11, fontWeight: 700, lineHeight: 1.6,
                    }}>{badge}</span>
                  )}
                  {isActive && <ChevronRight size={14} style={{ opacity: 0.4 }} />}
                </>
              )}
              {collapsed && badge > 0 && (
                <span style={{
                  position: "absolute", top: 6, right: 6,
                  width: 8, height: 8, borderRadius: "50%", background: "#EF4444",
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "10px 10px 14px", borderTop: "1px solid #F1F5F9" }}>
        <button style={{
          width: "100%", display: "flex", alignItems: "center", gap: 11,
          padding: "9px 13px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "transparent", color: "#9CA3AF", fontSize: 14,
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          <Settings size={17} strokeWidth={1.8} />
          {!collapsed && <span>Settings</span>}
        </button>
        <div style={{ position: "relative", marginTop: 4 }}>
          <button
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 13px",
              background: "#F8FAFF", borderRadius: 10, border: "1px solid #EEF2FF",
              cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start",
            }}
            onClick={() => {
              if (onProfileClick) onProfileClick();
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg,#F59E0B,#EF4444)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 13,
            }}>M</div>
            {!collapsed && (
              <div>
                <div style={{ color: "#111827", fontSize: 13, fontWeight: 600 }}>Madhu B</div>
                <div style={{ color: "#9CA3AF", fontSize: 11 }}>Fleet Manager</div>
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
