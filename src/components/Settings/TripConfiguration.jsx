import { useState, useEffect } from "react";
import { Settings2, Thermometer, Droplets, Clock, Zap, MapPin, Save, AlertTriangle } from "lucide-react";
import { api } from "../../lib/api";

export default function TripConfiguration() {
  const [config, setConfig] = useState({
    tempMin: 0,
    tempMax: 0,
    humMin: 0,
    humMax: 0,
    samplingInterval: 0,
    uploadFrequency: 0,
    stopDurationLimit: 0,
    deviationThreshold: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const data = await api.getCollection("tripConfig");
      setConfig(data);
    } catch (err) {
      console.error("Failed to fetch trip config", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateCollection("tripConfig", config);
      alert("Configurations saved successfully!");
    } catch (err) {
      console.error("Failed to save config", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading configuration...</div>;

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>Trip Configuration</h2>
          <p style={{ color: "#64748b", marginTop: 4 }}>Define global default parameters and monitoring rules for all trips.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{ 
            background: "#2563eb", color: "#fff", border: "none", padding: "10px 24px", 
            borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? "Saving..." : <><Save size={18} /> Save Configurations</>}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Thresholds */}
        <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ConfigSection title="Environment Thresholds" icon={Zap}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <NumberInput 
                label="Min Temperature (°C)" 
                value={config.tempMin} 
                icon={Thermometer} 
                onChange={v => setConfig({...config, tempMin: v})} 
              />
              <NumberInput 
                label="Max Temperature (°C)" 
                value={config.tempMax} 
                icon={Thermometer} 
                onChange={v => setConfig({...config, tempMax: v})} 
              />
              <NumberInput 
                label="Min Humidity (%)" 
                value={config.humMin} 
                icon={Droplets} 
                onChange={v => setConfig({...config, humMin: v})} 
              />
              <NumberInput 
                label="Max Humidity (%)" 
                value={config.humMax} 
                icon={Droplets} 
                onChange={v => setConfig({...config, humMax: v})} 
              />
            </div>
          </ConfigSection>

          <ConfigSection title="Route Monitoring" icon={MapPin}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <NumberInput 
                label="Stop Duration Limit (mins)" 
                value={config.stopDurationLimit} 
                icon={Clock} 
                onChange={v => setConfig({...config, stopDurationLimit: v})} 
              />
              <NumberInput 
                label="Route Deviation (meters)" 
                value={config.deviationThreshold} 
                icon={MapPin} 
                onChange={v => setConfig({...config, deviationThreshold: v})} 
              />
            </div>
          </ConfigSection>
        </section>

        {/* Global Rules */}
        <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ConfigSection title="Data Reporting" icon={Settings2}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <RangeInput 
                label="Sensor Sampling Interval" 
                value={config.samplingInterval} 
                min={1} max={60} unit="mins"
                desc="How often sensors read data from environment"
                onChange={v => setConfig({...config, samplingInterval: v})} 
              />
              <RangeInput 
                label="Data Upload Frequency" 
                value={config.uploadFrequency} 
                min={5} max={120} unit="mins"
                desc="How often gateways sync data to server"
                onChange={v => setConfig({...config, uploadFrequency: v})} 
              />
            </div>
          </ConfigSection>

          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: 20, display: "flex", gap: 16 }}>
            <AlertTriangle style={{ color: "#f97316", flexShrink: 0 }} size={24} />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#9a3412", marginBottom: 4 }}>Note on Propagating Changes</h4>
              <p style={{ fontSize: 13, color: "#c2410c", lineHeight: 1.5 }}>
                Updating these global defaults will NOT affect trips that are currently in progress. 
                New settings will apply to trips created after saving.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ConfigSection({ title, icon: Icon, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Icon size={18} style={{ color: "#2563eb" }} />
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function NumberInput({ label, value, icon: Icon, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <Icon size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
        <input 
          type="number" 
          value={value} 
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            width: "100%", padding: "8px 12px 8px 36px", borderRadius: 8, border: "1px solid #e2e8f0",
            fontSize: 14, outline: "none", background: "#fcfdfe"
          }}
        />
      </div>
    </div>
  );
}

function RangeInput({ label, value, min, max, unit, desc, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{label}</label>
          <p style={{ fontSize: 11, color: "#94a3b8" }}>{desc}</p>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#2563eb" }}>{value} <span style={{ fontSize: 12, fontWeight: 400, color: "#64748b" }}>{unit}</span></span>
      </div>
      <input 
        type="range" 
        min={min} max={max} 
        value={value} 
        onChange={e => onChange(parseInt(e.target.value))}
        style={{ width: "100%", height: 6, borderRadius: 5, accentColor: "#2563eb", cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#cbd5e1" }}>
        <span>Min: {min}{unit}</span>
        <span>Max: {max}{unit}</span>
      </div>
    </div>
  );
}

