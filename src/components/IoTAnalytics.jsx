import { useState, useEffect } from "react";
import { 
  Filter, Download, ChevronRight, Thermometer, Droplets, 
  Activity, Zap, Server, AlertTriangle, Truck, MapPin, 
  Package, Database, X, Settings
} from "lucide-react";
import { FilterSection, SegmentOption } from "./analytics/SharedUi";
import { TripPerformanceDashboard, TemperatureDashboard, HumidityDashboard } from "./analytics/Dashboards1";
import { AlertDashboard, DeviceDashboard, GatewayDashboard } from "./analytics/Dashboards2";
import { RouteDashboard, CargoDashboard, FleetDashboard } from "./analytics/Dashboards3";
import { DataReliabilityDashboard, OperationalDashboard } from "./analytics/Dashboards4";

export default function IoTAnalytics() {
  const [activeTab, setActiveTab] = useState("perf");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Tabs Definition
  const tabs = [
    { id: "perf", label: "Trip Performance", icon: Truck },
    { id: "temp", label: "Temperature", icon: Thermometer },
    { id: "hum", label: "Humidity", icon: Droplets },
    { id: "alerts", label: "Alert Analytics", icon: AlertTriangle },
    { id: "device", label: "Device (TF10)", icon: Zap },
    { id: "gateway", label: "Gateway", icon: Server },
    { id: "route", label: "Route Analytics", icon: MapPin },
    { id: "cargo", label: "Cargo Safety", icon: Package },
    { id: "fleet", label: "Fleet Metrics", icon: Truck },
    { id: "quality", label: "Data Quality", icon: Database },
    { id: "operations", label: "Operational", icon: Activity }
  ];

  return (
    <div style={{ padding: "32px 40px", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      {/* Analytics Header - Premium Aesthetics */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>Advanced IoT Analytics</h2>
          <p style={{ fontSize: 14, color: "#64748b", margin: "6px 0 0 0", fontWeight: 500 }}>Global fleet intelligence and predictive telemetry modeling</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={() => setShowFilters(true)}
            style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "10px 20px", borderRadius: 12, fontSize: 13, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 700, color: "#475569", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", transition: "all 0.2s" }}
            onMouseOver={(e) => Object.assign(e.target.style, { background: "#f8fafc" })}
            onMouseOut={(e) => Object.assign(e.target.style, { background: "#fff" })}
          >
            <Filter size={18} /> INTELLIGENT FILTERS
          </button>
          <button 
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 12, fontSize: 13, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 700, boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)", transition: "all 0.2s" }}
            onMouseOver={(e) => Object.assign(e.target.style, { opacity: 0.9, transform: "translateY(-1px)" })}
            onMouseOut={(e) => Object.assign(e.target.style, { opacity: 1, transform: "translateY(0)" })}
          >
            <Download size={18} /> EXPORT REPORT
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: 10, paddingBottom: 16, overflowX: "auto", borderBottom: "1px solid #e2e8f0", marginBottom: 28, scrollbarWidth: "none" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 18px", borderRadius: 12, 
              background: activeTab === tab.id ? "#0f172a" : "transparent",
              color: activeTab === tab.id ? "#fff" : "#64748b", border: "none", 
              fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer", 
              whiteSpace: "nowrap", transition: "all 0.2s"
            }}
            onMouseOver={(e) => activeTab !== tab.id && Object.assign(e.target.style, { background: "#f1f5f9", color: "#0f172a" })}
            onMouseOut={(e) => activeTab !== tab.id && Object.assign(e.target.style, { background: "transparent", color: "#64748b" })}
          >
            <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Dashboard Area */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 8, paddingBottom: 40 }}>
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          {activeTab === "perf" && <TripPerformanceDashboard />}
          {activeTab === "temp" && <TemperatureDashboard />}
          {activeTab === "hum" && <HumidityDashboard />}
          {activeTab === "alerts" && <AlertDashboard />}
          {activeTab === "device" && <DeviceDashboard />}
          {activeTab === "gateway" && <GatewayDashboard />}
          {activeTab === "route" && <RouteDashboard />}
          {activeTab === "cargo" && <CargoDashboard />}
          {activeTab === "fleet" && <FleetDashboard />}
          {activeTab === "quality" && <DataReliabilityDashboard />}
          {activeTab === "operations" && <OperationalDashboard />}
        </div>
      </div>

      {/* Slide-out Filter Drawer */}
      {showFilters && (
        <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 400, background: "#fff", boxShadow: "-20px 0 50px rgba(0,0,0,0.1)", zIndex: 1000, display: "flex", flexDirection: "column", borderLeft: "1px solid #e2e8f0", animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div style={{ padding: "24px 32px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", margin: 0 }}>Analytics Filters</h3>
            <button onClick={() => setShowFilters(false)} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 8, cursor: "pointer", transition: "0.2s" }}><X size={18} color="#64748b" /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
            <FilterSection title="Time Horizon">
              <SegmentOption label="Last 24 Hours" />
              <SegmentOption label="Last 7 Days" active />
              <SegmentOption label="Last 30 Days" />
            </FilterSection>
            <FilterSection title="Asset Category">
              <SegmentOption label="Pharmaceuticals" active />
              <SegmentOption label="Perishable Food" />
              <SegmentOption label="Electronics" />
            </FilterSection>
            <FilterSection title="Geographic Region">
              <SegmentOption label="APAC Region" active />
              <SegmentOption label="EMEA Region" />
              <SegmentOption label="NA Region" />
            </FilterSection>
          </div>
          <div style={{ padding: "24px 32px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
            <button onClick={() => setShowFilters(false)} style={{ width: "100%", background: "#0f172a", color: "#fff", border: "none", padding: 16, borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "0.2s" }}>APPLY FILTERS</button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
