function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function pad3(n) { return String(n).padStart(3, "0"); }

const CITY_SEEDS = [
  { name: "Mumbai",      center: { lat: 19.076,  lng: 72.8777 } },
  { name: "Pune",        center: { lat: 18.5204, lng: 73.8567 } },
  { name: "Delhi",       center: { lat: 28.6139, lng: 77.209 } },
  { name: "Bengaluru",   center: { lat: 12.9716, lng: 77.5946 } },
  { name: "Hyderabad",   center: { lat: 17.385,  lng: 78.4867 } },
  { name: "Chennai",     center: { lat: 13.0827, lng: 80.2707 } },
  { name: "Ahmedabad",   center: { lat: 23.0225, lng: 72.5714 } },
  { name: "Kolkata",     center: { lat: 22.5726, lng: 88.3639 } },
];

const DRIVER_FIRST = ["Rajan", "Suresh", "Anil", "Pradeep", "Meera", "Kavya", "Rahul", "Amit", "Vijay", "Neha", "Arjun", "Imran", "Sanjay", "Deepak", "Nisha", "Pooja"];
const DRIVER_LAST  = ["Kumar", "Patil", "Singh", "Verma", "Sharma", "Reddy", "Nair", "Gupta", "Iyer", "Das", "Khan", "Jain"];
const VEHICLES = ["Tata Ace", "Ashok Leyland", "Eicher Pro", "Mahindra Bolero", "TATA 407", "Eicher 10.90", "BharatBenz", "Volvo FM"];

const GOODS_CATALOG = [
  { name: "Pharmaceutical Drugs", tempSensitive: true },
  { name: "Dairy Products", tempSensitive: true },
  { name: "Frozen Meat", tempSensitive: true },
  { name: "Ice Cream", tempSensitive: true },
  { name: "FMCG Products", tempSensitive: false },
  { name: "Auto Parts", tempSensitive: false },
  { name: "Electronic Components", tempSensitive: false },
  { name: "Textiles", tempSensitive: false },
];

