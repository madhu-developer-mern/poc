export default function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid #E9EDF5",
      borderRadius: 14,
      padding: "18px 20px",
      display: "flex", alignItems: "center", gap: 16,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: bg || "rgba(37,99,235,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={22} color={color || "#2563EB"} />
      </div>
      <div>
        <div style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
        <div style={{ color: "#111827", fontSize: 28, fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
        {sub && <div style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}
