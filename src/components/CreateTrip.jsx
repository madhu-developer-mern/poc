import { useState, useEffect, useRef, useMemo } from "react";
import { X, Check, Plus, ChevronDown, Info } from "lucide-react";
import { useJsApiLoader, Autocomplete, GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { TRUCKS } from "../data/mockData";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LOADER_OPTIONS } from "../lib/googleMaps";

const TRACKER_OPTIONS = [
  "TRK-001 – Tata Ace (MH 12 AB 1234)",
  "TRK-002 – Ashok Leyland (MH 14 CD 5678)",
  "TRK-005 – TATA 407 (GJ 01 AB 9876)",
  "TRK-006 – Eicher 10.90 (KA 03 CD 1122)",
];

const CATEGORY_OPTIONS = ["Cold Chain", "Pharma", "FMCG", "Electronics", "Auto Parts", "Chemicals", "Textiles"];
const PROFILE_OPTIONS  = ["Standard", "Pharma Grade", "Frozen", "Ambient", "Hazardous"];

// ── Shared styles ─────────────────────────────────────────────────────────────
const SECTION = {
  background: "#FFFFFF",
  border: "1px solid #E9EDF5",
  borderRadius: 14,
  padding: "20px 22px",
  marginBottom: 16,
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

const SECTION_TITLE = {
  color: "#111827",
  fontSize: 15,
  fontWeight: 700,
  marginBottom: 18,
  paddingBottom: 12,
  borderBottom: "1px solid #F1F5F9",
};

const LABEL = {
  color: "#374151",
  fontSize: 13,
  fontWeight: 500,
  display: "block",
  marginBottom: 5,
};

const REQUIRED = { color: "#DC2626", marginLeft: 2 };

const BASE_INPUT = {
  width: "100%",
  background: "#FFFFFF",
  border: "1px solid #D1D5DB",
  borderRadius: 9,
  padding: "10px 14px",
  color: "#111827",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};

const HELPER = { color: "#9CA3AF", fontSize: 11, marginTop: 4 };

// Input with focus highlight
function Field({ label, required, helper, children }) {
  return (
    <div>
      <label style={LABEL}>
        {label}{required && <span style={REQUIRED}>*</span>}
      </label>
      {children}
      {helper && <div style={HELPER}>{helper}</div>}
    </div>
  );
}

// Controlled native input
function TextInput({ label, required, helper, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Field label={label} required={required} helper={helper}>
      <input
        {...props}
        style={{ ...BASE_INPUT, borderColor: focused ? "#2563EB" : "#D1D5DB", ...props.style }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </Field>
  );
}

// Custom select
function SelectInput({ label, required, options, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <Field label={label} required={required}>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...BASE_INPUT,
            borderColor: focused ? "#2563EB" : "#D1D5DB",
            appearance: "none",
            paddingRight: 36,
            cursor: "pointer",
            color: value ? "#111827" : "#9CA3AF",
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={15} color="#9CA3AF" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </Field>
  );
}

// Location autocomplete input using Google Places
function LocationInput({ label, required, placeholder, value, onChange, mapsLoaded }) {
  const [focused, setFocused] = useState(false);
  const acRef  = useRef(null);
  const inputRef = useRef(null);

  const onLoad = (ac) => { acRef.current = ac; };

  const onPlaceChanged = () => {
    if (acRef.current) {
      const place = acRef.current.getPlace();
      const addr  = place.formatted_address || place.name || "";
      onChange(addr);
    }
  };

  // fallback: plain input if maps not ready
  if (!mapsLoaded) {
    return (
      <Field label={label} required={required}>
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...BASE_INPUT, borderColor: "#D1D5DB" }}
        />
      </Field>
    );
  }

  return (
    <Field label={label} required={required}>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{ componentRestrictions: { country: "in" }, types: ["geocode", "establishment"] }}
      >
        <input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...BASE_INPUT,
            borderColor: focused ? "#2563EB" : "#D1D5DB",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Autocomplete>
    </Field>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CreateTrip({ onClose, onCreate }) {
  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);

  const [success, setSuccess] = useState(false);
  const [emails, setEmails]   = useState([""]);
  const [assignPerson, setAssignPerson] = useState(true);

  const [form, setForm] = useState({
    tripName:         "",
    tracker:          "",
    startLocation:    "",
    destination:      "",
    trackingId:       "",
    category:         "",
    profile:          "",
    samplingInterval: "15",
    uploadInterval:   "60",
    smsPhone:         "",
    personName:       "",
    personPhone:      "",
    personEmail:      "",
  });

  const gmapsKeyMissing = !GOOGLE_MAPS_API_KEY || String(GOOGLE_MAPS_API_KEY).trim().length < 10;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addEmail    = () => setEmails((e) => [...e, ""]);
  const setEmail    = (i, v) => setEmails((e) => e.map((x, idx) => idx === i ? v : x));
  const removeEmail = (i) => setEmails((e) => e.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    setSuccess(true);
    setTimeout(() => {
      onCreate?.({ ...form, id: `TRIP-${2405 + Math.floor(Math.random() * 100)}`, status: "loading", progress: 0 });
    }, 2000);
  };

  const selectedTruck = useMemo(() => {
    // tracker string begins with "TRK-001 – ..."
    const id = (form.tracker || "").split("–")[0]?.trim();
    return TRUCKS.find((t) => t.id === id) || null;
  }, [form.tracker]);

  // Suggested route modal state
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [geo, setGeo] = useState({ origin: null, dest: null });
  const [routeResult, setRouteResult] = useState(null);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeErr, setRouteErr] = useState("");

  const canSuggest = Boolean(form.startLocation && form.destination && isLoaded && !gmapsKeyMissing);

  const geocodeAddress = (address) => new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address, region: "IN" }, (results, status) => {
      if (status !== "OK" || !results?.[0]?.geometry?.location) {
        reject(new Error(`Geocode failed: ${status}`));
        return;
      }
      const loc = results[0].geometry.location;
      resolve({ lat: loc.lat(), lng: loc.lng() });
    });
  });

  const openSuggestedRoute = async () => {
    if (!canSuggest) return;
    setRouteErr("");
    setRouteLoading(true);
    setRouteModalOpen(true);
    try {
      const [originCoords, destCoords] = await Promise.all([
        geocodeAddress(form.startLocation),
        geocodeAddress(form.destination),
      ]);
      setGeo({ origin: originCoords, dest: destCoords });

      const svc = new window.google.maps.DirectionsService();
      svc.route(
        {
          origin: originCoords,
          destination: destCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
        },
        (result, status) => {
          setRouteLoading(false);
          if (status !== "OK" || !result) {
            setRouteErr(`Route not available (${status}). Try a different address.`);
            return;
          }
          setRouteResult(result);
          setSelectedRouteIdx(0);
        }
      );
    } catch (e) {
      setRouteLoading(false);
      setRouteErr(e?.message || "Unable to fetch suggested route.");
    }
  };

  const selectedRoute = routeResult?.routes?.[selectedRouteIdx] || null;
  const selectedLeg = selectedRoute?.legs?.[0] || null;
  const distanceKm = selectedLeg?.distance?.value ? (selectedLeg.distance.value / 1000) : null;
  const durationSec = selectedLeg?.duration_in_traffic?.value || selectedLeg?.duration?.value || null;
  const liveSpeedKmph = selectedTruck?.speed || 0;
  const speedBasedEtaSec = (distanceKm && liveSpeedKmph > 3) ? Math.round((distanceKm / liveSpeedKmph) * 3600) : null;
  const etaSec = durationSec && speedBasedEtaSec ? Math.round(durationSec * 0.65 + speedBasedEtaSec * 0.35) : (durationSec || speedBasedEtaSec);

  const etaText = etaSec
    ? `${Math.floor(etaSec / 3600)}h ${Math.round((etaSec % 3600) / 60)}m`
    : "—";

  if (success) {
    return (
      <div style={{ padding: "56px 24px", textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "#F0FDF4", border: "2px solid #16A34A",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <Check size={36} color="#16A34A" />
        </div>
        <h2 style={{ color: "#111827", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Trip Created!</h2>
        <p style={{ color: "#6B7280", fontSize: 14 }}>Your trip has been scheduled and the tracker is active.</p>
        <button onClick={onClose} style={{
          marginTop: 24,
          background: "linear-gradient(135deg,#2563EB,#7C3AED)",
          border: "none", borderRadius: 10, padding: "12px 32px",
          color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
          boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
        }}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 24px 40px", maxWidth: 900, margin: "0 auto" }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 16px" }}>
        <h2 style={{ color: "#111827", fontSize: 20, fontWeight: 700, margin: 0 }}>Create Trip</h2>
        <button onClick={onClose} style={{
          background: "#F4F6FB", border: "1px solid #E9EDF5", borderRadius: 8,
          width: 32, height: 32, cursor: "pointer", color: "#6B7280",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><X size={16} /></button>
      </div>

      {/* ── 1. Trip Configuration ──────────────────────────────────── */}
      <div style={SECTION}>
        <div style={SECTION_TITLE}>Trip Configuration</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <TextInput label="Trip Name" required placeholder="Enter Trip Name"
            value={form.tripName} onChange={(e) => set("tripName", e.target.value)} />
          <SelectInput label="Assign Tracker" required placeholder="Select Tracker"
            options={TRACKER_OPTIONS} value={form.tracker} onChange={(v) => set("tracker", v)} />
          <LocationInput label="Start Location" required placeholder="Enter Start Location"
            value={form.startLocation} onChange={(v) => set("startLocation", v)} mapsLoaded={isLoaded} />
          <LocationInput label="Destination" required placeholder="Enter Destination"
            value={form.destination} onChange={(v) => set("destination", v)} mapsLoaded={isLoaded} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <button
            onClick={openSuggestedRoute}
            disabled={!form.startLocation || !form.destination || !isLoaded || gmapsKeyMissing}
            style={{
              background: (!form.startLocation || !form.destination || !isLoaded || gmapsKeyMissing)
                ? "#E5E7EB"
                : "linear-gradient(135deg,#111827,#334155)",
              border: "none",
              borderRadius: 10,
              padding: "10px 14px",
              color: (!form.startLocation || !form.destination || !isLoaded || gmapsKeyMissing) ? "#9CA3AF" : "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: (!form.startLocation || !form.destination || !isLoaded || gmapsKeyMissing) ? "not-allowed" : "pointer",
            }}
          >
            Show suggested route + ETA
          </button>
          {gmapsKeyMissing && (
            <span style={{ color: "#DC2626", fontSize: 12, fontWeight: 600 }}>
              Missing `VITE_GOOGLE_MAPS_API_KEY`
            </span>
          )}
          {selectedTruck && (
            <span style={{ color: "#6B7280", fontSize: 12 }}>
              Live speed: <strong style={{ color: "#111827" }}>{selectedTruck.speed} km/h</strong>
            </span>
          )}
        </div>
        <div style={{ marginTop: 14 }}>
          <TextInput label="Tracking ID (Optional)" placeholder="Enter Tracking ID"
            value={form.trackingId} onChange={(e) => set("trackingId", e.target.value)} />
        </div>
      </div>

      {/* ── 2. Profile Configuration ───────────────────────────────── */}
      <div style={SECTION}>
        <div style={SECTION_TITLE}>Profile Configuration</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <SelectInput label="Category" required placeholder="Select category"
            options={CATEGORY_OPTIONS} value={form.category} onChange={(v) => set("category", v)} />
          <SelectInput label="Profile" required placeholder="Select profile"
            options={PROFILE_OPTIONS} value={form.profile} onChange={(v) => set("profile", v)} />
        </div>
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 8,
          background: "#F8FAFF", border: "1px solid #E0E7FF",
          borderRadius: 8, padding: "10px 14px",
        }}>
          <Info size={14} color="#6366F1" style={{ marginTop: 1, flexShrink: 0 }} />
          <span style={{ color: "#4B5563", fontSize: 13 }}>
            To create or customise categories and profiles, go to{" "}
            <span style={{ color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Profile</span>
            {" → "}
            <span style={{ color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Profile Configuration</span>.
          </span>
        </div>
      </div>

      {/* ── 3. Device Configuration ────────────────────────────────── */}
      <div style={SECTION}>
        <div style={SECTION_TITLE}>Device Configuration</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Sampling Interval in Minutes (Min)" required helper="For values below 5 mins, contact GND.">
            <input
              type="number" min="5" value={form.samplingInterval}
              onChange={(e) => set("samplingInterval", e.target.value)}
              style={BASE_INPUT}
            />
          </Field>
          <Field label="Upload Interval in Minutes (Max)" required helper="For values below 15 mins, contact GND.">
            <input
              type="number" min="15" value={form.uploadInterval}
              onChange={(e) => set("uploadInterval", e.target.value)}
              style={BASE_INPUT}
            />
          </Field>
        </div>

        {/* Sensor list */}
        <div style={{ marginTop: 18 }}>
          <div style={{ color: "#6B7280", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
            Pre-configured Sensors
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { icon: "🌡️", label: "Temperature Sensor", active: true  },
              { icon: "💧", label: "Humidity Sensor",     active: true  },
              { icon: "📍", label: "GPS Tracker",         active: true  },
              { icon: "⚡", label: "Battery Monitor",     active: true  },
              { icon: "🔧", label: "Engine Diagnostics",  active: true  },
              { icon: "💨", label: "CO2 Sensor",          active: false },
            ].map((s) => (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", gap: 9,
                background: "#F8FAFC", border: "1px solid #F1F5F9",
                borderRadius: 9, padding: "9px 12px",
              }}>
                <span style={{ fontSize: 15 }}>{s.icon}</span>
                <span style={{ color: "#374151", fontSize: 13, flex: 1 }}>{s.label}</span>
                <span style={{
                  background: s.active ? "#F0FDF4" : "#F9FAFB",
                  color:      s.active ? "#16A34A" : "#9CA3AF",
                  border:     `1px solid ${s.active ? "#BBF7D0" : "#E5E7EB"}`,
                  borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600,
                }}>{s.active ? "Active" : "Optional"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Alerts Configuration ────────────────────────────────── */}
      <div style={SECTION}>
        <div style={SECTION_TITLE}>Alerts Configuration</div>

        {/* Emails */}
        <div style={{ marginBottom: 16 }}>
          <label style={LABEL}>Email<span style={REQUIRED}>*</span></label>
          {emails.map((email, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(i, e.target.value)}
                style={{ ...BASE_INPUT, flex: 1 }}
              />
              {emails.length > 1 && (
                <button onClick={() => removeEmail(i)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#9CA3AF", padding: 4,
                  display: "flex", alignItems: "center",
                }}><X size={16} /></button>
              )}
            </div>
          ))}
          <button onClick={addEmail} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#2563EB", fontSize: 13, fontWeight: 600,
            padding: 0, display: "flex", alignItems: "center", gap: 4,
          }}>
            <Plus size={14} /> Add Email
          </button>
        </div>

        {/* SMS */}
        <div>
          <label style={LABEL}>SMS <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(optional)</span></label>
          <div style={{ display: "flex", gap: 8 }}>
            {/* Country code */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#FFFFFF", border: "1px solid #D1D5DB",
              borderRadius: 9, padding: "10px 12px", cursor: "pointer",
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
              <span style={{ fontSize: 16 }}>🇮🇳</span>
              <span style={{ color: "#374151", fontSize: 14, fontWeight: 500 }}>+91</span>
              <ChevronDown size={13} color="#9CA3AF" />
            </div>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={form.smsPhone}
              onChange={(e) => set("smsPhone", e.target.value)}
              style={{ ...BASE_INPUT, flex: 1 }}
            />
          </div>
        </div>
      </div>

      {/* ── 5. Assign a Person ─────────────────────────────────────── */}
      <div style={SECTION}>
        <div style={SECTION_TITLE}>Assign a Person</div>

        {/* Yes / No radio */}
        <div style={{ display: "flex", gap: 24, marginBottom: 18 }}>
          {[true, false].map((val) => (
            <label key={String(val)} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 14, color: "#374151" }}>
              <input
                type="radio"
                checked={assignPerson === val}
                onChange={() => setAssignPerson(val)}
                style={{ accentColor: "#2563EB", width: 16, height: 16, cursor: "pointer" }}
              />
              {val ? "Yes" : "No"}
            </label>
          ))}
        </div>

        {assignPerson && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Name">
              <input placeholder="Enter name" value={form.personName}
                onChange={(e) => set("personName", e.target.value)} style={BASE_INPUT} />
            </Field>

            <Field label="Phone">
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "#FFFFFF", border: "1px solid #D1D5DB",
                  borderRadius: 9, padding: "10px 11px", flexShrink: 0, cursor: "pointer",
                }}>
                  <span style={{ fontSize: 15 }}>🇮🇳</span>
                  <span style={{ color: "#374151", fontSize: 13, fontWeight: 500 }}>+91</span>
                  <ChevronDown size={12} color="#9CA3AF" />
                </div>
                <input placeholder="Enter phone" value={form.personPhone}
                  onChange={(e) => set("personPhone", e.target.value)}
                  style={{ ...BASE_INPUT, flex: 1 }} />
              </div>
            </Field>

            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Email">
                <input type="email" placeholder="Enter email" value={form.personEmail}
                  onChange={(e) => set("personEmail", e.target.value)} style={BASE_INPUT} />
              </Field>
            </div>
          </div>
        )}
      </div>

      {/* ── Actions ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, paddingTop: 4 }}>
        <button onClick={onClose} style={{
          background: "#FFFFFF", border: "1.5px solid #D1D5DB",
          borderRadius: 10, padding: "11px 36px",
          color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={!form.tripName || !form.tracker || !form.startLocation || !form.destination}
          style={{
            background: form.tripName && form.tracker && form.startLocation && form.destination
              ? "linear-gradient(135deg,#2563EB,#7C3AED)"
              : "#E5E7EB",
            border: "none", borderRadius: 10, padding: "11px 36px",
            color: form.tripName && form.tracker && form.startLocation && form.destination ? "#fff" : "#9CA3AF",
            fontSize: 14, fontWeight: 600,
            cursor: form.tripName && form.tracker && form.startLocation && form.destination ? "pointer" : "not-allowed",
            boxShadow: form.tripName && form.tracker && form.startLocation && form.destination
              ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
          }}
        >Submit</button>
      </div>

      {/* Suggested route modal */}
      {routeModalOpen && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 300, padding: 16,
          }}
          onClick={() => setRouteModalOpen(false)}
        >
          <div
            style={{
              width: "min(980px, 100%)",
              background: "#FFFFFF",
              borderRadius: 16,
              border: "1px solid #E9EDF5",
              overflow: "hidden",
              boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 14, borderBottom: "1px solid #E9EDF5", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontWeight: 800, color: "#111827" }}>Suggested route</div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ color: "#6B7280", fontSize: 12 }}>
                  ETA prediction: <strong style={{ color: "#111827" }}>{etaText}</strong>
                </div>
                <button
                  onClick={() => setRouteModalOpen(false)}
                  style={{
                    background: "#F4F6FB", border: "1px solid #E9EDF5", borderRadius: 10,
                    width: 34, height: 34, cursor: "pointer", color: "#6B7280",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", minHeight: 480 }}>
              <div style={{ position: "relative" }}>
                {isLoaded && geo.origin && geo.dest ? (
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={{ clickableIcons: false, streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
                    onLoad={(map) => {
                      const bounds = new window.google.maps.LatLngBounds();
                      bounds.extend(geo.origin);
                      bounds.extend(geo.dest);
                      map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
                    }}
                  >
                    {routeResult && (
                      <DirectionsRenderer
                        directions={routeResult}
                        routeIndex={selectedRouteIdx}
                        options={{
                          suppressMarkers: false,
                          polylineOptions: { strokeColor: "#2563EB", strokeOpacity: 0.85, strokeWeight: 6 },
                        }}
                      />
                    )}
                  </GoogleMap>
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280" }}>
                    {routeLoading ? "Loading route..." : "Enter locations to view route."}
                  </div>
                )}

                {routeErr && (
                  <div style={{
                    position: "absolute", left: 14, right: 14, bottom: 14,
                    background: "#FEF2F2", border: "1px solid #FECACA",
                    borderRadius: 12, padding: "10px 12px", color: "#991B1B",
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {routeErr}
                  </div>
                )}
              </div>

              <div style={{ borderLeft: "1px solid #E9EDF5", padding: 14, background: "#F8FAFC" }}>
                <div style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>
                  Route options
                </div>
                {routeResult?.routes?.length ? (
                  <div style={{ display: "grid", gap: 10 }}>
                    {routeResult.routes.map((r, idx) => {
                      const leg = r.legs?.[0];
                      const dKm = leg?.distance?.value ? Math.round(leg.distance.value / 100) / 10 : null;
                      const dSec = leg?.duration_in_traffic?.value || leg?.duration?.value || null;
                      const dMin = dSec ? Math.round(dSec / 60) : null;
                      const active = idx === selectedRouteIdx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedRouteIdx(idx)}
                          style={{
                            textAlign: "left",
                            background: active ? "#FFFFFF" : "rgba(255,255,255,0.65)",
                            border: active ? "1px solid #2563EB" : "1px solid #E9EDF5",
                            borderRadius: 12,
                            padding: "12px 12px",
                            cursor: "pointer",
                            boxShadow: active ? "0 6px 18px rgba(37,99,235,0.12)" : "none",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <div style={{ color: "#111827", fontWeight: 800, fontSize: 13 }}>Option {idx + 1}</div>
                            <div style={{ color: "#2563EB", fontWeight: 800, fontSize: 13 }}>{dMin != null ? `${dMin} min` : "—"}</div>
                          </div>
                          <div style={{ color: "#6B7280", fontSize: 12, marginTop: 4 }}>
                            {dKm != null ? `${dKm} km` : "—"} · live speed {liveSpeedKmph} km/h
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: "#6B7280", fontSize: 12 }}>
                    {routeLoading ? "Fetching route alternatives..." : "No route options yet."}
                  </div>
                )}

                <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setRouteModalOpen(false)}
                    style={{
                      flex: 1,
                      background: "#FFFFFF",
                      border: "1px solid #E9EDF5",
                      borderRadius: 12,
                      padding: "10px 12px",
                      cursor: "pointer",
                      fontWeight: 700,
                      color: "#374151",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
