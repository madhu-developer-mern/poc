import { useMemo, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { SHIPMENTS, TRUCKS, getShipmentById, getTruckById, getHistoryForShipment } from "../data/mockData";
import TruckMap from "./TruckMap";

function formatMinutes(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

export default function History() {
  const [selectedShipmentId, setSelectedShipmentId] = useState(SHIPMENTS[0]?.id || "");
  const [minutesBack, setMinutesBack] = useState(30);
  const [fullScreen, setFullScreen] = useState(false);

  const shipment = useMemo(() => getShipmentById(selectedShipmentId), [selectedShipmentId]);
  const selectedTruck = useMemo(() => (shipment ? getTruckById(shipment.truckId) : null), [shipment]);
  const historyPoints = useMemo(
    () => (shipment ? getHistoryForShipment(shipment.id) : []),
    [shipment]
  );

  // In this demo, TruckMap already accumulates an actual path in-memory while the app runs.
  // "History" here is a UI that lets you focus on one truck + a time window.
  return (
    <div style={{
      padding: fullScreen ? 0 : "20px 24px 24px",
      height: fullScreen ? "calc(100vh - 0px)" : "calc(100vh - 120px)",
      display: "flex",
      flexDirection: "column",
      gap: 16,
    }}>
      <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0 }}>
        <div style={{
          flex: 1, minHeight: 0, borderRadius: 16, overflow: "hidden",
          border: "1px solid #E9EDF5",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          position: "relative",
          ...(fullScreen ? { borderRadius: 0, border: "none", boxShadow: "none" } : {}),
        }}>
          <button
            onClick={() => setFullScreen((v) => !v)}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 20,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #E9EDF5",
              borderRadius: 12,
              padding: "8px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
              color: "#111827",
              fontWeight: 700,
              fontSize: 12,
              backdropFilter: "blur(8px)",
            }}
          >
            {fullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {fullScreen ? "Exit" : "Full view"}
          </button>

          <TruckMap
            selectedTruck={selectedTruck}
            showFleetRouteGuides={false}
            showOnlySelectedTruck
            onSelectTruck={(t) => {
              if (!t) return;
              const match = SHIPMENTS.find((s) => s.truckId === t.id);
              if (match) setSelectedShipmentId(match.id);
            }}
          />
        </div>

        {!fullScreen && (
        <div style={{ width: 360, display: "flex", flexDirection: "column", gap: 12, overflow: "auto" }}>
          <div style={{
            background: "#FFFFFF", border: "1px solid #E9EDF5",
            borderRadius: 14, padding: 14,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              Shipments History
            </div>
            <input
              placeholder="Search by shipment, truck, city..."
              onChange={(e) => {
                const q = e.target.value.toLowerCase();
                const match = SHIPMENTS.find(
                  (s) =>
                    s.id.toLowerCase().includes(q) ||
                    s.truckId.toLowerCase().includes(q) ||
                    s.originCity.toLowerCase().includes(q) ||
                    s.destinationCity.toLowerCase().includes(q)
                );
                if (match) setSelectedShipmentId(match.id);
              }}
              style={{
                width: "100%",
                border: "1px solid #E9EDF5",
                borderRadius: 10,
                padding: "10px 12px",
                outline: "none",
                marginBottom: 10,
              }}
            />
            <div style={{ maxHeight: 220, overflow: "auto", display: "grid", gap: 6 }}>
              {SHIPMENTS.map((s) => {
                const isActive = s.id === selectedShipmentId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedShipmentId(s.id)}
                    style={{
                      textAlign: "left",
                      borderRadius: 10,
                      border: isActive ? "1px solid #2563EB" : "1px solid #E9EDF5",
                      background: isActive ? "#EEF2FF" : "#FFFFFF",
                      padding: "8px 10px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{s.id}</span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>{s.status.replace("_", " ")}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                      {s.originCity} → {s.destinationCity}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{
            background: "#FFFFFF", border: "1px solid #E9EDF5",
            borderRadius: 14, padding: 14,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ color: "#111827", fontWeight: 800, fontSize: 14 }}>Playback window</div>
              <div style={{ color: "#2563EB", fontWeight: 800, fontSize: 12 }}>{formatMinutes(minutesBack)}</div>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={minutesBack}
              onChange={(e) => setMinutesBack(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, color: "#9CA3AF", fontSize: 11 }}>
              <span>10m</span><span>120m</span>
            </div>
            <div style={{ marginTop: 12, color: "#6B7280", fontSize: 12, lineHeight: 1.5 }}>
              Demo note: this builds trail history while the app runs. To persist history, we’d store points in backend/DB and query by time.
            </div>
          </div>

          {shipment && selectedTruck && (
            <div style={{
              background: "#FFFFFF", border: "1px solid #E9EDF5",
              borderRadius: 14, padding: 14,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{ color: "#111827", fontWeight: 800, fontSize: 14, marginBottom: 8 }}>
                {shipment.id} · {selectedTruck.vehicle}
              </div>
              <div style={{ color: "#6B7280", fontSize: 12, marginBottom: 6 }}>
                Truck {selectedTruck.id} · {selectedTruck.driver}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                {[
                  ["Window", formatMinutes(minutesBack)],
                  ["Distance", `${shipment.distanceKm} km`],
                  ["Progress", `${shipment.progress}%`],
                  ["Cold chain", shipment.coldChain ? "Yes" : "No"],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ color: "#9CA3AF", fontSize: 10 }}>{k}</div>
                    <div style={{ color: "#111827", fontWeight: 800, fontSize: 14, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, color: "#6B7280", fontSize: 12, lineHeight: 1.5 }}>
                Route: <strong style={{ color: "#111827" }}>{shipment.origin}</strong> →{" "}
                <strong style={{ color: "#111827" }}>{shipment.destination}</strong>
              </div>
              {historyPoints.length > 0 && (
                <div style={{ marginTop: 8, color: "#9CA3AF", fontSize: 11 }}>
                  Recorded points: {historyPoints.length}
                </div>
              )}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

