"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TripStatus } from "@/shared/domain/enums";
import type { TripDetail } from "@/modules/trips/types";
import { MapplsTripStats } from "./MapplsSimulatedTrip";
import { motion, AnimatePresence } from "framer-motion";
import { User, Truck, ShieldCheck, Zap } from "lucide-react";

const LeafletMap = dynamic(
  () => import("@/shared/components/ui/LeafletMap").then(mod => mod.LeafletMap),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-100">Loading Map...</div> }
);

interface SingleTripLiveMapProps {
  detail: TripDetail;
  onStatsUpdate: (stats: MapplsTripStats) => void;
}

const CITY_COORDS: Record<string, { lat: number, lng: number }> = {
  mumbai: { lat: 19.0760, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  nashik: { lat: 20.0059, lng: 73.7898 },
  delhi: { lat: 28.7041, lng: 77.1025 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 }
};

function getCoordinatesForCity(city: string) {
  const lowercaseCity = city.toLowerCase();
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (lowercaseCity.includes(key)) return coords;
  }
  return CITY_COORDS.bengaluru; // default fallback
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function SingleTripLiveMap({ detail, onStatsUpdate }: SingleTripLiveMapProps) {
  const originCoord = getCoordinatesForCity(detail.trip.origin);
  const destCoord = getCoordinatesForCity(detail.trip.destination);
  
  const isActiveTrip = detail.trip.status === TripStatus.Dispatched || detail.trip.status === TripStatus.InTransit;
  const isCompleted = detail.trip.status === TripStatus.Completed;
  
  const [currentPos, setCurrentPos] = useState(isCompleted ? destCoord : originCoord);
  const [progress, setProgress] = useState(isCompleted ? 1 : 0);
  const [liveStats, setLiveStats] = useState<MapplsTripStats | null>(null);
  const [notification, setNotification] = useState<{ message: string; id: number } | null>(null);

  useEffect(() => {
    if (!isActiveTrip) return;

    let startTime = Date.now();
    const duration = 120000; // 2 minutes simulation

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let p = elapsed / duration;
      if (p >= 1) p = 1;

      setProgress(p);

      const lat = originCoord.lat + (destCoord.lat - originCoord.lat) * p;
      const lng = originCoord.lng + (destCoord.lng - originCoord.lng) * p;
      setCurrentPos({ lat, lng });

      const totalDist = calculateDistance(originCoord.lat, originCoord.lng, destCoord.lat, destCoord.lng);
      const remainingDist = (totalDist * (1 - p)).toFixed(1);
      const speed = p >= 1 ? 0 : Math.floor(40 + Math.random() * 20);
      const etaMinutes = p >= 1 ? 0 : Math.ceil(((totalDist * (1 - p)) / speed) * 60);

      const stats = {
        id: detail.trip.id,
        speed,
        distanceRemainingKm: Number(remainingDist),
        etaMinutes,
        progress: p,
      };
      
      setLiveStats(stats);
      onStatsUpdate(stats);

      if (p > 0.1 && p < 0.15) {
        setNotification({ message: "Departed from Origin", id: 1 });
      } else if (p > 0.5 && p < 0.55) {
        setNotification({ message: "Halfway Checkpoint Crossed", id: 2 });
      } else if (p > 0.85 && p < 0.9) {
        setNotification({ message: "Approaching Destination", id: 3 });
      }

      if (p >= 1) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActiveTrip, detail.trip.id, originCoord.lat, originCoord.lng, destCoord.lat, destCoord.lng, onStatsUpdate]);

  return (
    <LeafletMap 
      origin={originCoord} 
      destination={destCoord} 
      currentPos={currentPos} 
      isActive={isActiveTrip}
    >
      <div className="flex justify-between items-start pointer-events-none">
        {/* Floating Notification */}
        <div className="w-full max-w-sm">
          <AnimatePresence>
            {notification && (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white rounded-lg p-3 shadow-xl flex items-center gap-3 pointer-events-auto"
              >
                <div className="bg-indigo-500/20 p-2 rounded-full">
                  <Zap className="size-4 text-indigo-400" />
                </div>
                <span className="text-sm font-medium">{notification.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Driver/Vehicle Card */}
        {isActiveTrip && liveStats && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white rounded-xl p-4 shadow-xl w-64 pointer-events-auto flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 border-b border-slate-700/50 pb-3">
              <div className="bg-slate-800 p-2 rounded-full">
                <User className="size-5 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-semibold">{detail.driver?.name || "Unknown Driver"}</p>
                <p className="text-xs text-slate-400">ID: {detail.driver?.licenseNumber?.slice(0,6) || "N/A"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-full">
                <Truck className="size-5 text-slate-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{detail.vehicle?.registrationNumber || "Unknown Vehicle"}</p>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-emerald-400 font-medium">{liveStats.speed} km/h</span>
                  <span className="text-slate-400">{liveStats.distanceRemainingKm} km left</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">ETA</p>
                <p className="text-sm font-bold text-indigo-400">{liveStats.etaMinutes} mins</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-0.5">Health</p>
                <div className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="size-3" />
                  <span className="text-sm font-bold">98%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </LeafletMap>
  );
}
