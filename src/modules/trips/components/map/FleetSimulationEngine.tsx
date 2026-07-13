"use client";

import { useState, useCallback } from "react";
import { MapplsSimulatedTrip, MapplsTripStats } from "./MapplsSimulatedTrip";
import { LatLng } from "../../services/simulationService";
import { TrackingOverlay } from "./TrackingOverlay";

export type MockRoute = {
  id: string;
  name: string;
  driverName: string;
  vehicleName: string;
  color: string;
  origin: LatLng;
  destination: LatLng;
};

// Bengaluru Mock Routes
export const MOCK_ROUTES: MockRoute[] = [
  {
    id: "trip-001",
    name: "Cubbon Park to Indiranagar",
    driverName: "Rahul Mehta",
    vehicleName: "Van-05",
    color: "#3b82f6", // blue
    origin: { lat: 12.9763, lng: 77.5929 },
    destination: { lat: 12.9716, lng: 77.6411 },
  },
  {
    id: "trip-002",
    name: "MG Road to Whitefield",
    driverName: "Priya Nair",
    vehicleName: "Truck-12",
    color: "#8b5cf6", // violet
    origin: { lat: 12.9738, lng: 77.6119 },
    destination: { lat: 12.9698, lng: 77.7499 },
  },
  {
    id: "trip-003",
    name: "Electronic City to HSR",
    driverName: "Alex",
    vehicleName: "Transit-Alpha",
    color: "#10b981", // emerald
    origin: { lat: 12.8452, lng: 77.6602 },
    destination: { lat: 12.9141, lng: 77.6411 },
  },
];

export function FleetSimulationEngine({ isActive }: { isActive: boolean }) {
  const [activeTrips, setActiveTrips] = useState<MockRoute[]>(isActive ? MOCK_ROUTES : []);
  const [tripStats, setTripStats] = useState<Record<string, MapplsTripStats>>({});
  const [completedTrips, setCompletedTrips] = useState<string[]>([]);

  // Watch for toggle to activate
  if (isActive && activeTrips.length === 0 && completedTrips.length === 0) {
    setActiveTrips(MOCK_ROUTES);
  } else if (!isActive && (activeTrips.length > 0 || completedTrips.length > 0)) {
    setActiveTrips([]);
    setTripStats({});
    setCompletedTrips([]);
  }

  const handleStatsUpdate = useCallback((stats: MapplsTripStats) => {
    setTripStats((prev) => ({
      ...prev,
      [stats.id]: stats,
    }));
  }, []);

  const handleArrived = useCallback((id: string) => {
    setCompletedTrips((prev) => [...prev, id]);
    
    // In a real simulation we could trigger a loop or start a new trip here
    // For now, let's keep it in "completed" state for 3 seconds then remove it from active
    setTimeout(() => {
      setActiveTrips((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <>
      {activeTrips.map((route) => (
        <MapplsSimulatedTrip
          key={route.id}
          id={route.id}
          origin={route.origin}
          destination={route.destination}
          color={route.color}
          onStatsUpdate={handleStatsUpdate}
          onArrived={handleArrived}
        />
      ))}
      
      {/* Floating Tracking Overlays */}
      <div className="absolute left-6 top-6 z-10 flex flex-col gap-4 pointer-events-none">
        {activeTrips.map((route) => (
          <TrackingOverlay
            key={`overlay-${route.id}`}
            route={route}
            stats={tripStats[route.id]}
            isCompleted={completedTrips.includes(route.id)}
          />
        ))}
      </div>
    </>
  );
}