export function generateFleetData({ truckCount = 2000, seed = 240313 } = {}) {
  const rand = mulberry32(seed);

  const TRUCKS = [];
  const TRIPS = [];

  const now = Date.now();
  const startBase = now - 1000 * 60 * 60 * 6; // started up to ~6h ago

  for (let i = 1; i <= truckCount; i++) {
    const id = `TRK-${pad3(i)}`;
    const city = CITY_SEEDS[Math.floor(rand() * CITY_SEEDS.length)];
    const dLat = (rand() - 0.5) * 0.5;
    const dLng = (rand() - 0.5) * 0.5;
    const baseLat = city.center.lat + dLat;
    const baseLng = city.center.lng + dLng;

    const driver = `${DRIVER_FIRST[Math.floor(rand() * DRIVER_FIRST.length)]} ${DRIVER_LAST[Math.floor(rand() * DRIVER_LAST.length)]}`;
    const vehicle = `${VEHICLES[Math.floor(rand() * VEHICLES.length)]} - ${["MH","DL","KA","TS","TN","GJ","WB"][Math.floor(rand()*7)]} ${Math.floor(rand()*90+10)} ${["AB","CD","EF","GH","JK"][Math.floor(rand()*5)]} ${Math.floor(rand()*9000+1000)}`;

    // Status distribution for realism
    const r = rand();
    const status = r < 0.72 ? "in_transit" : r < 0.85 ? "loading" : r < 0.95 ? "delivered" : "alert";

    const speed = status === "in_transit" ? Math.round(35 + rand() * 45)
      : status === "alert" ? Math.round(25 + rand() * 40)
      : 0;

    const fuel = Math.round(20 + rand() * 80);
    const tempBase = 2 + rand() * 6;
    const temp = status === "alert" && rand() < 0.6 ? Math.round((8 + rand() * 8) * 10) / 10 : Math.round(tempBase * 10) / 10;
    const humidity = Math.round(45 + rand() * 45);
    const engineTemp = Math.round(65 + rand() * 55);
    const batteryVoltage = Math.round((11.6 + rand() * 2.8) * 10) / 10;

    const tripId = `TRIP-${240000 + i}`;

    // Trip endpoints: within ~150-350km
    const originCoords = { lat: baseLat, lng: baseLng };
    const destCity = CITY_SEEDS[Math.floor(rand() * CITY_SEEDS.length)];
    const destCoords = {
      lat: destCity.center.lat + (rand() - 0.5) * 0.45,
      lng: destCity.center.lng + (rand() - 0.5) * 0.45,
    };

    // Progress: delivered => 100, loading => 0, else random 0..95
    const progress = status === "delivered" ? 100 : status === "loading" ? 0 : Math.round(rand() * 95);

    const startTime = new Date(startBase + rand() * (now - startBase)).toISOString();
    const etaMin = status === "delivered" ? 0 : Math.round(30 + rand() * 360);
    const eta = new Date(now + etaMin * 60 * 1000).toISOString();

    const goodsCount = 1 + Math.floor(rand() * 3);
    const goods = Array.from({ length: goodsCount }).map(() => {
      const g = GOODS_CATALOG[Math.floor(rand() * GOODS_CATALOG.length)];
      const qty = `${Math.floor(50 + rand() * 450)} units`;
      const weight = `${Math.floor(80 + rand() * 1200)} kg`;
      return { name: g.name, qty, weight, tempSensitive: g.tempSensitive };
    });

    const distance = Math.round(80 + rand() * 420);

    TRUCKS.push({
      id,
      driver,
      phone: `+91 ${Math.floor(6000000000 + rand() * 3999999999)}`,
      vehicle,
      status,
      lat: baseLat,
      lng: baseLng,
      speed,
      fuel,
      temp,
      humidity,
      engineTemp,
      batteryVoltage,
      trip: tripId,
    });

    TRIPS.push({
      id: tripId,
      truckId: id,
      origin: `${city.name} Hub`,
      destination: `${destCity.name} Depot`,
      originCoords,
      destCoords,
      goods,
      status,
      startTime,
      eta,
      distance,
      progress,
    });
  }

  // Basic alerts derived from some trucks in alert status
  const ALERTS = TRUCKS.filter((t) => t.status === "alert").slice(0, 40).flatMap((t, idx) => {
    const tripId = t.trip;
    const baseTime = new Date(now - (idx * 3 + 5) * 60 * 1000).toISOString();
    return [
      {
        id: `ALT-${pad3(idx + 1)}`,
        truckId: t.id,
        tripId,
        type: "temperature",
        severity: "critical",
        message: `Temperature breach! Current: ${t.temp}°C. Limit: 8°C.`,
        time: baseTime,
        acknowledged: false,
      },
    ];
  });

  // Keep the charts usable (small aggregates)
  const TEMP_HISTORY = Array.from({ length: 12 }).map((_, i) => {
    const hh = String(8 + Math.floor(i / 2)).padStart(2, "0");
    const mm = i % 2 === 0 ? "00" : "30";
    return { time: `${hh}:${mm}`, Avg: Math.round((3.5 + rand() * 5.5) * 10) / 10, Alert: Math.round((7 + rand() * 6) * 10) / 10 };
  });

  const SPEED_HISTORY = Array.from({ length: 12 }).map((_, i) => {
    const hh = String(8 + Math.floor(i / 2)).padStart(2, "0");
    const mm = i % 2 === 0 ? "00" : "30";
    return { time: `${hh}:${mm}`, Avg: Math.round(35 + rand() * 35), Peak: Math.round(55 + rand() * 35) };
  });

  return { TRUCKS, TRIPS, ALERTS, TEMP_HISTORY, SPEED_HISTORY };
}

const GENERATED = generateFleetData({ truckCount: 50, seed: 240313 });
export const TRUCKS = GENERATED.TRUCKS;

export const TRIPS = GENERATED.TRIPS;

export const ALERTS = GENERATED.ALERTS;

export const TEMP_HISTORY = GENERATED.TEMP_HISTORY;

export const SPEED_HISTORY = GENERATED.SPEED_HISTORY;

// ── Derived admin-friendly structures ─────────────────────────────────────────

