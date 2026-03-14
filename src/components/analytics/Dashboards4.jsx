import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, Legend, ComposedChart } from "recharts";
import { MetricCard, ChartSection, MetaRow, COLORS } from "./SharedUi";

export function DataReliabilityDashboard() {
  const lossData = [ { t: "00:00", lat: 12, loss: 0.1, succ: 99.9 }, { t: "06:00", lat: 15, loss: 0.2, succ: 99.8 }, { t: "12:00", lat: 45, loss: 0.6, succ: 95.0 }, { t: "18:00", lat: 14, loss: 0.1, succ: 99.9 }, { t: "24:00", lat: 10, loss: 0.05, succ: 100 } ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Sensor data latency" value="1.2s" sub="End-to-End Delay" color="#10b981" />
          <MetricCard label="Data packet loss rate" value="0.08%" sub="Highly reliable" color="#2563eb" />
          <MetricCard label="Missing data detection" value="42 Hubs" sub="Connectivity loss incidents" color="#ef4444" />
          <MetricCard label="Data completeness percentage" value="99.9%" sub="Telemetry index" color="#8b5cf6" />
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
         <ChartSection title="Sensor Data Latency & Transmission Delay" desc="Connectivity failure prediction model" drillable>
            <ResponsiveContainer width="100%" height={260}>
               <AreaChart data={lossData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Area type="monotone" name="Latency (ms)" dataKey="lat" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={3} />
               </AreaChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="IoT Data Ingestion Success Rate" desc="Gateway system health monitor">
            <ResponsiveContainer width="100%" height={260}>
               <LineChart data={lossData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Legend />
                  <Line type="step" name="Success Rate %" dataKey="succ" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
               </LineChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="Monitoring Reliability Score & Sensor Frequency">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
               <MetaRow label="Gateway data delay metrics" value="0.4ms avg" />
               <MetaRow label="Sensor reporting frequency" value="Every 60s" />
               <MetaRow label="System monitoring health" value="Optimal - Green" />
               <MetaRow label="Data loss prediction risk" value="Extremely Low (0.01%)" />
            </div>
         </ChartSection>
       </div>
    </div>
  );
}

export function OperationalDashboard() {
  const delaysData = [ { phase: "Pickup Loading", val: 140 }, { phase: "Transit Route", val: 320 }, { phase: "Customs/Border", val: 80 }, { phase: "Final Delivery", val: 40 } ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Trips requiring intervention" value="12" sub="Manual approvals needed" color="#f59e0b" />
          <MetricCard label="Average response time to alerts" value="4m 12s" sub="Operations Desk SLA" color="#10b981" />
          <MetricCard label="Operational bottleneck detection" value="Border" sub="Customs Check delays" color="#ef4444" />
          <MetricCard label="Overall cold-chain performance" value="88/100" sub="System-wide score" color="#2563eb" />
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
         <ChartSection title="Loading & Delivery Delay Analytics" desc="Time lost per operational phase (minutes)">
            <ResponsiveContainer width="100%" height={260}>
               <BarChart data={delaysData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="phase" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip cursor={{ fill: "transparent" }} wrapperStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="val" name="Delay Duration (mins)" fill="#8b5cf6" radius={[4,4,0,0]} barSize={40} />
               </BarChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="Logistics Efficiency & Driver Compliance" desc="System Performance Dashboard">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
               <MetaRow label="Driver compliance metrics" value="98.5% Compliant" />
               <MetaRow label="Warehouse loading time analytics" value="42 mins avg" />
               <MetaRow label="Trip monitoring coverage" value="100% Monitored" />
               <MetaRow label="Operations risk score" value="Low Risk (12/100)" />
            </div>
         </ChartSection>
         <ChartSection title="Alert Response Time Trend" desc="SLA adherence across operators">
            <ResponsiveContainer width="100%" height={260}>
               <LineChart data={[{d:'Mon', t: 5}, {d:'Tue', t: 4.5}, {d:'Wed', t: 4}, {d:'Thu', t: 6}, {d:'Fri', t: 3}]} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Line type="monotone" name="Response Time (mins)" dataKey="t" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
               </LineChart>
            </ResponsiveContainer>
         </ChartSection>
       </div>
    </div>
  );
}
