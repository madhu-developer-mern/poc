import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  GoogleMap, useJsApiLoader, DirectionsRenderer, OverlayView,
} from "@react-google-maps/api";
import {
  ArrowLeft, MapPin, Clock, Package, Thermometer, Droplets,
  Gauge, Zap, Wind, Activity, AlertTriangle, CheckCircle, Truck,
  Navigation, Phone, User, ChevronRight, Pause, Play, Power, Settings, ShieldCheck,
  Search, RefreshCw, MoreVertical, Flag, Coffee, Signal
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";
import { GOOGLE_MAPS_LOADER_OPTIONS } from "../lib/googleMaps";
import { api } from "../lib/api";

const STATUS_CFG = {
  in_transit: { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", label: "In Transit"  },
  loading:    { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", label: "Loading"     },
  delivered:  { color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", label: "Delivered"   },
  alert:      { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", label: "Alert"       },
  paused:     { color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0", label: "Paused"      }
};

export default function TripDetail({ trip: initialTrip, onBack }) {
  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);
  const [trip, setTrip] = useState(initialTrip);
  const [direction, setDirection] = useState(null);
  const [activeTab, setActiveTab] = useState("live");
  const [isPaused, setIsPaused] = useState(trip?.status === "paused");
  const [showConfig, setShowConfig] = useState(false);

  const [graphData, setGraphData] = useState([
    { time: "10:00", temp: 4.2, hum: 45 },
    { time: "10:15", temp: 4.5, hum: 46 },
    { time: "10:30", temp: 5.1, hum: 48 },
    { time: "10:45", temp: 4.8, hum: 47 },
    { time: "11:00", temp: 4.2, hum: 45 },
    { time: "11:15", temp: 4.4, hum: 44 },
  ]);

  useEffect(() => {
    if (!isLoaded || !trip.originCoords || !trip.destCoords) return;
    new window.google.maps.DirectionsService().route(
      {
        origin: trip.originCoords,
        destination: trip.destCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") setDirection(result);
      }
    );
  }, [isLoaded, trip]);

  const handleAction = async (action) => {
    const updatedEvents = [...(trip.events || []), { time: new Date().toISOString(), event: `Manual Command: ${action}`, type: "info" }];
    const newStatus = action === 'pause' ? 'paused' : action === 'resume' ? 'in_transit' : action === 'end' ? 'delivered' : trip.status;
    
    setTrip(t => ({ ...t, status: newStatus, events: updatedEvents }));
    if (action === 'pause') setIsPaused(true);
    if (action === 'resume') setIsPaused(false);
  };

  const statusCfg = STATUS_CFG[trip.status] || STATUS_CFG.in_transit;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Dynamic Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#475569" }}>
          <ArrowLeft size={18} /> BACK
        </button>
        <div style={{ height: 24, width: 1, background: "#e2e8f0" }} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1e293b", margin: 0 }}>{trip.id}</h2>
            <span style={{ background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}`, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>
              {statusCfg.label}
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>GTW: {trip.gatewayId || "GTW-PRO-01"}</span>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>TF10: {trip.sensorId || "TF10-422"}</span>
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 24 }}>
          <LiveKpi icon={Clock} label="ETA RECALC" value="22:45" sub="ON TIME" />
          <LiveKpi icon={Activity} label="STABILITY INDEX" value="98.5%" sub="OPTIMAL" />
          <LiveKpi icon={Navigation} label="DIST REMAINING" value="142 KM" sub="4.2H TO GO" />
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Monitoring & Controls Panel */}
        <div style={{ width: 440, borderRight: "1px solid #e2e8f0", background: "#fff", display: "flex", flexDirection: "column" }}>
          
          <div style={{ padding: 20, borderBottom: "1px solid #f1f5f9", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {isPaused ? (
              <OperationBtn icon={Play} label="RESUME TRIP" color="#16a34a" onClick={() => handleAction("resume")} />
            ) : (
              <OperationBtn icon={Pause} label="PAUSE TRIP" color="#64748b" onClick={() => handleAction("pause")} />
            )}
            <OperationBtn icon={Power} label="FORCE END" color="#dc2626" onClick={() => handleAction("end")} />
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {/* Real-time Environment */}
            <h3 style={{ fontSize: 13, fontWeight: 800, color: "#94a3b8", letterSpacing: 1, marginBottom: 16 }}>LIVE TELEMETRY</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <DataTile icon={Thermometer} label="TEMPERATRE" value="4.2°C" unit="°C" status={trip.status === 'alert' ? 'error' : 'ok'} />
              <DataTile icon={Droplets} label="HUMIDITY" value="45.2" unit="%" status="ok" />
              <DataTile icon={Zap} label="BATT LEVEL" value="84" unit="%" status="ok" />
              <DataTile icon={Signal} label="SIGNAL STRENGTH" value="-72" unit="dBm" status="ok" />
            </div>

            {/* Safety Monitoring Scorecards */}
            <div style={{ marginTop: 24, padding: 20, background: "#f8fafc", borderRadius: 16, border: "1px solid #f1f5f9" }}>
              <h4 style={{ fontSize: 12, fontWeight: 800, color: "#64748b", marginBottom: 16 }}>CARGO SAFETY ANALYSIS</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <ProgressBar label="Temp Exposure Duration" value={15} max={100} unit="min" color="#f59e0b" />
                <ProgressBar label="Humidity Exposure" value={0} max={100} unit="min" color="#06b6d4" />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Compliance Outlook</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#16a34a" }}>HIGH (99%)</span>
                </div>
              </div>
            </div>

            {/* Graphs */}
            <div style={{ marginTop: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>ENVIRONMENT LOG</h3>
                <div style={{ display: "flex", gap: 4 }}>
                   <div style={{ width: 8, height: 8, background: "#2563eb", borderRadius: "50%" }} />
                   <div style={{ width: 8, height: 8, background: "#06b6d4", borderRadius: "50%" }} />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={graphData}>
                  <defs>
                    <linearGradient id="colorT" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip cursor={{ stroke: "#e2e8f0" }} contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="temp" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorT)" />
                  <Area type="monotone" dataKey="hum" stroke="#06b6d4" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Event Log */}
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: "#94a3b8", letterSpacing: 1, marginBottom: 20 }}>AUTOMATED EVENT LOG</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, borderLeft: "2px solid #f1f5f9", marginLeft: 8, paddingLeft: 24 }}>
                {(trip.events || []).map((ev, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: -31, top: 4, width: 12, height: 12, borderRadius: "50%", background: "#fff", border: `3px solid ${ev.type === 'warning' ? '#ef4444' : '#2563eb'}` }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{ev.event}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{new Date(ev.time).toLocaleTimeString()} · {ev.location || "Fleet Geo-node"}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mid-Trip Management */}
            <div style={{ marginTop: 40, padding: 24, background: "#f8fafc", borderRadius: 20, border: "1px dashed #cbd5e1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <Settings size={18} color="#64748b" />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#334155", margin: 0 }}>OPERATIONAL CONTROLS</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <ManageLink icon={Flag} label="Modify Target Destination" />
                <ManageLink icon={Thermometer} label="Adjust Threshold Limits" />
                <ManageLink icon={RefreshCw} label="Reassign IoT Asset / Gateway" />
                <ManageLink icon={Clock} label="Extend Expected Arrival" />
                <ManageLink icon={MoreVertical} label="Add Operational Audit Note" />
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Map Display */}
        <div style={{ flex: 1, position: "relative" }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{ styles: DARK_MODERN_STYLE, disableDefaultUI: true, zoomControl: true }}
              onLoad={(map) => {
                const bounds = new window.google.maps.LatLngBounds();
                if (trip.originCoords) bounds.extend(trip.originCoords);
                if (trip.destCoords) bounds.extend(trip.destCoords);
                map.fitBounds(bounds, { top: 100, bottom: 100, left: 100, right: 100 });
              }}
            >
              {direction && <DirectionsRenderer directions={direction} options={{ polylineOptions: { strokeColor: statusCfg.color, strokeOpacity: 0.8, strokeWeight: 6 } }} />}
            </GoogleMap>
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>Booting Tactical Grid...</div>
          )}

          {/* Active Alert Interaction */}
          {trip.status === "alert" && (
            <div style={{ position: "absolute", top: 30, right: 30, background: "#fff", padding: 24, borderRadius: 20, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", width: 340, border: "2px solid #ef4444" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#ef4444", marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900 }}>TEMPERATURE VIOLATION</div>
                  <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>EXCEEDED 8.0°C FOR 12M</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", margin: "12px 0 20px" }}>Shipment stability is compromised. Immediate intervention required at current location.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button onClick={() => setTrip(t => ({ ...t, status: 'in_transit' }))} style={{ padding: 12, background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>ACKNOWLEDGE</button>
                <button style={{ padding: 12, background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>INVESTIGATE</button>
              </div>
              <button style={{ width: "100%", marginTop: 10, padding: 12, background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>ESCALATE TO REGIONAL MANAGER</button>
            </div>
          )}

          {/* Logistics Summary Overlay */}
          <div style={{ position: "absolute", bottom: 40, left: 40, background: "rgba(15,23,42,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", padding: 24, borderRadius: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.3)", width: 380 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
               <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>CURRENT TRANSIT PROGRESS</div>
               <div style={{ fontSize: 12, fontWeight: 800, color: "#2563eb" }}>64%</div>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, marginBottom: 20 }}>
               <div style={{ height: "100%", width: "64%", background: "#2563eb", borderRadius: 3 }} />
            </div>
            <div style={{ display: "flex", gap: 24 }}>
               <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 800 }}>DWELL TIME AT STOP</div>
                  <div style={{ fontSize: 16, color: "#fff", fontWeight: 800, marginTop: 4 }}>00:42 PM</div>
               </div>
               <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 800 }}>NEXT NODE ETA</div>
                  <div style={{ fontSize: 16, color: "#fff", fontWeight: 800, marginTop: 4 }}>18:30 PM</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── UI Components ──

function LiveKpi({ icon: Icon, label, value, sub }) {
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 9, fontWeight: 800, color: "#94a3b8", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", margin: "2px 0" }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 800, color: "#2563eb" }}>{sub}</div>
    </div>
  );
}

function OperationBtn({ icon: Icon, label, color, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: 14, borderRadius: 12, background: "#fff", border: "2px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", transition: "all 0.2s" }}>
      <Icon size={18} color={color} />
      <span style={{ fontSize: 12, fontWeight: 800, color: "#1e293b" }}>{label}</span>
    </button>
  );
}

function DataTile({ icon: Icon, label, value, unit, status }) {
  const isError = status === 'error';
  return (
    <div style={{ background: isError ? "#fef2f2" : "#f8fafc", padding: 16, borderRadius: 16, border: `1px solid ${isError ? "#fecaca" : "#f1f5f9"}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Icon size={14} color={isError ? "#ef4444" : "#64748b"} />
        <span style={{ fontSize: 9, fontWeight: 900, color: "#94a3b8", letterSpacing: 0.5 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: isError ? "#ef4444" : "#1e293b" }}>{value}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>{unit}</span>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, max, unit, color }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: color }}>{value}{unit}</span>
      </div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function ManageLink({ icon: Icon, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#fff", borderRadius: 10, border: "1px solid #f1f5f9", cursor: "pointer" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        <Icon size={16} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>{label}</span>
      <ChevronRight size={14} color="#cbd5e1" style={{ marginLeft: "auto" }} />
    </div>
  );
}

const DARK_MODERN_STYLE = [
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "all", elementType: "labels.text.stroke", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9b2a6" }] },
  { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#cbd5e1" }] }
];
