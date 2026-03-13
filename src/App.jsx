import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import LiveTracking from "./components/LiveTracking";
import TripList from "./components/TripList";
import AlertPanel from "./components/AlertPanel";
import IoTAnalytics from "./components/IoTAnalytics";
import CreateTrip from "./components/CreateTrip";
import History from "./components/History";
import TruckOnboard from "./components/TruckOnboard";

const PAGE_META = {
  dashboard: { title: "Fleet Dashboard",   subtitle: "Real-time overview of all trucks and shipments" },
  tracking:  { title: "Live Tracking",     subtitle: "Monitor truck locations in real-time on Google Maps" },
  trips:     { title: "Trips & Shipments", subtitle: "Manage and track all active trips" },
  history:   { title: "History",           subtitle: "Playback trails and review past movement" },
  alerts:    { title: "Alert Center",      subtitle: "IoT sensor alerts and notifications" },
  analytics: { title: "IoT Analytics",    subtitle: "Sensor data, trends and diagnostics" },
  create:    { title: "Create New Trip",   subtitle: "Schedule a shipment and configure IoT monitoring" },
};

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [showOnboard, setShowOnboard] = useState(false);
  const meta = PAGE_META[active] || PAGE_META.dashboard;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F4F6FB", overflow: "hidden" }}>
      <Sidebar
        active={active}
        setActive={setActive}
        onProfileClick={() => {
          setActive("dashboard");
          setShowOnboard(true);
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header title={meta.title} subtitle={meta.subtitle} setActive={setActive} />
        <main style={{ flex: 1, overflow: "auto" }}>
          {active === "dashboard" && <Dashboard setActive={setActive} />}
          {active === "tracking"  && <LiveTracking />}
          {active === "trips"     && <TripList />}
          {active === "history"   && <History />}
          {active === "alerts"    && <AlertPanel />}
          {active === "analytics" && <IoTAnalytics setActive={setActive} />}
          {active === "create"    && (
            <CreateTrip onClose={() => setActive("dashboard")} onCreate={() => setActive("trips")} />
          )}
        </main>
        {showOnboard && <TruckOnboard onClose={() => setShowOnboard(false)} />}
      </div>
    </div>
  );
}
