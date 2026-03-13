import { useState } from "react";
import { ShieldCheck, Plus, Check, Info, Lock, Eye, Edit2, ShieldAlert } from "lucide-react";

const ROLES = [
  { id: "admin", name: "Administrator", desc: "Full access to all modules and settings", users: 1 },
  { id: "ops", name: "Operations Manager", desc: "Manage trips, vehicles and users", users: 4 },
  { id: "fleet", name: "Fleet Manager", desc: "Monitor vehicles, devices and trip history", users: 12 },
  { id: "viewer", name: "Viewer", desc: "Read-only access to tracking and reports", users: 5 },
];

const PERMISSIONS = [
  { id: "org_edit", label: "Edit Organization", category: "System" },
  { id: "user_manage", label: "Manage Users", category: "Users" },
  { id: "role_manage", label: "Manage Roles", category: "Users" },
  { id: "trip_create", label: "Create Trips", category: "Fleet" },
  { id: "trip_edit", label: "Edit Active Trips", category: "Fleet" },
  { id: "device_reg", label: "Register Devices", category: "Devices" },
  { id: "device_update", label: "Update Firmware", category: "Devices" },
  { id: "reports_gen", label: "Generate Reports", category: "Reporting" },
  { id: "audit_view", label: "View Audit Logs", category: "System" },
];

export default function RolePermissionManagement() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>Roles & Permissions</h2>
          <p style={{ color: "#64748b", marginTop: 4 }}>Control access levels and module visibility for your team.</p>
        </div>
        <button style={{ 
          background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", 
          borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 
        }}>
          <Plus size={18} /> Create New Role
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
        {/* Roles List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              style={{
                textAlign: "left", padding: 20, borderRadius: 12, border: "1px solid",
                borderColor: selectedRole.id === role.id ? "#2563eb" : "#e2e8f0",
                background: selectedRole.id === role.id ? "#f0f7ff" : "#fff",
                cursor: "pointer", transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: "#1e293b" }}>{role.name}</span>
                <span style={{ fontSize: 11, background: "#f1f5f9", padding: "2px 8px", borderRadius: 10, color: "#64748b" }}>{role.users} Users</span>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>{role.desc}</p>
            </button>
          ))}
        </div>

        {/* Permissions Matrix */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: 24, borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{selectedRole.name} Permissions</h3>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Configure what this role can see and do.</p>
            </div>
            <button style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Duplicate Role
            </button>
          </div>

          <div style={{ padding: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {["System", "Users", "Fleet", "Devices", "Reporting"].map((category) => (
                <div key={category}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>{category}</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {PERMISSIONS.filter(p => p.category === category).map(perm => (
                      <PermissionItem key={perm.id} label={perm.label} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 20, background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button style={{ background: "transparent", border: "none", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Reset to Default</button>
            <button style={{ background: "#2563eb", color: "#fff", border: "none", padding: "8px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Save Permissions</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PermissionItem({ label }) {
  const [enabled, setEnabled] = useState(true);

  return (
    <div 
      onClick={() => setEnabled(!enabled)}
      style={{ 
        display: "flex", alignItems: "center", gap: 12, cursor: "pointer", 
        padding: "10px 12px", borderRadius: 8, border: "1px solid #f1f5f9",
        background: enabled ? "#f8fafc" : "transparent", transition: "all 0.1s"
      }}
    >
      <div style={{ 
        width: 18, height: 18, borderRadius: 4, border: "2px solid",
        borderColor: enabled ? "#2563eb" : "#cbd5e1",
        background: enabled ? "#2563eb" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "all 0.1s"
      }}>
        {enabled && <Check size={12} strokeWidth={4} />}
      </div>
      <span style={{ fontSize: 14, color: enabled ? "#1e293b" : "#64748b", fontWeight: enabled ? 600 : 400 }}>{label}</span>
    </div>
  );
}
