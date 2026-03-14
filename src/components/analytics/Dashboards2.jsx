import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, Legend, ComposedChart } from "recharts";
import { MetricCard, ChartSection, COLORS, ProgressRow } from "./SharedUi";

export function AlertDashboard() {
  const alertData = [ { t: "Mon", hr: 12, lr: 40 }, { t: "Tue", hr: 8, lr: 30 }, { t: "Wed", hr: 22, lr: 50 }, { t: "Thu", hr: 14, lr: 35 }, { t: "Fri", hr: 9, lr: 25 }, { t: "Sat", hr: 18, lr: 22 }, { t: "Sun", hr: 5, lr: 14 } ];
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Total Alerts Generated" value="442" sub="Last 7 Days" color="#ef4444" />
          <MetricCard label="Alerts by Severity (High)" value="65" sub="Immediate Action Required" color="#f43f5e" />
          <MetricCard label="Average Alerts per Trip" value="1.2" sub="System Baseline" color="#64748b" />
          <MetricCard label="Upcoming Alert Risk Indicator" value="Low" sub="Predictive Model" color="#10b981" />
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
         <ChartSection title="Alerts per day & Trend Analysis" desc="High vs Low severity incidents over time">
            <ResponsiveContainer width="100%" height={260}>
               <BarChart data={alertData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="hr" name="High Risk" stackId="a" fill="#ef4444" radius={[0,0,0,0]} />
                  <Bar dataKey="lr" name="Low Risk" stackId="a" fill="#fcd34d" radius={[4,4,0,0]} />
               </BarChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="Alerts by Type" desc="Distribution of system events (Temp / Hum / Device)">
            <ResponsiveContainer width="100%" height={260}>
               <PieChart>
                 <Pie data={[{n:'Temperature', v:45}, {n:'Humidity', v:20}, {n:'Device', v:15}, {n:'Route', v:20}]} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="v" nameKey="n">
                    {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                 </Pie>
                 <Tooltip />
                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
               </PieChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="Alerts by Route Dashboard">
           <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
              <ProgressRow label="MUM-DEL (Mumbai to Delhi)" val={42} color="#f43f5e" />
              <ProgressRow label="BLR-CHN (Bangalore to Chennai)" val={24} color="#f59e0b" />
              <ProgressRow label="HYD-PUN (Hyderabad to Pune)" val={15} color="#2563eb" />
           </div>
         </ChartSection>
         <ChartSection title="Alerts per Vehicle" desc="Vehicle ID breakdown">
            <ResponsiveContainer width="100%" height={260}>
               <BarChart data={[{name: 'MH04-1234', count: 12}, {name: 'DL01-5678', count: 8}, {name: 'KA03-9101', count: 6}]} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                 <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                 <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#0f172a", fontWeight: 700 }} />
                 <Tooltip cursor={{ fill: "transparent" }} />
                 <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
            </ResponsiveContainer>
         </ChartSection>
       </div>
    </div>
  );
}

export function DeviceDashboard() {
  const uptimeData = [ { d: "01", u: 99.9, f: 0 }, { d: "02", u: 99.8, f: 1 }, { d: "03", u: 98.5, f: 3 }, { d: "04", u: 99.9, f: 0 }, { d: "05", u: 99.5, f: 2 } ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Total active / online devices" value="2,482" sub="TF10 IoT Assets" color="#2563eb" />
          <MetricCard label="Devices offline / Failure" value="18" sub="Connectivity Issues" color="#f59e0b" />
          <MetricCard label="Device battery health" value="42" sub="Depleting soon" color="#ef4444" />
          <MetricCard label="Device Reliability Score" value="99.2%" sub="Uptime Score" color="#10b981" />
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
         <ChartSection title="Device Uptime & Failure Incidents" desc="Real-time predictive maintenance metrics" drillable>
            <ResponsiveContainer width="100%" height={260}>
               <ComposedChart data={uptimeData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis yAxisId="left" domain={[95, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="step" name="Uptime %" dataKey="u" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
                  <Bar yAxisId="right" name="Offline Incidents" dataKey="f" fill="#f43f5e" barSize={20} radius={[4,4,0,0]} />
               </ComposedChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="Battery Depletion Prediction" desc="Forecast of devices needing charge/replace">
            <ResponsiveContainer width="100%" height={260}>
               <AreaChart data={[{d:'Mon', bat: 80}, {d:'Tue', bat: 60}, {d:'Wed', bat: 40}, {d:'Thu', bat: 20}, {d:'Fri', bat: 5}]} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="bat" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={3} />
               </AreaChart>
            </ResponsiveContainer>
         </ChartSection>
       </div>
    </div>
  );
}

export function GatewayDashboard() {
  const gData = [ { t: "12:00", tp: 120, loss: 0.1 }, { t: "14:00", tp: 250, loss: 0.4 }, { t: "16:00", tp: 180, loss: 0.2 }, { t: "18:00", tp: 300, loss: 1.2 } ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Gateway Uptime / Status" value="99.98%" sub="Enterprise Grade Connectivity" color="#10b981" />
          <MetricCard label="Gateway data throughput" value="1.2 GB/h" sub="Max Load 5GB" color="#2563eb" />
          <MetricCard label="Gateway packet loss" value="0.04%" sub="Stable transmission" color="#14b8a6" />
          <MetricCard label="Gateway offline incidents" value="2" sub="Network reset" color="#ef4444" />
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
         <ChartSection title="Gateway Data Throughput (MB/s)" desc="Traffic density footprint across global nodes">
            <ResponsiveContainer width="100%" height={260}>
               <AreaChart data={gData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="tp" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={3} />
               </AreaChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="Gateway Signal Strength Trends" desc="Coverage analysis across hubs">
            <ResponsiveContainer width="100%" height={260}>
               <LineChart data={gData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="loss" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
               </LineChart>
            </ResponsiveContainer>
         </ChartSection>
       </div>
    </div>
  );
}
