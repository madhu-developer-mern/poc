import { useState } from "react";
import { 
  Building2, Users, ShieldCheck, Cpu, Network, Truck, CalendarRange, 
  Settings2, BellRing, Bell, HardDrive, FileText, History, Activity, 
  Globe, Lock, Settings, ChevronRight, LayoutGrid, Database, Share2
} from "lucide-react";

// Import sub-components
import OrganizationSettings from "./OrganizationSettings";
import UserManagement from "./UserManagement";
import RolePermissionManagement from "./RolePermissionManagement";
import DeviceManagement from "./DeviceManagement";
import GatewayManagement from "./GatewayManagement";
import FleetManagement from "./FleetManagement";
import TripConfiguration from "./TripConfiguration";
import { AlertConfiguration, NotificationSettings } from "./AlertSettings";
import { 
  DataManagement, ReportsManagement, AuditLogs, SystemHealth, 
  IntegrationManagement, SecurityManagement, PlatformSettings 
} from "./OtherSettings";


// For Sensor Configuration, we'll reuse TripConfiguration or similar if not specifically created
const SensorConfiguration = TripConfiguration; 

const CATEGORIES = [
  { id: "org", label: "Organization", icon: Building2, desc: "Company profile, limits, and settings" },
  { id: "users", label: "User Management", icon: Users, desc: "Manage staff, drivers, and administrators" },
  { id: "roles", label: "Roles & Permissions", icon: ShieldCheck, desc: "Define access control and feature visibility" },
  { id: "devices", label: "Device Management", icon: Cpu, desc: "TF10 sensors and component lifecycle" },
  { id: "gateways", label: "Gateway Management", icon: Network, desc: "Vehicle-installed communication units" },
  { id: "fleet", label: "Fleet Config", icon: Truck, desc: "Vehicle registration and tracking preferences" },
  { id: "trips", label: "Trip Settings", icon: CalendarRange, desc: "Global thresholds and default parameters" },
  { id: "sensors", label: "Sensor Config", icon: Settings2, desc: "Sampling intervals and alert thresholds" },
  { id: "alerts", label: "Alert Config", icon: BellRing, desc: "Breach alerts and severity escalation" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Email, SMS, and Mobile push settings" },
  { id: "data", label: "Data Management", icon: Database, desc: "Retention, archival, and storage monitoring" },
  { id: "reports", label: "Reports", icon: FileText, desc: "Automated reporting and export formats" },
  { id: "audit", label: "Audit Logs", icon: History, desc: "Platform activity and change tracking" },
  { id: "health", label: "System Health", icon: Activity, desc: "Connectivity status and performance metrics" },
  { id: "integration", label: "Integrations", icon: Share2, desc: "API keys, webhooks, and ERP syncing" },
  { id: "security", label: "Security", icon: Lock, desc: "2FA, password policies, and sessions" },
  { id: "platform", label: "Platform Settings", icon: Settings, desc: "Localization, branding, and maintenance" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("org");

  return (
    <div style={{ 
      display: "flex", height: "100%", background: "#fff", 
      borderRadius: "16px 16px 0 0", overflow: "hidden", margin: "0 16px"
    }}>
      {/* Settings Navigation */}
      <aside style={{ 
        width: 280, borderRight: "1px solid #f1f5f9", 
        display: "flex", flexDirection: "column", background: "#f8fafc",
        flexShrink: 0
      }}>
        <div style={{ padding: "24px 20px" }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Administration</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>System-wide configurations</p>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "0 12px 24px" }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 10, border: "none",
                  background: isActive ? "#fff" : "transparent",
                  color: isActive ? "#2563eb" : "#64748b",
                  cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                  marginBottom: 4,
                  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: isActive ? "#eff6ff" : "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isActive ? "#2563eb" : "#94a3b8",
                  transition: "all 0.2s",
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}>{cat.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>{cat.desc}</div>
                </div>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Settings Content Area */}
      <main style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        {activeTab === "org" && <OrganizationSettings />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "roles" && <RolePermissionManagement />}
        {activeTab === "devices" && <DeviceManagement />}
        {activeTab === "gateways" && <GatewayManagement />}
        {activeTab === "fleet" && <FleetManagement />}
        {activeTab === "trips" && <TripConfiguration />}
        {activeTab === "sensors" && <SensorConfiguration />}
        {activeTab === "alerts" && <AlertConfiguration />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "data" && <DataManagement />}
        {activeTab === "reports" && <ReportsManagement />}
        {activeTab === "audit" && <AuditLogs />}
        {activeTab === "health" && <SystemHealth />}
        {activeTab === "integration" && <IntegrationManagement />}
        {activeTab === "security" && <SecurityManagement />}
        {activeTab === "platform" && <PlatformSettings />}
      </main>
    </div>
  );
}