// Shipments are just trips with a bit more UI-ready metadata.
export const SHIPMENTS = TRIPS.map((trip) => {
  const truck = TRUCKS.find((t) => t.id === trip.truckId);
  const coldChain = trip.goods.some((g) => g.tempSensitive);
  const cityFrom = trip.origin.split(",")[0] || trip.origin;
  const cityTo = trip.destination.split(",")[0] || trip.destination;

  return {
    id: trip.id,
    truckId: trip.truckId,
    truckLabel: truck ? truck.vehicle : "",
    driver: truck?.driver || "",
    coldChain,
    status: trip.status,
    origin: trip.origin,
    destination: trip.destination,
    originCity: cityFrom,
    destinationCity: cityTo,
    startTime: trip.startTime,
    eta: trip.eta,
    distanceKm: trip.distance,
    progress: trip.progress,
    goods: trip.goods,
  };
});

// Synthetic history trail per shipment, suitable for route playback / analytics.
// This is straight-line interpolation between origin/destination with modest jitter.
export const HISTORY_POINTS = (() => {
  const map = {};
  const now = Date.now();
  TRIPS.forEach((trip, idx) => {
    const rand = mulberry32(9000 + idx);
    const points = [];
    const start = new Date(trip.startTime).getTime();
    const end = new Date(trip.eta).getTime();
    const totalMs = Math.max(15 * 60 * 1000, end - start); // at least 15m
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const ts = start + p * totalMs;
      const lat = trip.originCoords.lat + (trip.destCoords.lat - trip.originCoords.lat) * p + (rand() - 0.5) * 0.01;
      const lng = trip.originCoords.lng + (trip.destCoords.lng - trip.originCoords.lng) * p + (rand() - 0.5) * 0.01;
      const baseSpeed = 40 + rand() * 40;
      const baseTemp = 3 + rand() * 6;
      const status = trip.status === "delivered" && ts > now ? "in_transit" : trip.status;
      points.push({
        timestamp: new Date(ts).toISOString(),
        lat,
        lng,
        speed: Math.round(baseSpeed + (rand() - 0.5) * 12),
        temp: Math.round((baseTemp + (rand() - 0.5) * 2) * 10) / 10,
        status,
      });
    }
    map[trip.id] = points;
  });
  return map;
})();

// Per-truck IoT summary (simple aggregates that can drive the analytics UI).
export const TRUCK_IOT_SUMMARY = (() => {
  const byTruck = {};
  SHIPMENTS.forEach((s) => {
    const truckId = s.truckId;
    const history = HISTORY_POINTS[s.id] || [];
    if (!history.length) return;
    let speedSum = 0;
    let tempSum = 0;
    let maxSpeed = 0;
    let maxTemp = -Infinity;
    let tempBreachCount = 0;
    history.forEach((p) => {
      speedSum += p.speed;
      tempSum += p.temp;
      if (p.speed > maxSpeed) maxSpeed = p.speed;
      if (p.temp > maxTemp) maxTemp = p.temp;
      if (p.temp > 8) tempBreachCount += 1;
    });
    const n = history.length;
    byTruck[truckId] = {
      truckId,
      avgSpeed: Math.round(speedSum / n),
      peakSpeed: maxSpeed,
      avgTemp: Math.round((tempSum / n) * 10) / 10,
      peakTemp: maxTemp,
      tempBreachCount,
    };
  });
  return byTruck;
})();

// ── Helper getters for components ─────────────────────────────────────────────

export function getTruckById(truckId) {
  return TRUCKS.find((t) => t.id === truckId) || null;
}

export function getTripById(tripId) {
  return TRIPS.find((t) => t.id === tripId) || null;
}

export function getShipmentById(shipmentId) {
  return SHIPMENTS.find((s) => s.id === shipmentId) || null;
}

export function getShipmentsForTruck(truckId) {
  return SHIPMENTS.filter((s) => s.truckId === truckId);
}

export function getHistoryForShipment(shipmentId) {
  return HISTORY_POINTS[shipmentId] || [];
}

export function getTruckIotSummary(truckId) {
  return TRUCK_IOT_SUMMARY[truckId] || null;
}

