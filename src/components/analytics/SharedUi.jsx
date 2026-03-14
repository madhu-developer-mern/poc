import React from "react";
import { MousePointer2, Check } from "lucide-react";

export const COLORS = ["#2563eb", "#7c3aed", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#14b8a6", "#8b5cf6", "#f43f5e"];

export function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{ background: "#fff", padding: 22, borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", transition: "transform 0.2s" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}>{value}</div>
      {sub && <div style={{ fontSize: 13, fontWeight: 700, color: color || "#2563eb", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: 3, background: color || "#2563eb" }} />
        {sub}
      </div>}
    </div>
  );
}

export function ChartSection({ title, children, drillable, desc }) {
  return (
    <div style={{ background: "#fff", padding: "28px 24px", borderRadius: 24, border: "1px solid #e2e8f0", position: "relative", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.02)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>{title}</h3>
          {desc && <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0 0" }}>{desc}</p>}
        </div>
        {drillable && (
          <button style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, color: "#2563eb", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", transition: "all 0.2s" }}>
            <MousePointer2 size={12} /> DRILL DOWN 
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h4 style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: 16 }}>{title}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

export function SegmentOption({ label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: "12px 14px", borderRadius: 10, border: active ? "2px solid #2563eb" : "1px solid #e2e8f0", background: active ? "#f0f7ff" : "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.1s" }}>
      <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? "#2563eb" : "#475569" }}>{label}</span>
      {active && <Check size={16} color="#2563eb" />}
    </div>
  );
}

export function MetaRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f8fafc", lastChild: { borderBottom: 'none' } }}>
      <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{value}</span>
    </div>
  );
}

export function ProgressRow({ label, val, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: color || "#2563eb" }}>{val}%</span>
      </div>
      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${val}%`, background: color || "#2563eb", borderRadius: 4 }} />
      </div>
    </div>
  );
}
