"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FleetHero, OperationsFeed, FleetToolbar, VehicleGrid } from "@/modules/fleet/components";
import { fleetVehicleService } from "@/modules/fleet";
import { VehicleStatus } from "@/shared/domain/enums";
import Papa from "papaparse";

export default function FleetPage() {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "needs_service">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const allVehicles = useMemo(() => {
    return fleetVehicleService.listVehicles({
      pagination: { page: 1, pageSize: 60 }
    }).items;
  }, []);

  const filteredVehicles = useMemo(() => {
    return allVehicles.filter(v => {
      // Status Filter
      if (statusFilter === "available" && v.status !== VehicleStatus.Available) return false;
      if (statusFilter === "needs_service" && v.status !== VehicleStatus.InShop) return false;
      
      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(query);
        const matchesRegistration = v.registrationNumber.toLowerCase().includes(query);
        const matchesType = v.type.toLowerCase().includes(query);
        
        if (!matchesName && !matchesRegistration && !matchesType) return false;
      }
      
      return true;
    });
  }, [allVehicles, searchQuery, statusFilter]);

  const handleExport = () => {
    const exportData = filteredVehicles.map(v => ({
      ID: v.id,
      Name: v.name,
      "Registration Number": v.registrationNumber,
      Status: v.status,
      Capacity: v.capacity,
      "Current Mileage (km)": v.odometerReading,
    }));
    
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fleet_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-[calc(100vh-32px)] flex-col gap-6 pt-4 pb-4 overflow-hidden">
      
      {/* Scrollable Main Area (Header to Grid) */}
      <div className="flex flex-col gap-6 overflow-y-auto px-4 scrollbar-hide pb-12">
        <FleetHero 
          health={97} 
          total={64} 
          running={18} 
          available={42} 
          service={4}
          onRegisterClick={() => router.push("/fleet/new")}
        />

        <OperationsFeed />

        <FleetToolbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onExport={handleExport}
        />

        <VehicleGrid vehicles={filteredVehicles} viewMode={viewMode} />
      </div>

    </div>
  );
}
