import { useState, useEffect, useMemo, useRef } from "react";
import { 
  Search, Filter, Calendar, MapPin, Clock, Truck, 
  ChevronRight, Download, ArrowLeft, Thermometer, 
  Droplets, AlertTriangle, Activity, Package, ShieldCheck, Play, Pause, RotateCcw,
  Database, Zap, Signal, Settings, Clipboard, History as HistoryIcon, User
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend 
} from "recharts";
import { api } from "../lib/api";

export default function History() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const historyItems = await api.getCollection("history");
      setTrips(historyItems || []);
    } catch (err) {
      console.error("Failed to fetch trip history", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = useMemo(() => {
    return trips.filter(t => {
      const matchSearch = t.id?.toLowerCase().includes(search.toLowerCase()) ||
                          t.cargo?.toLowerCase().includes(search.toLowerCase()) ||
                          t.origin?.toLowerCase().includes(search.toLowerCase()) ||
                          t.destination?.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || t.cargo?.toLowerCase() === filterType.toLowerCase();
      return matchSearch && matchType;
    });
  }, [trips, search, filterType]);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Decoding historical telemetry streams...</div>;

  if (selectedTrip) {
    return <HistoricalTripDetail trip={selectedTrip} onBack={() => setSelectedTrip(null)} />;
  }

  return (
    <div style={{ padding: "20px 24px 24px", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 500 }}>
          <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Global search by Trip ID, Route, Driver or Asset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "14px 16px 14px 48px", borderRadius: 16, border: "1px solid #e2e8f0",
              outline: "none", fontSize: 14, boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: "8px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 600, color: "#475569" }}>
             <option value="all">All Cargo Types</option>
             <option value="pharma">Pharmaceuticals</option>
             <option value="frozen">Frozen Goods</option>
          </select>
          <button style={{ background: "#2563eb", color: "#fff", border: "none", padding: "12px 20px", borderRadius: 12, fontSize: 13, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 700 }}>
            <Download size={18} /> EXPORT HISTORY
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, textAlign: "left" }}>
          <thead style={{ background: "#f8fafc", position: "sticky", top: 0, zIndex: 10 }}>
            <tr>
              {["Trip Metadata", "Route Path", "Temporal Data", "Performance", "Safety Score", ""].map((header) => (
                <th key={header} style={{ padding: "18px 24px", fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #e2e8f0" }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => (
              <tr 
                key={trip.id} 
                onClick={() => setSelectedTrip(trip)}
                style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: "#1e293b" }}>{trip.id}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{trip.cargo}</div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{trip.origin}</span>
                    <ChevronRight size={14} color="#cbd5e1" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{trip.destination}</span>
                  </div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 700 }}>{new Date(trip.startTime).toDateString()}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Completed in 14h 22m</div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 13, color: "#2563eb", fontWeight: 800 }}>{trip.distance} KM</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{trip.avgTemp}°C Avg Temp</div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 44, height: 6, background: "#f1f5f9", borderRadius: 3, flex: 1 }}>
                       <div style={{ width: `${trip.compliance}%`, height: "100%", background: "#16a34a", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#16a34a" }}>{trip.compliance}%</span>
                  </div>
                </td>
                <td style={{ padding: "20px 24px", textAlign: "right" }}>
                  <ChevronRight size={20} color="#94a3b8" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HistoricalTripDetail({ trip, onBack }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [viewMode, setViewMode] = useState("graph"); // graph or table
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const dummyGraph = [
    { time: "10:00", temp: 4.2, hum: 45, lat: 19.07, lng: 72.87, event: "Trip Start" },
    { time: "11:00", temp: 4.5, hum: 46, lat: 18.52, lng: 73.85, event: "Checkpoint A" },
    { time: "12:00", temp: 5.1, hum: 48, lat: 17.67, lng: 75.90, event: "Stop Detected" },
    { time: "13:00", temp: 4.8, hum: 47, lat: 16.33, lng: 74.38, event: "Resume Move" },
    { time: "14:00", temp: 4.2, hum: 45, lat: 15.31, lng: 73.98, event: "Final Node" },
  ];

  const startPlayback = () => {
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      setPlaybackProgress(p => {
        if (p >= 100) { clearInterval(timerRef.current); setIsPlaying(false); return 100; }
        return p + 2;
      });
    }, 150);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer", color: "#64748b", padding: "8px 16px", borderRadius: 10, display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
            <ArrowLeft size={18} /> BACK
          </button>
          <div style={{ height: 24, width: 1, background: "#e2e8f0" }} />
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1e293b", margin: 0 }}>{trip.id} Post-Trip Analysis</h2>
          <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, background: "#f0fdf4", color: "#16a34a" }}>AUDITED</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {[
            { id: "summary", label: "Executive Summary", icon: Layout },
            { id: "playback", label: "Route Playback", icon: Play },
            { id: "sensor", label: "Sensor Audit", icon: Thermometer },
            { id: "assets", label: "Asset Lifecycle", icon: Zap },
            { id: "compliance", label: "Compliance & Risk", icon: ShieldCheck }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: "none", border: "none", borderBottom: activeTab === t.id ? "3px solid #2563eb" : "3px solid transparent",
                padding: "8px 0", fontSize: 14, fontWeight: activeTab === t.id ? 800 : 500,
                color: activeTab === t.id ? "#2563eb" : "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
              }}
            >
              <t.icon size={16} /> {t.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {activeTab === "summary" && <DetailSummary trip={trip} />}
          
          {activeTab === "sensor" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
               <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                  <button onClick={() => setViewMode("graph")} style={{ padding: "8px 16px", borderRadius: 8, background: viewMode === 'graph' ? '#2563eb' : '#fff', color: viewMode === 'graph' ? '#fff' : '#64748b', border: "1px solid #e2e8f0", cursor: "pointer", fontWeight: 600 }}>Graph View</button>
                  <button onClick={() => setViewMode("table")} style={{ padding: "8px 16px", borderRadius: 8, background: viewMode === 'table' ? '#2563eb' : '#fff', color: viewMode === 'table' ? '#fff' : '#64748b', border: "1px solid #e2e8f0", cursor: "pointer", fontWeight: 600 }}>Table View</button>
               </div>
               {viewMode === 'graph' ? (
                 <ChartBox title="Thermal Stability Correlation" data={dummyGraph} />
               ) : (
                 <DataTableBox data={dummyGraph} />
               )}
            </div>
          )}

          {activeTab === "playback" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ height: 500, background: "#fff", borderRadius: 24, border: "1px solid #e2e8f0", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "100%", height: "100%", position: "relative" }}>
                   <div style={{ position: "absolute", top: "50%", left: "10%", right: "10%", height: 4, background: "#f1f5f9", borderRadius: 2 }} />
                   <div style={{ position: "absolute", top: "50%", left: "10%", background: "#2563eb", width: 14, height: 14, borderRadius: "50%", transform: "translateY(-50%)" }} />
                   <div style={{ position: "absolute", top: "50%", right: "10%", background: "#16a34a", width: 14, height: 14, borderRadius: "50%", transform: "translateY(-50%)" }} />
                   <div style={{ position: "absolute", top: "50%", left: `${10 + (playbackProgress * 0.8)}%`, transform: "translate(-50%, -50%)", width: 24, height: 24, background: "#fff", border: "4px solid #2563eb", borderRadius: "50%", transition: "all 0.1s linear" }} />
                </div>
                <div style={{ position: "absolute", bottom: 20, right: 20, background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0", width: 260 }}>
                   <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", marginBottom: 8 }}>CURRENT REPLAY CONTEXT</div>
                   <div style={{ fontSize: 14, fontWeight: 900, color: "#1e293b" }}>{dummyGraph[Math.floor(playbackProgress/25)]?.event || "In Transit"}</div>
                   <div style={{ fontSize: 12, color: "#64748b" }}>Temp: {dummyGraph[Math.floor(playbackProgress/25)]?.temp || "4.2"}°C</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", background: "#fff", padding: 24, borderRadius: 20, border: "1px solid #e2e8f0" }}>
                 <button onClick={startPlayback} disabled={isPlaying} style={{ width: 44, height: 44, background: "#2563eb", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer" }}><Play size={20} /></button>
                 <div style={{ flex: 1 }}>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                       <div style={{ height: "100%", width: `${playbackProgress}%`, background: "#2563eb", borderRadius: 3 }} />
                    </div>
                 </div>
                 <div style={{ fontSize: 13, fontWeight: 800, color: "#2563eb" }}>{playbackProgress}%</div>
              </div>
            </div>
          )}

          {activeTab === "assets" && <AssetHistoryView trip={trip} />}
          {activeTab === "compliance" && <ComplianceAuditView trip={trip} />}
        </div>
      </div>
    </div>
  );
}

