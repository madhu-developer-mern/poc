import { useState, useEffect, useRef, useMemo } from "react";
import { 
  X, Check, Plus, ChevronDown, Info, ShieldCheck, 
  Battery, Signal, Thermometer, Droplets, MapPin, 
  Truck, User, Package, Settings, Clipboard, AlertCircle, Trash2, Clock, Activity, Navigation,
  CloudLightning, AlertTriangle, TrendingUp, History
} from "lucide-react";
import { api } from "../lib/api";

const CATEGORY_OPTIONS = ["Cold Chain", "Pharmaceuticals", "Frozen Good", "Dairy", "Electronics"];

export default function CreateTrip({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validationStage, setValidationStage] = useState(null);
  const [validations, setValidations] = useState({
    battery: null,
    connectivity: null,
    sensor: null,
    reading: null,
    signal: null,
    firmware: null,
    calibration: null,
    sim: null,
    duration: null
  });

  const [form, setForm] = useState({
    tripId: `TRIP-${Date.now().toString().slice(-6)}`,
    origin: "",
    destination: "",
    stops: [],
    cargoType: "",
    vehicleId: "",
    driverId: "",
    gatewayId: "",
    sensorId: "",
    tempLimitMin: 2,
    tempLimitMax: 8,
    humLimitMin: 30,
    humLimitMax: 60,
    samplingInterval: 15,
    uploadFrequency: 30,
    geofenceRadius: 500,
    deviationTolerance: 1000,
    maxStopDuration: 45,
    allowedStops: [],
    notes: "",
    autoStart: true,
    autoEnd: true
  });

  useEffect(() => {
    const cloneData = localStorage.getItem("clone_trip_data");
    if (cloneData) {
      const parsed = JSON.parse(cloneData);
      setForm(prev => ({
        ...prev,
        origin: parsed.origin || "",
        destination: parsed.destination || "",
        cargoType: parsed.cargo?.type || "",
        vehicleId: parsed.assignment?.vehicle || "",
        gatewayId: parsed.assignment?.gateway || "",
        tempLimitMin: parsed.cargo?.limits?.tempMin || 2,
        tempLimitMax: parsed.cargo?.limits?.tempMax || 8,
      }));
      localStorage.removeItem("clone_trip_data");
    }
  }, []);

  const updateForm = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const addStop = () => updateForm("stops", [...form.stops, ""]);
  const removeStop = (idx) => updateForm("stops", form.stops.filter((_, i) => i !== idx));
  const updateStop = (idx, val) => {
    const newStops = [...form.stops];
    newStops[idx] = val;
    updateForm("stops", newStops);
  };

  const startPreTripValidation = async () => {
    setStep(3);
    setValidationStage("running");
    
    const runCheck = (key, duration) => new Promise(res => {
      setTimeout(() => {
        setValidations(prev => ({ ...prev, [key]: "passed" }));
        res();
      }, duration);
    });

    await runCheck("battery", 600);
    await runCheck("connectivity", 400);
    await runCheck("sensor", 300);
    await runCheck("reading", 400);
    await runCheck("signal", 300);
    await runCheck("firmware", 300);
    await runCheck("calibration", 500);
    await runCheck("sim", 300);
    await runCheck("duration", 800);
    
    setValidationStage("complete");
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const newTrip = {
        ...form,
        id: form.tripId,
        status: "loading",
        startTime: new Date().toISOString(),
        progress: 0,
        originCoords: { lat: 19.076, lng: 72.877 },
        destCoords: { lat: 12.971, lng: 77.594 },
        events: [{ time: new Date().toISOString(), event: "Trip Created & Validated", type: "info" }]
      };
      await api.updateItem("trips", newTrip);
      onCreate?.(newTrip);
    } catch (err) {
      console.error("Failed to create trip", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "0 24px 40px", maxWidth: 1000, margin: "0 auto", height: "100%", overflowY: "auto" }}>
      {/* Step Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", position: "sticky", top: 0, background: "#f4f6fb", zIndex: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b" }}>Predictive Trip Planner</h2>
          <p style={{ fontSize: 13, color: "#64748b" }}>Advanced Configuration & IoT Readiness</p>
        </div>
        <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: 8, cursor: "pointer" }}>
          <X size={20} color="#64748b" />
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= i ? "#2563eb" : "#e2e8f0" }} />
        ))}
      </div>

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Predictive Intelligence Overlay */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <IntelligenceCard icon={Clock} label="Est. Trip Duration" value="14h 30m" color="#2563eb" trend="Historical Average" />
            <IntelligenceCard icon={TrendingUp} label="Route Reliability" value="94.2%" color="#16a34a" trend="High Stability" />
            <IntelligenceCard icon={CloudLightning} label="Breach Risk" value="Low (1.2%)" color="#f59e0b" trend="Based on Weather" />
          </div>

          <Section title="1. Tactical Planning (Route & Resources)">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Departure Hub (Origin)" value={form.origin} onChange={v => updateForm("origin", v)} icon={MapPin} />
              <Input label="Final Depot (Destination)" value={form.destination} onChange={v => updateForm("destination", v)} icon={Navigation} />
            </div>

            <div style={{ marginTop: 16 }}>
              <Label>Multi-stop Trip Nodes (Optional)</Label>
              {form.stops.map((stop, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}><Input value={stop} onChange={v => updateStop(idx, v)} placeholder={`Stop #${idx + 1} Point`} icon={MapPin} /></div>
                  <button onClick={() => removeStop(idx)} style={{ alignSelf: "flex-end", padding: "10px", background: "#fef2f2", border: "none", borderRadius: 8, cursor: "pointer", color: "#ef4444" }}><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={addStop} style={{ padding: "8px 16px", background: "#f0f7ff", border: "1.5px dashed #2563eb", borderRadius: 8, color: "#2563eb", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={14} /> Add Additional Hub Stop
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
              <Select label="Cargo Profile" value={form.cargoType} onChange={v => updateForm("cargoType", v)} options={CATEGORY_OPTIONS} icon={Package} />
              <Input label="System Trip Reference" value={form.tripId} readOnly icon={Clipboard} />
              <Input label="Assigned Fleet Unit" placeholder="Truck Plate #" value={form.vehicleId} onChange={v => updateForm("vehicleId", v)} icon={Truck} />
              <Input label="Assigned Driver" placeholder="Driver Name" value={form.driverId} onChange={v => updateForm("driverId", v)} icon={User} />
              <Input label="TF10 IoT Device" placeholder="TF10-XXXX" value={form.sensorId} onChange={v => updateForm("sensorId", v)} icon={Battery} />
              <Input label="LoRa/LTE Gateway" placeholder="GTW-XXXX" value={form.gatewayId} onChange={v => updateForm("gatewayId", v)} icon={Signal} />
            </div>
          </Section>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button onClick={() => setStep(2)} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>
              Continue to Thresholds
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <IntelligenceCard icon={CheckCircle} label="Cargo Safety Prediction" value="99.9%" color="#16a34a" trend="Zero Breach Risk" />
            <IntelligenceCard icon={AlertTriangle} label="Historical Delays" value="12% Probability" color="#ef4444" trend="Traffic Sensitive" />
            <IntelligenceCard icon={Battery} label="Device Battery Prediction" value="Healthy" color="#2563eb" trend="~85h Expected" />
          </div>

          <Section title="2. Cold-Chain Compliance Thresholds">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <Label>Allowed Temperature Range (°C)</Label>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
                  <input type="number" value={form.tempLimitMin} onChange={e => updateForm("tempLimitMin", e.target.value)} style={INPUT_STYLE} />
                  <span style={{ color: "#94a3b8" }}>to</span>
                  <input type="number" value={form.tempLimitMax} onChange={e => updateForm("tempLimitMax", e.target.value)} style={INPUT_STYLE} />
                </div>
              </div>
              <div>
                <Label>Sampling & Report Frequency (min)</Label>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <div style={{ flex: 1 }}><Select value={form.samplingInterval} onChange={v => updateForm("samplingInterval", v)} options={["1", "5", "15", "30", "60"]} /></div>
                  <div style={{ flex: 1 }}><Select value={form.uploadFrequency} onChange={v => updateForm("uploadFrequency", v)} options={["5", "15", "30", "60", "240"]} /></div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="3. Route Security & Automation">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Label>Geofence Alert Radius (m)</Label>
                <input type="range" min="100" max="5000" step="100" value={form.geofenceRadius} onChange={e => updateForm("geofenceRadius", e.target.value)} style={{ width: "100%", accentColor: "#2563eb" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b" }}><span>100m</span><span>{form.geofenceRadius}m</span><span>5km</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Label>Max Allowable Stop Duration (min)</Label>
                <input type="number" value={form.maxStopDuration} onChange={e => updateForm("maxStopDuration", e.target.value)} style={INPUT_STYLE} />
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              <ToggleRow label="Auto-Start on Movement" checked={form.autoStart} onChange={v => updateForm("autoStart", v)} />
              <ToggleRow label="Auto-End on Geofence" checked={form.autoEnd} onChange={v => updateForm("autoEnd", v)} />
            </div>

            <div style={{ marginTop: 20 }}>
              <Label>Operational Instructions & Notes</Label>
              <textarea 
                placeholder="Escalation contacts, storage instructions..." 
                value={form.notes} onChange={e => updateForm("notes", e.target.value)}
                style={{ ...INPUT_STYLE, minHeight: 80, resize: "none" }}
              />
            </div>
          </Section>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button onClick={() => setStep(1)} style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "12px 24px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Back</button>
            <button onClick={startPreTripValidation} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>
              Run Pre-Trip System Audit
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Section title="Automated System Readiness Checks">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <ValidationRow label="Device Battery Health" status={validations.battery} icon={Battery} />
              <ValidationRow label="Gateway Handshake" status={validations.connectivity} icon={Signal} />
              <ValidationRow label="Sensor Responsiveness" status={validations.sensor} icon={Thermometer} />
              <ValidationRow label="Last Sensor Reading Log" status={validations.reading} icon={History} />
              <ValidationRow label="Signal Strength Check" status={validations.signal} icon={Activity} />
              <ValidationRow label="Firmware Compatibility" status={validations.firmware} icon={ShieldCheck} />
              <ValidationRow label="Sensor Calibration Trace" status={validations.calibration} icon={CheckCircle} />
              <ValidationRow label="SIM Multi-Network Check" status={validations.sim} icon={Signal} />
              <ValidationRow label="Duration vs Battery Est." status={validations.duration} icon={Clock} />
            </div>
          </Section>

          {validationStage === "complete" ? (
            <div style={{ background: "#f0fdf4", border: "2px solid #bbf7d0", padding: 24, borderRadius: 16, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 48, height: 48, background: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <Check size={28} />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#166534" }}>Flight Readiness Confirmed</p>
                <p style={{ fontSize: 14, color: "#15803d", marginTop: 2 }}>Estimated Arrival: {new Date(Date.now() + 14.5 * 3600000).toLocaleString()}. All safety scores 95%+</p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
              <div style={{ width: 32, height: 32, border: "3px solid #f1f5f9", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
              <p style={{ fontSize: 15, fontWeight: 600 }}>Analyzing telemetry data streams...</p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button onClick={onClose} style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "12px 24px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button 
              onClick={handleFinalSubmit} 
              disabled={validationStage !== "complete" || loading}
              style={{ 
                background: validationStage === "complete" ? "#2563eb" : "#e2e8f0", 
                color: "#fff", border: "none", padding: "12px 24px", 
                borderRadius: 10, fontWeight: 700, 
                cursor: validationStage === "complete" ? "pointer" : "not-allowed"
              }}
            >
              {loading ? "Deploying..." : "Start Shipment Lifecycle"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── UI Helpers ──

const INPUT_STYLE = {
  width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e2e8f0",
  outline: "none", fontSize: 14, background: "#fff"
};

function IntelligenceCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 16, border: "1px solid #e2e8f0", display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ width: 36, height: 36, background: `${color}10`, color: color, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} />
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>{value}</div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{trend}</div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "#fff", padding: 28, borderRadius: 20, border: "1px solid #e2e8f0" }}>
      <h3 style={{ fontSize: 13, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 24 }}>{title}</h3>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 8 }}>{children}</label>;
}

function Input({ label, icon: Icon, value, onChange, placeholder, readOnly }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div style={{ position: "relative" }}>
        {Icon && <Icon size={18} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />}
        <input 
          placeholder={placeholder} value={value} readOnly={readOnly}
          onChange={e => onChange?.(e.target.value)} 
          style={{ ...INPUT_STYLE, paddingLeft: Icon ? 44 : 14, background: readOnly ? "#f8fafc" : "#fff" }} 
        />
      </div>
    </div>
  );
}

function Select({ label, icon: Icon, value, onChange, options }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div style={{ position: "relative" }}>
        {Icon && <Icon size={18} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />}
        <select value={value} onChange={e => onChange(e.target.value)} style={{ ...INPUT_STYLE, paddingLeft: Icon ? 44 : 14, appearance: "none" }}>
          <option value="">Select Option</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} color="#94a3b8" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#f8fafc", borderRadius: 10, cursor: "pointer", border: "1px solid #f1f5f9" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{label}</span>
      <div style={{ width: 40, height: 20, background: checked ? "#2563eb" : "#cbd5e1", borderRadius: 20, position: "relative", transition: "all 0.2s" }}>
        <div style={{ width: 14, height: 14, background: "#fff", borderRadius: "50%", position: "absolute", top: 3, left: checked ? 23 : 3, transition: "all 0.2s" }} />
      </div>
    </div>
  );
}

function ValidationRow({ label, status, icon: Icon }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon size={18} color="#64748b" />
        <span style={{ fontSize: 14, color: "#1e293b", fontWeight: 600 }}>{label}</span>
      </div>
      {status === "passed" ? (
        <Check size={18} color="#16a34a" />
      ) : (
        <div style={{ width: 16, height: 16, border: "2px solid #f1f5f9", borderTop: "2px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      )}
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
