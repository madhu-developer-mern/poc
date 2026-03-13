import { useState } from "react";
import { X } from "lucide-react";
import { TRUCKS } from "../data/mockData";

export default function TruckOnboard({ onClose }) {
  const [form, setForm] = useState({
    id: "",
    driver: "",
    phone: "",
    vehicle: "",
    category: "Standard",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    // Demo-only: push into global TRUCKS array so it appears in lists for this session.
    if (!form.id || !form.driver) return;
    if (!TRUCKS.find((t) => t.id === form.id)) {
      TRUCKS.push({
        id: form.id,
        driver: form.driver,
        phone: form.phone || "+91 99999 99999",
        vehicle: form.vehicle || "New Truck",
        status: "loading",
        lat: 19.076,
        lng: 72.8777,
        speed: 0,
        fuel: 100,
        temp: 4,
        humidity: 60,
        engineTemp: 80,
        batteryVoltage: 13.2,
        trip: null,
        category: form.category,
      });
    }
    onClose?.();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(420px,100%)",
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E9EDF5",
          boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
          padding: 20,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Onboard Truck</div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              border: "1px solid #E5E7EB",
              background: "#F9FAFB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6B7280",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <label style={{ fontSize: 12, color: "#374151" }}>
            Truck ID *
            <input
              value={form.id}
              onChange={(e) => set("id", e.target.value.toUpperCase())}
              placeholder="e.g. TRK-051"
              style={{
                width: "100%",
                borderRadius: 10,
                border: "1px solid #E5E7EB",
                padding: "8px 10px",
                marginTop: 4,
              }}
            />
          </label>
          <label style={{ fontSize: 12, color: "#374151" }}>
            Driver Name *
            <input
              value={form.driver}
              onChange={(e) => set("driver", e.target.value)}
              placeholder="Driver full name"
              style={{
                width: "100%",
                borderRadius: 10,
                border: "1px solid #E5E7EB",
                padding: "8px 10px",
                marginTop: 4,
              }}
            />
          </label>
          <label style={{ fontSize: 12, color: "#374151" }}>
            Phone
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+91 ..."
              style={{
                width: "100%",
                borderRadius: 10,
                border: "1px solid #E5E7EB",
                padding: "8px 10px",
                marginTop: 4,
              }}
            />
          </label>
          <label style={{ fontSize: 12, color: "#374151" }}>
            Vehicle / Registration
            <input
              value={form.vehicle}
              onChange={(e) => set("vehicle", e.target.value)}
              placeholder="Make / registration"
              style={{
                width: "100%",
                borderRadius: 10,
                border: "1px solid #E5E7EB",
                padding: "8px 10px",
                marginTop: 4,
              }}
            />
          </label>
          <label style={{ fontSize: 12, color: "#374151" }}>
            Category
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              style={{
                width: "100%",
                borderRadius: 10,
                border: "1px solid #E5E7EB",
                padding: "8px 10px",
                marginTop: 4,
                background: "#FFFFFF",
              }}
            >
              <option value="Standard">Standard</option>
              <option value="Cold Chain">Cold Chain</option>
              <option value="Pharma">Pharma</option>
              <option value="FMCG">FMCG</option>
            </select>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!form.id || !form.driver}
          style={{
            marginTop: 16,
            width: "100%",
            borderRadius: 999,
            border: "none",
            padding: "10px 14px",
            background: form.id && form.driver ? "linear-gradient(135deg,#2563EB,#7C3AED)" : "#E5E7EB",
            color: form.id && form.driver ? "#FFFFFF" : "#9CA3AF",
            fontWeight: 700,
            fontSize: 13,
            cursor: form.id && form.driver ? "pointer" : "not-allowed",
          }}
        >
          Save Truck
        </button>
      </div>
    </div>
  );
}

