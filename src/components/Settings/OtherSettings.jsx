import { useState } from "react";
import { 
  Database, FileText, History, Activity, Share2, Lock, Settings, 
  Trash2, Download, ExternalLink, ShieldCheck, Globe, Clock, Palette
} from "lucide-react";

// 1. Data Management
export function DataManagement() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 32 }}>Data Management</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Retention Policies</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <RetentionItem label="Sensor Telemetry" duration="12 Months" />
            <RetentionItem label="Trip History" duration="24 Months" />
            <RetentionItem label="Alert & Audit Logs" duration="36 Months" />
          </div>
          <button style={{ marginTop: 24, width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Change Global Retention Policy</button>
        </div>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#991b1b", marginBottom: 12 }}>Data Purge / Archival</h3>
          <p style={{ fontSize: 13, color: "#b91c1c", marginBottom: 20 }}>Manually remove or archive old data to free up storage space.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ background: "#b91c1c", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Archive Data</button>
            <button style={{ background: "transparent", border: "1px solid #f87171", color: "#b91c1c", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Purge Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Reports Management
export function ReportsManagement() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 32 }}>Reports Management</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        <ReportTemplate icon={FileText} title="Trip Compliance PDF" desc="Summary of temperature and humidity across the trip." />
        <ReportTemplate icon={Activity} title="Sensor Health Excel" desc="Detailed diagnostics and battery status for all devices." />
        <ReportTemplate icon={History} title="Fleet Utilization CSV" desc="Vehicle movement and idle time analysis." />
      </div>
      <div style={{ marginTop: 40, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Scheduled Reports</h3>
        <p style={{ fontSize: 14, color: "#64748b" }}>You have no active scheduled reports. Automate your reporting by adding a schedule.</p>
        <button style={{ marginTop: 16, background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>+ Create Schedule</button>
      </div>
    </div>
  );
}

// 3. Audit Logs
export function AuditLogs() {
  const logs = [
    { user: "Madhu B", action: "Updated Organization Limits", time: "10 mins ago", ip: "192.168.1.1" },
    { user: "Suresh Kumar", action: "Registered Device TF10-8923", time: "2 hours ago", ip: "192.168.1.45" },
    { user: "Anita Rao", action: "Changed Alert Thresholds", time: "1 day ago", ip: "192.168.1.22" },
    { user: "System", action: "Auto-archived Trip Data", time: "2 days ago", ip: "N/A" },
  ];
  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 32 }}>Audit Tracking</h2>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>USER / SYSTEM</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>ACTION</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>TIMESTAMP</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>IP ADDRESS</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600 }}>{log.user}</td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#475569" }}>{log.action}</td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: "#64748b" }}>{log.time}</td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4. System Health
export function SystemHealth() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 32 }}>Platform Health</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        <HealthCard label="API Uptime" value="99.98%" status="Healthy" />
        <HealthCard label="Gateway Sync" value="Normal" status="Healthy" />
        <HealthCard label="DB Performance" value="12ms" status="Healthy" />
        <HealthCard label="Storage Use" value="44%" status="Warning" />
      </div>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Ingestion Metrics</h3>
        <div style={{ height: 200, background: "#f8fafc", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
          [Real-time Ingestion Chart Placeholder]
        </div>
      </div>
    </div>
  );
}

// 5. Integration Management
export function IntegrationManagement() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 32 }}>Developer & Integrations</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Share2 size={18} color="#2563eb" /> API Keys
          </h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Manage keys to access FreightIQ APIs from your internal systems.</p>
          <div style={{ padding: "12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9", fontFamily: "monospace", fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>fi_live_•••••••••••••••••••••</span>
            <button style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Reveal</button>
          </div>
          <button style={{ marginTop: 24, background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>+ Generate New Key</button>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <ExternalLink size={18} color="#2563eb" /> Webhooks
          </h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Receive real-time updates when events happen in the platform.</p>
          <div style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>No webhooks configured.</div>
          <button style={{ marginTop: 24, width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Add Endpoints</button>
        </div>
      </div>
    </div>
  );
}

// 6. Security Management
export function SecurityManagement() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 32 }}>Security & Compliance</h2>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Authentication Settings</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <SecurityToggle title="Two-Factor Authentication (2FA)" desc="Require 2FA for all administrator accounts." />
          <SecurityToggle title="Strict Password Policy" desc="Enforce 12+ characters, symbols, and number requirements." />
          <SecurityToggle title="Session Timeout" desc="Auto-logout users after 30 minutes of inactivity." active />
        </div>
      </div>
    </div>
  );
}

// 7. Platform Settings
export function PlatformSettings() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 32 }}>Platform Customization</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Globe size={18} color="#2563eb" /> Localization
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SelectGroup label="Default Timezone" options={["(UTC+05:30) India Standard Time", "(UTC-08:00) Pacific Time"]} />
            <SelectGroup label="Primary Language" options={["English (US)", "English (UK)", "Hindi"]} />
            <SelectGroup label="Map Provider" options={["Google Maps", "OpenStreetMap", "Mapbox"]} />
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Palette size={18} color="#2563eb" /> Branding
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ColorPicker label="Primary Brand Color" color="#2563eb" />
            <ColorPicker label="Accent Color" color="#7c3aed" />
            <div style={{ padding: 16, background: "#f8fafc", borderRadius: 12, textAlign: "center", border: "2px dashed #e2e8f0" }}>
              <Download size={20} style={{ color: "#94a3b8", marginBottom: 8 }} />
              <div style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>Custom Favicon</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 32, padding: 20, background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: "#9f1239" }}>System Maintenance Mode</h4>
          <p style={{ fontSize: 13, color: "#be123c" }}>Prevent non-admin users from accessing the platform during maintenance.</p>
        </div>
        <button style={{ background: "#e11d48", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Enable Mode</button>
      </div>
    </div>
  );
}

// Helper Components
function RetentionItem({ label, duration }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 14, color: "#475569" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{duration}</span>
    </div>
  );
}

function ReportTemplate({ icon: Icon, title, desc }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"}>
      <Icon size={24} color="#2563eb" style={{ marginBottom: 16 }} />
      <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>{title}</h4>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.4, marginBottom: 16 }}>{desc}</p>
      <button style={{ background: "#f1f5f9", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#475569" }}>Download Sample</button>
    </div>
  );
}

function HealthCard({ label, value, status }) {
  const isHealthy = status === "Healthy";
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 11, fontWeight: 700, color: isHealthy ? "#16a34a" : "#f59e0b" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: isHealthy ? "#16a34a" : "#f59e0b" }}></div>
        {status}
      </div>
    </div>
  );
}

function SecurityToggle({ title, desc, active = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{title}</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>{desc}</div>
      </div>
      <button style={{ width: 44, height: 22, borderRadius: 22, border: "none", background: active ? "#2563eb" : "#e2e8f0", position: "relative" }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: active ? 25 : 3 }} />
      </button>
    </div>
  );
}

function SelectGroup({ label, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{label}</label>
      <select style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, background: "#fcfdfe" }}>
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function ColorPicker({ label, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>{color}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color, border: "2px solid #fff", boxShadow: "0 0 0 1px #e2e8f0" }}></div>
      </div>
    </div>
  );
}
