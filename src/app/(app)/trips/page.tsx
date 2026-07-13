"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { tripManagementService } from "@/shared/mock-data";
import { TripsHero, TripsBoard } from "@/modules/trips/components";
import { LiveMapModule } from "@/modules/trips/components/map/LiveMapModule";
import { TripStatus } from "@/shared/domain/enums";
import { Button } from "@/shared/components/ui";
import { LayoutGrid, Map as MapIcon, PlayCircle, StopCircle } from "lucide-react";

export default function TripsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"board" | "map">("map"); // Default to map for the demo
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Fetch data
  const trips = tripManagementService.listTrips({ pagination: { page: 1, pageSize: 200 } }).items;

  // Basic stats for the hero
  const activeTrips = trips.filter(t => t.status === TripStatus.Dispatched || t.status === TripStatus.InTransit).length;
  const inTransit = trips.filter(t => t.status === TripStatus.InTransit).length;
  const completedToday = trips.filter(t => t.status === TripStatus.Completed).length; 

  return (
    <div className="flex h-[calc(100vh-32px)] flex-col gap-6 pt-4 pb-4 overflow-hidden">
      
      {/* Scrollable Main Area */}
      <div className="flex flex-col gap-6 overflow-y-auto px-4 scrollbar-hide pb-12">
        <TripsHero 
          activeTrips={activeTrips}
          completedToday={completedToday}
          inTransit={inTransit}
          scheduled={trips.length - activeTrips - completedToday}
          onDispatchClick={() => router.push("/trips/dispatch")}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Active Operations</h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
              <button
                onClick={() => setViewMode("board")}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  viewMode === "board" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <LayoutGrid className="size-4" />
                Board
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  viewMode === "map" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <MapIcon className="size-4" />
                Map
              </button>
            </div>
          </div>
        </div>

        {viewMode === "board" ? (
          <TripsBoard 
            trips={trips}
            onTripClick={(trip) => router.push(`/trips/${trip.id}`)}
            onTripMoved={() => setRefreshKey(k => k + 1)}
          />
        ) : (
          <LiveMapModule 
            apiKey={process.env.NEXT_PUBLIC_MAPPLS_API_KEY || ""}
            isDemoActive={isDemoActive}
          />
        )}
      </div>

    </div>
  );
}
