import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, Legend, ComposedChart } from "recharts";
import { MetricCard, ChartSection, ProgressRow, COLORS } from "./SharedUi";

export function RouteDashboard() {
  const routeData = [ { route: "MUM-DEL", trips: 240, delayRate: 14, efficiency: 82 }, { route: "BLR-CHN", trips: 180, delayRate: 4, efficiency: 98 }, { route: "HYD-PUN", trips: 150, delayRate: 8, efficiency: 92 }, { route: "DEL-KOL", trips: 90, delayRate: 18, efficiency: 75 } ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Average trip duration per route" value="48h Overview" sub="MUM-DEL Longest Tracker" color="#2563eb" />
          <MetricCard label="Route risk & delay prediction" value="MUM-DEL" sub="High Risk Zone" color="#ef4444" />
          <MetricCard label="Temperature breach freq per route" value="12%" sub="High incidence on DEL-KOL" color="#f59e0b" />
          <MetricCard label="Route Efficiency & Reliability" value="94.2" sub="Top Quartile System-wide" color="#10b981" />
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
         <ChartSection title="Most Used Routes & Trip Count" desc="Volume of trips per corridor">
            <ResponsiveContainer width="100%" height={260}>
               <BarChart data={routeData} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis type="category" dataKey="route" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#0f172a", fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="trips" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="Route Delay Rate Chart">
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
               {routeData.map((d, i) => (
                 <ProgressRow key={i} label={`${d.route} Delay Rate`} val={d.delayRate} color={d.delayRate > 10 ? "#ef4444" : "#10b981"} />
               ))}
            </div>
         </ChartSection>
         <ChartSection title="Route Temperature/Humidity Stability Graph" desc="Performance comparison">
            <ResponsiveContainer width="100%" height={260}>
               <LineChart data={routeData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="route" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" name="Efficiency Score" dataKey="efficiency" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
               </LineChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="High-Risk Zone Detection Map" desc="Areas requiring immediate mitigation">
            <div style={{ padding: 20, background: "#f8fafc", borderRadius: 12, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
               <span style={{ color: "#94a3b8", fontWeight: 500 }}>Predictive Route Heatmap Component Loaded via Map API</span>
            </div>
         </ChartSection>
       </div>
    </div>
  );
}

export function CargoDashboard() {
  const cargoData = [ { n: 'Pharma', v: 45, comp: 99 }, { n: 'Frozen', v: 30, comp: 85 }, { n: 'Electronics', v: 15, comp: 100 }, { n: 'Chemicals', v: 10, comp: 92 } ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Cargo Risk Score" value="12.4" sub="Standard Matrix" color="#2563eb" />
          <MetricCard label="Temperature Compliance" value="99.8%" sub="Highly Regulated" color="#10b981" />
          <MetricCard label="Spoilage / Damage Risk Prediction" value="0.5%" sub="Forecast value" color="#14b8a6" />
          <MetricCard label="Cargo Exposure Time" value="Avg 4h" sub="Outside optimal zone" color="#8b5cf6" />
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
         <ChartSection title="Trips by Cargo Type Distribution" desc="Volume segment mapping">
            <ResponsiveContainer width="100%" height={260}>
               <PieChart>
                 <Pie data={cargoData} innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="v" nameKey="n">
                    {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                 </Pie>
                 <Tooltip />
                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
               </PieChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="Cargo Safety / Exposure over Time" desc="Environmental risk over trip distance" drillable>
            <ResponsiveContainer width="100%" height={260}>
               <AreaChart data={[{km:0, r:10}, {km:100, r:12}, {km:200, r:25}, {km:300, r:18}, {km:400, r:11}]} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="km" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Area type="monotone" name="Risk Exposure" dataKey="r" stroke="#ec4899" fill="#ec4899" fillOpacity={0.15} strokeWidth={3} />
               </AreaChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="Cargo Temperature & Humidity Compliance" desc="Performance per shipment type">
            <ResponsiveContainer width="100%" height={260}>
               <BarChart data={cargoData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Legend />
                  <Bar dataKey="comp" name="Compliance %" fill="#10b981" radius={[4,4,0,0]} barSize={40} />
               </BarChart>
            </ResponsiveContainer>
         </ChartSection>
       </div>
    </div>
  );
}

export function FleetDashboard() {
  const fleetData = [ { d:'Mon', util: 85, alert: 12 }, { d:'Tue', util: 88, alert: 8 }, { d:'Wed', util: 92, alert: 5 }, { d:'Thu', util: 80, alert: 15 }, { d:'Fri', util: 95, alert: 2 } ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Total Trucks Monitored" value="845" sub="Owned + 3PL" color="#0f172a" />
          <MetricCard label="Trucks Active vs Idle" value="624 / 221" sub="En Route vs Parked" color="#2563eb" />
          <MetricCard label="Average trips per vehicle" value="2.4 / week" sub="Optimal usage" color="#64748b" />
          <MetricCard label="Fleet utilization rate" value="73.8%" sub="Above industry avg" color="#10b981" />
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
         <ChartSection title="Fleet Demand & Utilization Prediction" desc="Capacity planning insights" drillable>
            <ResponsiveContainer width="100%" height={260}>
               <LineChart data={fleetData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Line type="basis" name="Utilization %" dataKey="util" stroke="#f43f5e" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: "#fff" }} />
               </LineChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="Fleet Alert Frequency & Temperature Compliance" desc="Track issues mapped to vehicles">
            <ResponsiveContainer width="100%" height={260}>
               <BarChart data={fleetData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="alert" name="Alerts Generated" fill="#f59e0b" radius={[4,4,0,0]} barSize={40} />
               </BarChart>
            </ResponsiveContainer>
         </ChartSection>
       </div>
    </div>
  );
}
