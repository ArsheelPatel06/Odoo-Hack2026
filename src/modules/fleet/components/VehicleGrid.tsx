"use client";

import { useState } from "react";
import { VehicleCard } from "./VehicleCard";
import { FleetDetailDrawer } from "./FleetDetailDrawer";
import type { Vehicle } from "@/shared/domain/models";

type VehicleGridProps = {
  vehicles: Vehicle[];
  viewMode?: "grid" | "list";
};

export function VehicleGrid({ vehicles, viewMode = "grid" }: VehicleGridProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  if (vehicles.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white text-slate-500">
        <p>No vehicles found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Main Grid Area */}
      <div 
        className={
          viewMode === "grid" 
            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            : "flex flex-col gap-4"
        }
      >
        {vehicles.map((vehicle) => (
          <VehicleCard 
            key={vehicle.id} 
            vehicle={vehicle} 
            onClick={() => setSelectedVehicle(vehicle)} 
            isList={viewMode === "list"}
          />
        ))}
      </div>

      {/* Slide-in Sticky Drawer */}
      {selectedVehicle && (
        <FleetDetailDrawer 
          vehicle={selectedVehicle} 
          onClose={() => setSelectedVehicle(null)} 
        />
      )}
      
    </div>
  );
}