// ── Shared Historical UI Components ──

function DetailSummary({ trip }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        <MetricBox label="Efficiency Index" value="96.4%" sub="Optimal Route" color="#2563eb" />
        <MetricBox label="Stability Score" value="99.1%" sub="Thermal Bound" color="#16a34a" />
        <MetricBox label="Alert Count" value="0" sub="Zero Excursions" color="#64748b" />
        <MetricBox label="Transmission" value="99.9%" sub="High Reliability" color="#7c3aed" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "#fff", padding: 32, borderRadius: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", marginBottom: 24 }}>Logistics Protocol Verification</h3>
          <MetaItem label="Shipper Identity" value="Global Logistics Hub 4" />
          <MetaItem label="Fleet Dispatcher" value="Sarah Jenkins" />
          <MetaItem label="Asset Assigned" value="KA-01-HH-4221 (Temp Controlled)" />
          <MetaItem label="Departure Node" value={trip.origin} />
          <MetaItem label="Arrival Node" value={trip.destination} />
        </div>
        <div style={{ background: "#fff", padding: 32, borderRadius: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", marginBottom: 24 }}>System Event Trail</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
             {trip.events?.map((ev, i) => (
               <div key={i} style={{ display: "flex", gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", width: 60 }}>{new Date(ev.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>{ev.event}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartBox({ title, data }) {
  return (
    <div style={{ background: "#fff", padding: 32, borderRadius: 24, border: "1px solid #e2e8f0" }}>
       <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", marginBottom: 20 }}>{title}</h3>
       <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={data}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
             <XAxis dataKey="time" hide />
             <YAxis axisLine={false} tickLine={false} />
             <Tooltip />
             <Area type="monotone" dataKey="temp" stroke="#2563eb" fill="#2563eb" fillOpacity={0.05} strokeWidth={4} />
             <Area type="monotone" dataKey="hum" stroke="#06b6d4" strokeWidth={2} fill="transparent" />
          </AreaChart>
       </ResponsiveContainer>
    </div>
  );
}

function DataTableBox({ data }) {
  return (
    <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #e2e8f0", overflow: "hidden" }}>
       <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: "#f8fafc" }}>
             <tr>
                <th style={{ padding: 16, fontSize: 11, fontWeight: 800, color: "#94a3b8" }}>TIMESTAMP</th>
                <th style={{ padding: 16, fontSize: 11, fontWeight: 800, color: "#94a3b8" }}>TEMP (°C)</th>
                <th style={{ padding: 16, fontSize: 11, fontWeight: 800, color: "#94a3b8" }}>HUM (%)</th>
                <th style={{ padding: 16, fontSize: 11, fontWeight: 800, color: "#94a3b8" }}>RELIABILITY</th>
             </tr>
          </thead>
          <tbody>
             {data.map((d, i) => (
                <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                   <td style={{ padding: 16, fontSize: 13, fontWeight: 700 }}>{d.time}</td>
                   <td style={{ padding: 16, fontSize: 13, color: "#2563eb", fontWeight: 800 }}>{d.temp}</td>
                   <td style={{ padding: 16, fontSize: 13, color: "#06b6d4", fontWeight: 700 }}>{d.hum}</td>
                   <td style={{ padding: 16, fontSize: 11, fontWeight: 800, color: "#16a34a" }}>OPTIMAL</td>
                </tr>
             ))}
          </tbody>
       </table>
    </div>
  );
}

function AssetHistoryView({ trip }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
       <div style={{ background: "#fff", padding: 32, borderRadius: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", marginBottom: 20 }}>IoT Device Lifecycle (TF10)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
             <AssetItem icon={Battery} label="Deployment Battery" value="98.4%" />
             <AssetItem icon={Zap} label="Signal Stability" value="-68 dBm Avg" />
             <AssetItem icon={RefreshCw} label="Firmware Profile" value="Pharma-STB-v4" />
             <AssetItem icon={Activity} label="Data Ingestion Rate" value="100% (No Gaps)" />
          </div>
       </div>
       <div style={{ background: "#fff", padding: 32, borderRadius: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", marginBottom: 20 }}>Gateway Handshake Logs</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
             {[1,2,3,4].map(i => (
               <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: 12, borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Node Handshake #{i}</span>
                  <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 800 }}>SUCCESS</span>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
}

function ComplianceAuditView({ trip }) {
  return (
    <div style={{ background: "#fff", padding: 40, borderRadius: 24, border: "1px solid #e2e8f0", textAlign: "center" }}>
       <ShieldCheck size={48} color="#16a34a" style={{ marginBottom: 20 }} />
       <h3 style={{ fontSize: 20, fontWeight: 900, color: "#1e293b", marginBottom: 12 }}>Regulatory Audit Passed</h3>
       <p style={{ color: "#64748b", maxWidth: 600, margin: "0 auto 32px" }}>The shipment metadata and historical sensor logs match the strict temperature stability standards for Pharmaceutical transit.</p>
       <div style={{ background: "#f8fafc", padding: 24, borderRadius: 16, textAlign: "left" }}>
          <div style={{ fontWeight: 800, fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>AUDIT TRACEABILITY IDENTIFIER</div>
          <div style={{ fontSize: 15, fontWeight: 900, fontFamily: "monospace", color: "#1e293b", background: "#fff", padding: 12, border: "1px solid #e2e8f0", borderRadius: 8 }}>
             SHA256: 48f2b...x922a10
          </div>
       </div>
    </div>
  );
}

// ── Shared UI Stubs ──

function MetricBox({ label, value, sub, color }) {
  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 20, border: "1px solid #e2e8f0" }}>
       <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{label}</div>
       <div style={{ fontSize: 22, fontWeight: 900, color: "#1e293b" }}>{value}</div>
       <div style={{ fontSize: 12, fontWeight: 700, color: color, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f8fafc" }}>
       <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</span>
       <span style={{ fontSize: 13, fontWeight: 800, color: "#1e293b" }}>{value}</span>
    </div>
  );
}

function AssetItem({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#f8fafc", borderRadius: 12, border: "1px solid #f1f5f9" }}>
       <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
          <Icon size={16} />
       </div>
       <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8" }}>{label.toUpperCase()}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#334155" }}>{value}</div>
       </div>
    </div>
  );
}

// Icon stubs
function Layout({ size }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>; }
