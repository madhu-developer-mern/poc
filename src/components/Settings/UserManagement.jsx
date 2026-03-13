import { useState } from "react";
import { Users, Search, Plus, Filter, MoreVertical, Mail, Shield, UserX, UserCheck, Key, Edit2, Trash2 } from "lucide-react";

const MOCK_USERS = [
  { id: 1, name: "Madhu B", email: "madhu@freightiq.com", role: "Admin", status: "Active", lastActive: "Just now" },
  { id: 2, name: "Suresh Kumar", email: "suresh@freightiq.com", role: "Operations Manager", status: "Active", lastActive: "2h ago" },
  { id: 3, name: "Anita Rao", email: "anita@freightiq.com", role: "Fleet Manager", status: "Inactive", lastActive: "3 days ago" },
  { id: 4, name: "David Wilson", email: "david@freightiq.com", role: "Viewer", status: "Active", lastActive: "1d ago" },
  { id: 5, name: "Priya Singh", email: "priya@freightiq.com", role: "Fleet Manager", status: "Active", lastActive: "5h ago" },
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(MOCK_USERS);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>User Management</h2>
          <p style={{ color: "#64748b", marginTop: 4 }}>Invite and manage users, their roles and system access.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          style={{
            background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px",
            borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 12px rgba(37,99,235,0.2)"
          }}
        >
          <Plus size={18} /> Invite User
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        <StatCard label="Total Users" value={users.length} icon={Users} color="#2563eb" />
        <StatCard label="Active Now" value={3} icon={UserCheck} color="#16a34a" />
        <StatCard label="Pending Invites" value={2} icon={Mail} color="#f59e0b" />
        <StatCard label="Admins" value={1} icon={Shield} color="#7c3aed" />
      </div>

      {/* Filters & Table */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 16 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%", padding: "10px 12px 10px 40px", borderRadius: 8, border: "1px solid #e2e8f0",
                fontSize: 14, outline: "none"
              }}
            />
          </div>
          <button style={{ 
            background: "#fff", border: "1px solid #e2e8f0", padding: "0 16px", borderRadius: 8, 
            display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 14, cursor: "pointer"
          }}>
            <Filter size={16} /> Filter
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>User</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Role</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Last Active</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ 
                      width: 36, height: 36, borderRadius: "50%", background: "#eff6ff", 
                      color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14
                    }}>{user.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ fontSize: 13, color: "#475569" }}>{user.role}</div>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ 
                    padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: user.status === "Active" ? "#f0fdf4" : "#fef2f2",
                    color: user.status === "Active" ? "#16a34a" : "#dc2626"
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{user.lastActive}</div>
                </td>
                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <ActionButton icon={Edit2} tooltip="Edit Profile" />
                    <ActionButton icon={Key} tooltip="Reset Password" />
                    <ActionButton icon={user.status === "Active" ? UserX : UserCheck} tooltip={user.status === "Active" ? "Deactivate" : "Activate"} />
                    <ActionButton icon={Trash2} tooltip="Delete" danger />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
            <Users size={48} strokeWidth={1} style={{ margin: "0 auto 16px" }} />
            <p>No users found matching your search.</p>
          </div>
        )}
      </div>

      {showInviteModal && (
        <InviteModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ 
        width: 48, height: 48, borderRadius: 12, background: `${color}10`, 
        display: "flex", alignItems: "center", justifyContent: "center", color: color
      }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>{value}</div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, danger, tooltip }) {
  return (
    <button 
      title={tooltip}
      style={{ 
        width: 32, height: 32, borderRadius: 6, border: "1px solid #f1f5f9", background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center", color: danger ? "#dc2626" : "#64748b",
        cursor: "pointer", transition: "all 0.2s"
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = danger ? "#fef2f2" : "#f8fafc"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
    >
      <Icon size={14} />
    </button>
  );
}

function InviteModal({ onClose }) {
  return (
    <div style={{ 
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
      background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{ 
        background: "#fff", borderRadius: 16, width: 480, padding: 32, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Invite New User</h3>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Send an email invitation to a new team member.</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>Email Address</label>
            <input type="email" placeholder="name@company.com" style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14 }} />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>Assigned Role</label>
            <select style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14 }}>
              <option>Admin</option>
              <option>Operations Manager</option>
              <option>Fleet Manager</option>
              <option>Viewer</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button 
            onClick={onClose}
            style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontWeight: 600, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button 
            style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, cursor: "pointer" }}
            onClick={onClose}
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}
