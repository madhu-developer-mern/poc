import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, Legend, ComposedChart } from "recharts";
import { MetricCard, ChartSection, COLORS, ProgressRow } from "./SharedUi";

export function TripPerformanceDashboard() {
  const barData = [
    { name: "Mon", trips: 45, delayed: 4 }, { name: "Tue", trips: 52, delayed: 2 }, { name: "Wed", trips: 38, delayed: 5 },
    { name: "Thu", trips: 65, delayed: 1 }, { name: "Fri", trips: 48, delayed: 3 }, { name: "Sat", trips: 80, delayed: 8 }, { name: "Sun", trips: 40, delayed: 2 }
  ];
  const routeData = [ { name: "MUM-DEL", trips: 140 }, { name: "BLR-CHN", trips: 110 }, { name: "HYD-PUN", trips: 90 }, { name: "DEL-KOL", trips: 60 } ];
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <MetricCard label="Total Trips Completed" value="1,248" sub="Trips Completed" color="#2563eb" />
        <MetricCard label="Active Trips Count" value="42" sub="Currently En Route" color="#7c3aed" />
        <MetricCard label="Trips Completed on Time" value="94.2%" sub="Success Rate" color="#10b981" />
        <MetricCard label="Delayed / Cancelled" value="5.8%" sub="Requires Attention" color="#ef4444" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <ChartSection title="Trips Completed & Delayed per Day" desc="Weekly volume overview">
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={barData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip cursor={{ fill: "#f8fafc" }} />
              <Legend />
              <Bar dataKey="trips" name="Completed" fill="#2563eb" radius={[4,4,0,0]} />
              <Line type="monotone" dataKey="delayed" name="Delayed" stroke="#ef4444" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartSection>
        <ChartSection title="Estimated Arrival Prediction" desc="Projected trip delivery timeline" drillable>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={barData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip />
              <Area type="monotone" dataKey="trips" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartSection>
        <ChartSection title="Trips per Route" desc="Volume distribution across main hubs">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={routeData} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#0f172a", fontWeight: 700 }} />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="trips" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>
        <ChartSection title="Trip Duration Prediction" desc="Average duration trends">
          <ResponsiveContainer width="100%" height={260}>
             <LineChart data={barData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip />
                <Line type="basis" dataKey="trips" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
             </LineChart>
          </ResponsiveContainer>
        </ChartSection>
      </div>
    </div>
  );
}

export function TemperatureDashboard() {
  const trendData = [
    { t: "10:00", temp: 4.8, pred: 4.9, max: 8, min: 2 }, { t: "11:00", temp: 5.1, pred: 5.2, max: 8, min: 2 }, { t: "12:00", temp: 5.4, pred: 6.0, max: 8, min: 2 }, { t: "13:00", temp: 8.2, pred: 7.5, max: 8, min: 2 },
    { t: "14:00", temp: 6.1, pred: 5.8, max: 8, min: 2 }, { t: "15:00", temp: 4.8, pred: 4.5, max: 8, min: 2 }, { t: "16:00", temp: 4.5, pred: 4.4, max: 8, min: 2 }
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <MetricCard label="Average Temperature" value="4.8°C" sub="Within 2-8°C Range" color="#2563eb" />
        <MetricCard label="Temperature Breach Count" value="14" sub="Last 24 hours" color="#ef4444" />
        <MetricCard label="Temperature Stability Score" value="98.2" sub="Highly Stable" color="#10b981" />
        <MetricCard label="Max / Min Recorded" value="12.4°C / 1.1°C" sub="Route: Delhi-MUM" color="#f59e0b" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <ChartSection title="Temperature Variability vs Time & Prediction" desc="Real-time exposure modeling and forecast">
          <ResponsiveContainer width="100%" height={260}>
             <ComposedChart data={trendData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" name="Actual Temp" dataKey="temp" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" name="Predicted Temp" dataKey="pred" stroke="#2563eb" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                <Line type="step" name="Max Limit" dataKey="max" stroke="#ef4444" strokeWidth={1} dot={false} />
             </ComposedChart>
          </ResponsiveContainer>
        </ChartSection>
        <ChartSection title="Temperature Distribution" desc="Histogram of readings across all shipments" drillable>
           <ResponsiveContainer width="100%" height={260}>
              <BarChart data={[{range: '0-2°C', count: 12}, {range: '2-4°C', count: 140}, {range: '4-6°C', count: 280}, {range: '6-8°C', count: 180}, {range: '>8°C', count: 18}]} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                 <Tooltip />
                 <Bar dataKey="count" fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
           </ResponsiveContainer>
        </ChartSection>
        <ChartSection title="Temperature Compliance by Route">
           <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
              <ProgressRow label="MUM-DEL (Mumbai to Delhi)" val={92} color="#f59e0b" />
              <ProgressRow label="BLR-CHN (Bangalore to Chennai)" val={99} color="#10b981" />
              <ProgressRow label="HYD-PUN (Hyderabad to Pune)" val={96} color="#2563eb" />
           </div>
        </ChartSection>
        <ChartSection title="Breach Distribution by Hub" drillable>
           <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={[{n:'Mumbai', v:45}, {n:'Delhi', v:25}, {n:'Chennai', v:20}, {n:'Pune', v:10}]} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="v" nameKey="n">
                   {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
           </ResponsiveContainer>
        </ChartSection>
      </div>
    </div>
  );
}

export function HumidityDashboard() {
  const humData = [ { d: "Day 1", h: 44, pred: 45 }, { d: "Day 2", h: 48, pred: 50 }, { d: "Day 3", h: 65, pred: 62 }, { d: "Day 4", h: 55, pred: 52 }, { d: "Day 5", h: 45, pred: 46 } ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Avg Humidity across trips" value="48.2%" sub="Ideal (40-60%)" color="#06b6d4" />
          <MetricCard label="Humidity Stability Score" value="94.2" sub="Safe Threshold" color="#10b981" />
          <MetricCard label="Max / Min Recorded" value="68% / 35%" sub="Warning levels" color="#f59e0b" />
          <MetricCard label="Humidity Breach Count" value="8 Alerts" sub="Immediate review needed" color="#ef4444" />
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
         <ChartSection title="Humidity Fluctuation & Prediction" desc="Forecast of moisture index across active zones" drillable>
            <ResponsiveContainer width="100%" height={260}>
               <ComposedChart data={humData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" name="Actual Humidity" dataKey="h" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={3} />
                  <Line type="monotone" name="Predicted Breach Risk" dataKey="pred" stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} dot={false} />
               </ComposedChart>
            </ResponsiveContainer>
         </ChartSection>
         <ChartSection title="Humidity Distribution" desc="Histogram of readings">
            <ResponsiveContainer width="100%" height={260}>
               <BarChart data={[{range: '<40%', count: 10}, {range: '40-50%', count: 150}, {range: '50-60%', count: 120}, {range: '>60%', count: 15}]} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4,4,0,0]} />
               </BarChart>
            </ResponsiveContainer>
         </ChartSection>
       </div>
    </div>
  );
}
