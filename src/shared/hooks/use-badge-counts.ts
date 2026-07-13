import { useMemo } from "react";
import { tripManagementService, maintenanceManagementService } from "@/shared/mock-data";
import { TripStatus, MaintenanceStatus } from "@/shared/domain/enums";

export function useBadgeCounts() {
  // In a real app, this would use SWR/React Query to fetch or listen to a WebSocket
  // For the frontend UI build, we just compute it from the mock store once per mount
  
  // We use useMemo to prevent recalculating mock data on every route change render
  const badges = useMemo(() => {
    const trips = tripManagementService.listTrips({ pagination: { page: 1, pageSize: 200 } }).items;
    const maintenance = maintenanceManagementService.listMaintenance({ pagination: { page: 1, pageSize: 200 } }).items;
    
    const activeTrips = trips.filter(t => t.status === TripStatus.Dispatched).length;
    const activeMaintenance = maintenance.filter(m => m.status === MaintenanceStatus.Active).length;
    const criticalAlerts = activeMaintenance > 0 ? 1 : 0;
    
    return {
      trips: activeTrips,
      maintenance: activeMaintenance,
      alerts: criticalAlerts
    };
  }, []);

  return badges;
}
