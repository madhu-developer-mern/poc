import { useState, useEffect } from "react";
import { 
  MapPin, Package, Clock, CheckCircle, Truck, AlertCircle, 
  Loader, Copy, Layers, Filter, Search, MoreVertical 
} from "lucide-react";
import { api } from "../lib/api";
import TripDetail from "./TripDetail";

const STATUS_CONFIG = {
  in_transit: { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", icon: Truck,        label: "In Transit" },
  loading:    { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: Loader,       label: "Loading"    },
  delivered:  { color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", icon: CheckCircle,  label: "Delivered"  },
  alert:      { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: AlertCircle,  label: "Alert"      },
};

export default function TripList({ onSelectTrip, setActive }) {
  const [filter, setFilter] = useState("all");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [search, setSearch] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await api.getCollection("trips");
      setTrips(data || []);
    } catch (err) {
      console.error("Failed to fetch trips", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = (trips || []).filter((t) => {
    const matchesFilter = filter === "all" || t.status === filter;
    const matchesSearch = t.id?.toLowerCase().includes(search.toLowerCase()) || 
                          t.origin?.toLowerCase().includes(search.toLowerCase()) ||
                          t.destination?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleClone = (e, trip) => {
    e.stopPropagation();
    // Logic to open CreateTrip with trip data as template
    localStorage.setItem("clone_trip_data", JSON.stringify(trip));
    setActive("create");
  };

  if (selectedTrip) {
    return <TripDetail trip={selectedTrip} onBack={() => setSelectedTrip(null)} />;
  }

  return (
    <div style={{ padding: "20px 24px 24px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h2 style={{ color: "#111827", fontSize: 18, fontWeight: 700, margin: 0 }}>Fleet Operations</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button 
              onClick={() => setActive && setActive("create")}
              style={{
                padding: "8px 16px", background: "#2563eb", border: "none",
                borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              }}
            >
              + Create Trip
            </button>
            <button 
              onClick={() => setShowBulkModal(true)}
              style={{
                padding: "8px 16px", background: "#fff", border: "1px solid #e2e8f0",
                borderRadius: 8, color: "#475569", fontSize: 13, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <Layers size={16} /> Bulk Create
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              placeholder="Search trips..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "6px 10px 6px 34px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", width: 220 }}
            />
          </div>
          <div style={{ display: "flex", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 2 }}>
            {["all", "in_transit", "alert", "delivered"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  background: filter === s ? "#f1f5f9" : "transparent",
                  border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer",
                  color: filter === s ? "#2563eb" : "#64748b",
                  fontSize: 12, fontWeight: filter === s ? 700 : 500,
                  textTransform: "capitalize",
                }}
              >
                {s === "all" ? "All" : s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>Loading trips...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 16, overflowY: "auto" }}>
          {filtered.map((trip) => {
            const cfg = STATUS_CONFIG[trip.status] || STATUS_CONFIG.in_transit;
            const StatusIcon = cfg.icon;
            const isAlert = trip.status === "alert";

            return (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                style={{
                  background: "#FFFFFF", border: `1px solid ${isAlert ? "#FECACA" : "#E9EDF5"}`,
                  borderRadius: 16, padding: "20px", cursor: "pointer",
                  transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  position: "relative"
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(100,116,139,0.12)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${cfg.border}` }}>
                      <StatusIcon size={20} color={cfg.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: "#1e293b", fontSize: 15 }}>{trip.id}</div>
                      <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700, marginTop: 2 }}>{trip.assignment?.vehicle || "Unassigned"}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <button 
                      onClick={(e) => handleClone(e, trip)}
                      title="Clone Trip"
                      style={{ padding: 8, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer", color: "#64748b" }}
                    >
                      <Copy size={16} />
                    </button>
                    <button style={{ padding: 8, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer", color: "#64748b" }}>
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>ORIGIN</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginTop: 4 }}>{trip.origin}</div>
                  </div>
                  <ChevronRight color="#e2e8f0" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>DESTINATION</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginTop: 4 }}>{trip.destination}</div>
                  </div>
                </div>

                {trip.status !== 'delivered' && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                      <span style={{ color: "#64748b" }}>LIVE PROGRESS</span>
                      <span style={{ color: "#2563eb" }}>{trip.progress}%</span>
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                      <div style={{ width: `${trip.progress}%`, height: "100%", background: isAlert ? "#ef4444" : "#2563eb", borderRadius: 3 }} />
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Package size={14} color="#94a3b8" />
                      <span style={{ fontSize: 12, color: "#64748b" }}>{trip.cargo?.type || "Standard"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Clock size={14} color="#94a3b8" />
                      <span style={{ fontSize: 12, color: "#64748b" }}>{trip.config?.samplingInterval}m sampling</span>
                    </div>
                  </div>
                  <span style={{ 
                    padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, 
                    background: cfg.bg, color: cfg.color
                  }}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#94a3b8" }}>
          <Truck size={48} strokeWidth={1} />
          <p>No active trips found matching your search.</p>
        </div>
      )}
      {showBulkModal && (
        <BulkCreateModal 
          onClose={() => setShowBulkModal(false)} 
          onSubmit={async (data) => {
            try {
              // Simulate bulk insertion
              for (const item of data) {
                await api.updateItem("trips", { ...item, status: "loading", startTime: new Date().toISOString(), progress: 0 });
              }
              fetchTrips();
              setShowBulkModal(false);
            } catch (err) {
              console.error("Bulk create failed", err);
            }
          }} 
        />
      )}
    </div>
  );
}

function BulkCreateModal({ onClose, onSubmit }) {
  const [data, setData] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", padding: 32, borderRadius: 20, width: 600, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>Bulk Trip Creation</h3>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>Paste trip data in JSON format to create multiple shipments at once.</p>
        <textarea 
          placeholder='[{"id": "TRIP-X", "origin": "Mumbai", "destination": "Delhi"}, ...]'
          value={data}
          onChange={e => setData(e.target.value)}
          style={{ width: "100%", height: 300, border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, fontSize: 13, fontFamily: "monospace", outline: "none", background: "#f8fafc" }}
        />
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button 
            disabled={!data}
            onClick={() => {
              try {
                const parsed = JSON.parse(data);
                onSubmit(Array.isArray(parsed) ? parsed : [parsed]);
              } catch (e) { alert("Invalid JSON format"); }
            }}
            style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: data ? "pointer" : "not-allowed", opacity: data ? 1 : 0.7 }}
          >
            Create All Trips
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

