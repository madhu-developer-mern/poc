import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend, ScatterChart, Scatter
} from "recharts";
import { 
  Filter, Download, ChevronRight, Thermometer, Droplets, 
  Activity, Zap, ShieldCheck, AlertTriangle, Truck, MapPin, 
  Package, Database, MousePointer2, X, Search, Check
} from "lucide-react";
import { api } from "../lib/api";

const COLORS = ["#2563eb", "#7c3aed", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

export default function IoTAnalytics() {
  const [activeTab, setActiveTab] = useState("temp");
  const [showFilters, setShowFilters] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await api.getCollection("analytics");
      setData(result || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Crunching massive telemetry datasets...</div>;

  return (
    <div style={{ padding: "20px 24px 24px", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Analytics Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1e293b", margin: 0 }}>Operational Intelligence</h2>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Analyzing 12.4k telemetry points across global fleet</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button 
            onClick={() => setShowFilters(true)}
            style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "10px 18px", borderRadius: 12, fontSize: 13, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 700, color: "#475569" }}
          >
            <Filter size={18} /> SEGMENT DATA
          </button>
          <button style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 12, fontSize: 13, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 700 }}>
            <Download size={18} /> GENERATE REPORT
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: 12, paddingBottom: 16, overflowX: "auto", borderBottom: "1px solid #e2e8f0", marginBottom: 24 }}>
        {[
          { id: "temp", label: "Temperature", icon: Thermometer },
          { id: "hum", label: "Humidity", icon: Droplets },
          { id: "perf", label: "Trip Performance", icon: Truck },
          { id: "route", label: "Route Analytics", icon: MapPin },
          { id: "cargo", label: "Cargo Safety", icon: Package },
          { id: "device", label: "IoT Health", icon: Zap },
          { id: "alerts", label: "Alert Density", icon: AlertTriangle },
          { id: "quality", label: "Data Quality", icon: Database },
          { id: "compliance", label: "Compliance", icon: ShieldCheck },
          { id: "insights", label: "Deep Insights", icon: Activity }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 16px", borderRadius: 10, background: activeTab === tab.id ? "#2563eb" : "transparent",
              color: activeTab === tab.id ? "#fff" : "#64748b", border: "none", fontSize: 12, fontWeight: 800,
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s"
            }}
          >
            <tab.icon size={16} /> {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main Dashboard Area */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
        {activeTab === "temp" && <TemperatureDashboard data={data.temperature} />}
        {activeTab === "hum" && <HumidityDashboard data={data.humidity} />}
        {activeTab === "perf" && <PerformanceDashboard data={data.performance} />}
        {activeTab === "route" && <RouteDashboard data={data.route} />}
        {activeTab === "cargo" && <CargoDashboard data={data.cargo} />}
        {activeTab === "device" && <DeviceDashboard data={data.device} />}
        {activeTab === "alerts" && <AlertDashboard data={data.alerts} />}
        {activeTab === "quality" && <DataQualityDashboard data={data.quality} />}
        {activeTab === "compliance" && <ComplianceDashboard data={data.compliance} />}
        {activeTab === "insights" && <InsightsDashboard />}
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 380, background: "#fff", boxShadow: "-10px 0 50px rgba(0,0,0,0.1)", zIndex: 1000, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 24, borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#1e293b", margin: 0 }}>Data Segments</h3>
            <button onClick={() => setShowFilters(false)} style={{ background: "#f8fafc", border: "none", borderRadius: 8, padding: 8, cursor: "pointer" }}><X size={20} /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <FilterSection title="Time Horizon">
              <SegmentOption label="Last 24 Hours" active />
              <SegmentOption label="Last 7 Days" />
              <SegmentOption label="Last 30 Days" />
            </FilterSection>
            <FilterSection title="Asset Class">
              <SegmentOption label="Pharmaceuticals" active />
              <SegmentOption label="Frozen Goods" />
            </FilterSection>
          </div>
          <div style={{ padding: 24, background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
            <button onClick={() => setShowFilters(false)} style={{ width: "100%", background: "#2563eb", color: "#fff", border: "none", padding: 14, borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>APPLY FILTERS</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-Dashboards ──

function TemperatureDashboard({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <MetricCard label="Avg Trip Temp" value="4.8°C" sub="+0.2° Deviation" color="#2563eb" />
        <MetricCard label="Breach Frequency" value="1.4%" sub="12 Trips Impacted" color="#ef4444" />
        <MetricCard label="Exposure Index" value="High Stability" sub="98.2 Score" color="#10b981" />
        <MetricCard label="Max Excursion" value="12.4°C" sub="Route: Delhi-MUM" color="#f59e0b" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        <ChartSection title="Temperature Variability vs Route Duration" drillable>
          <ResponsiveContainer width="100%" height={280}>
             <AreaChart data={data?.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" hide />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="temp" stroke="#2563eb" fill="#2563eb" fillOpacity={0.05} strokeWidth={3} />
             </AreaChart>
          </ResponsiveContainer>
        </ChartSection>
        <ChartSection title="Breach Distribution by Hub">
           <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data?.distribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                   {data?.distribution?.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
           </ResponsiveContainer>
        </ChartSection>
      </div>
    </div>
  );
}

function HumidityDashboard({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Avg Humidity" value="45.2%" sub="Within Safe Bounds" color="#06b6d4" />
          <MetricCard label="Moisture Risk" value="Low" sub="Optimum Stability" color="#10b981" />
          <MetricCard label="Compliance" value="99.4%" sub="Regulatory Standard" color="#2563eb" />
          <MetricCard label="Trips w/ Breach" value="2" sub="Last 30 Days" color="#ef4444" />
       </div>
       <ChartSection title="Humidity Trend Over Time">
          <ResponsiveContainer width="100%" height={300}>
             <LineChart data={[{h:44}, {h:45}, {h:46}, {h:44}, {h:45}, {h:47}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="h" stroke="#06b6d4" strokeWidth={3} dot={false} />
             </LineChart>
          </ResponsiveContainer>
       </ChartSection>
    </div>
  );
}

function PerformanceDashboard() {
  const data = [
    { name: "Total Trips", val: 420, color: "#2563eb" },
    { name: "Active", val: 45, color: "#7c3aed" },
    { name: "On Time", val: 380, color: "#10b981" },
    { name: "Delayed", val: 40, color: "#ef4444" }
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <ChartSection title="Fleet Performance Metrics">
         <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} />
               <YAxis axisLine={false} tickLine={false} />
               <Tooltip />
               <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
               </Bar>
            </BarChart>
         </ResponsiveContainer>
      </ChartSection>
    </div>
  );
}

function RouteDashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
       <ChartSection title="Most Frequent Routes">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
             <RouteItem origin="Mumbai" dest="Delhi" trips={142} score={98} />
             <RouteItem origin="Bangalore" dest="Chennai" trips={98} score={99} />
             <RouteItem origin="Pune" dest="Hyderabad" trips={86} score={92} />
             <RouteItem origin="Delhi" dest="Kolkata" trips={64} score={88} />
          </div>
       </ChartSection>
       <ChartSection title="Route Risk Score Heatmap">
          <div style={{ height: 300, background: "#f8fafc", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
             Relational Risk-Link Visualizer Loading...
          </div>
       </ChartSection>
    </div>
  );
}

function CargoDashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
       <ChartSection title="Volume by Cargo Category">
          <ResponsiveContainer width="100%" height={300}>
             <PieChart>
                <Pie data={[{n:'Pharma', v:40}, {n:'Frozen', v:30}, {n:'Dairy', v:20}, {n:'Elec', v:10}]} innerRadius={60} outerRadius={80} dataKey="v" nameKey="n">
                   <Cell fill="#2563eb" /><Cell fill="#7c3aed" /><Cell fill="#06b6d4" /><Cell fill="#f59e0b" />
                </Pie>
                <Tooltip />
                <Legend />
             </PieChart>
          </ResponsiveContainer>
       </ChartSection>
       <ChartSection title="Compliance Rate per Category">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
             <ComplianceBar label="Pharmaceuticals" val={99.8} />
             <ComplianceBar label="Frozen Goods" val={97.2} />
             <ComplianceBar label="Dairy Products" val={95.4} />
             <ComplianceBar label="Electronics" val={99.9} />
          </div>
       </ChartSection>
    </div>
  );
}

function AlertDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Total Alerts" value="42" sub="Last 24 Hours" color="#ef4444" />
          <MetricCard label="Avg Resolution" value="14m" sub="Industry Leading" color="#10b981" />
          <MetricCard label="Severity High" value="4" sub="Immediate Action" color="#ef4444" />
          <MetricCard label="System False Pos" value="0.2%" sub="Optimal Tuning" color="#64748b" />
       </div>
       <ChartSection title="Alert Volume over Time">
          <ResponsiveContainer width="100%" height={300}>
             <BarChart data={[{d:'Mon', v:4}, {d:'Tue', v:6}, {d:'Wed', v:2}, {d:'Thu', v:1}, {d:'Fri', v:9}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="d" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="val" fill="#ef4444" radius={[6, 6, 0, 0]} />
             </BarChart>
          </ResponsiveContainer>
       </ChartSection>
    </div>
  );
}

function DataQualityDashboard({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <MetricCard label="Data Freshness" value="12s" sub="Average Latency" color="#10b981" />
        <MetricCard label="Packet Loss" value="0.04%" sub="LTE Efficiency" color="#2563eb" />
        <MetricCard label="Accuracy Check" value="99.9%" sub="Verified Points" color="#7c3aed" />
        <MetricCard label="Ingestion Rate" value="42k/sec" sub="System Load" color="#64748b" />
      </div>
      <ChartSection title="Telemetry Ingestion Health">
         <div style={{ height: 250, display: "flex", gap: 10, alignItems: "flex-end", padding: "0 20px" }}>
            {[80, 85, 90, 88, 92, 95, 87, 85, 90, 99].map((v, i) => (
               <div key={i} style={{ flex: 1, height: `${v}%`, background: "#2563eb", borderRadius: "4px 4px 0 0", opacity: 0.2 + (v/100) }} />
            ))}
         </div>
      </ChartSection>
    </div>
  );
}

function DeviceDashboard({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Active TF10 Assets" value="2,482" sub="98% Utilization" color="#2563eb" />
          <MetricCard label="Battery Risk" value="42 Devices" sub="Below 15%" color="#ef4444" />
          <MetricCard label="Firmware Version" value="v4.2.0" sub="Latest Stable" color="#10b981" />
          <MetricCard label="Mean Time to Repair" value="4.2h" sub="Support Queue" color="#64748b" />
       </div>
       <ChartSection title="Device Uptime Distribution">
          <ResponsiveContainer width="100%" height={300}>
             <ScatterChart>
                <XAxis dataKey="x" name="st" unit="h" />
                <YAxis dataKey="y" name="ut" unit="%" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Devices" data={[{x:10, y:99}, {x:20, y:98}, {x:30, y:99.8}, {x:5, y:97}]} fill="#7c3aed" />
             </ScatterChart>
          </ResponsiveContainer>
       </ChartSection>
    </div>
  );
}

function ComplianceDashboard({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <ChartSection title="Global Cold-Chain Compliance Trend">
          <ResponsiveContainer width="100%" height={350}>
             <AreaChart data={[{p:98}, {p:97}, {p:98.5}, {p:99}, {p:98.8}, {p:99.2}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis hide />
                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="p" stroke="#10b981" fill="#10b981" fillOpacity={0.05} strokeWidth={4} />
             </AreaChart>
          </ResponsiveContainer>
       </ChartSection>
    </div>
  );
}

function InsightsDashboard() {
  return (
     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <ChartSection title="Predictive Multi-factor Risk Index">
           <div style={{ padding: 20 }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#2563eb" }}>94.2</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#64748b", marginTop: 8 }}>FLEET STABILITY SCORE</div>
              <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 16 }}>Based on historical weather patterns, roadway sensor data, and IoT telemetry.</p>
           </div>
        </ChartSection>
        <ChartSection title="Platform Usage & Scalability">
           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <MetaRow label="Peak Shipment Period" value="Mon 08:00 - 12:00" />
              <MetaRow label="Cargo Safety Index" value="99.98%" />
              <MetaRow label="Monitoring Coverage" value="100.00%" />
           </div>
        </ChartSection>
     </div>
  );
}

// ── Shared UI Components ──

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{ background: "#fff", padding: 22, borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: "#1e293b" }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: color, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function ChartSection({ title, children, drillable }) {
  return (
    <div style={{ background: "#fff", padding: 28, borderRadius: 24, border: "1px solid #e2e8f0", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", margin: 0 }}>{title}</h3>
        {drillable && (
          <button style={{ background: "#f8fafc", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 700, color: "#2563eb", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
            <MousePointer2 size={12} /> DRILL DOWN trips
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h4 style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: 16 }}>{title}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function SegmentOption({ label, active }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 10, border: active ? "2px solid #2563eb" : "1px solid #e2e8f0", background: active ? "#f0f7ff" : "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
      <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? "#2563eb" : "#475569" }}>{label}</span>
      {active && <Check size={16} color="#2563eb" />}
    </div>
  );
}

function RouteItem({ origin, dest, trips, score }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#f8fafc", borderRadius: 12, border: "1px solid #f1f5f9" }}>
       <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1e293b" }}>{origin} → {dest}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>{trips} Total Shipments</div>
       </div>
       <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: score > 95 ? "#10b981" : "#f59e0b" }}>{score}%</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>RELIABILITY</div>
       </div>
    </div>
  );
}

function ComplianceBar({ label, val }) {
  return (
    <div>
       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{label}</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#2563eb" }}>{val}%</span>
       </div>
       <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3 }}>
          <div style={{ height: "100%", width: `${val}%`, background: "#2563eb", borderRadius: 3 }} />
       </div>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
       <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
       <span style={{ fontSize: 13, fontWeight: 800, color: "#1e293b" }}>{value}</span>
    </div>
  );
}
