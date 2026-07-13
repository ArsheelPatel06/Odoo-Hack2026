import {
  fleetVehicleService,
  fleetDriverService,
  tripManagementService,
  maintenanceManagementService,
  fuelManagementService
} from "@/shared/mock-data";
import { VehicleStatus, TripStatus, MaintenanceStatus, MaintenancePriority } from "@/shared/domain/enums";
import { DashboardHeader } from "@/modules/dashboard/components/DashboardHeader";
import { KPIGrid } from "@/modules/dashboard/components/KPIGrid";
import { FleetOverviewCard } from "@/modules/dashboard/components/FleetOverviewCard";
import { AlertsPanel, type Alert } from "@/modules/dashboard/components/AlertsPanel";
import { ActiveOperations } from "@/modules/dashboard/components/ActiveOperations";
import { OperationsFeed, type FeedActivity } from "@/modules/dashboard/components/OperationsFeed";
import { QuickActionsPanel } from "@/modules/dashboard/components/QuickActionsPanel";

export default function DashboardPage() {
  /* ─── Data fetching ──────────────────────────────────────────────── */
  const vehicles = fleetVehicleService.listVehicles({ pagination: { page: 1, pageSize: 200 } }).items;
  const drivers  = fleetDriverService.listDrivers({ pagination: { page: 1, pageSize: 200 } }).items;
  const trips    = tripManagementService.listTrips({ pagination: { page: 1, pageSize: 200 } }).items;
  const maintenanceLogs = maintenanceManagementService.listMaintenance({ pagination: { page: 1, pageSize: 200 } }).items;
  const fuelLogs = fuelManagementService.listFuelLogs({ pagination: { page: 1, pageSize: 200 } }).items;

  /* ─── Vehicle metrics ────────────────────────────────────────────── */
  const availableVehicles = vehicles.filter((v) => v.status === VehicleStatus.Available);
  const onTripVehicles    = vehicles.filter((v) => v.status === VehicleStatus.OnTrip);
  const inShopVehicles    = vehicles.filter((v) => v.status === VehicleStatus.InShop);
  const retiredVehicles   = vehicles.filter((v) => v.status === VehicleStatus.Retired);
  const fleetUtilization  = vehicles.length > 0
    ? Math.round((onTripVehicles.length / vehicles.length) * 100)
    : 0;

  /* ─── Trip metrics ───────────────────────────────────────────────── */
  const dispatchedTrips = trips.filter((t) => t.status === TripStatus.Dispatched);
  
  /* ─── Maintenance metrics ────────────────────────────────────────── */
  const activeMaintenance    = maintenanceLogs.filter((m) => m.status === MaintenanceStatus.Active);
  const criticalMaintenance  = activeMaintenance.filter(
    (m) => m.priority === MaintenancePriority.Critical || m.priority === MaintenancePriority.High
  );

  /* ─── Driver compliance ──────────────────────────────────────────── */
  const now              = new Date();
  const thirtyDaysOut    = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiredLicenses  = drivers.filter((d) => new Date(d.licenseExpiresAt) < now);
  const expiringLicenses = drivers.filter((d) => {
    const exp = new Date(d.licenseExpiresAt);
    return exp >= now && exp < thirtyDaysOut;
  });

  /* ─── Fuel costs ─────────────────────────────────────────────────── */
  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.fuelCost, 0);

  /* ─── Operational health score ───────────────────────────────────── */
  const healthPenalty = 
    criticalMaintenance.length * 15 +
    expiredLicenses.length * 10 +
    expiringLicenses.length * 3 +
    inShopVehicles.length * 5;
  const operationalHealth = Math.max(0, Math.min(100, 100 - healthPenalty));

  /* ─── Data Props ─────────────────────────────────────────────────── */

  const kpiData = {
    fleetUtilization,
    tripsToday: trips.length, // Simplified for mock
    activeTrips: dispatchedTrips.length,
    fuelCostToday: totalFuelCost,
    vehicleHealth: operationalHealth,
  };

  const fleetStatus = {
    available: availableVehicles.length,
    onTrip:    onTripVehicles.length,
    inShop:    inShopVehicles.length,
    retired:   retiredVehicles.length,
    total:     vehicles.length,
  };

  const activeOperationsData = dispatchedTrips.slice(0, 8).map((trip) => ({
    trip,
    vehicle: vehicles.find((v) => v.id === trip.vehicleId) ?? null,
    driver:  drivers.find((d) => d.id === trip.driverId) ?? null,
    etaHours: 1.2 + Math.random() * 2 // Mock ETA
  }));

  const alerts: Alert[] = [
    // Critical maintenance
    ...criticalMaintenance.map((m) => ({
      id:          m.id,
      severity:    "critical" as const,
      title:       `Critical Maintenance: ${m.title}`,
      description: `${vehicles.find((v) => v.id === m.vehicleId)?.name ?? "Vehicle"} requires immediate attention`,
      timestamp:   m.openedAt,
      href:        `/maintenance/${m.id}`,
    })),
    // Expired licenses
    ...expiredLicenses.map((d) => ({
      id:          `expired-${d.id}`,
      severity:    "critical" as const,
      title:       `License expired — ${d.name}`,
      description: `CDL expired ${new Date(d.licenseExpiresAt).toLocaleDateString("en-IN")}`,
      timestamp:   d.licenseExpiresAt,
      href:        `/drivers/${d.id}`,
    })),
    // Expiring licenses
    ...expiringLicenses.map((d) => ({
      id:          `expiring-${d.id}`,
      severity:    "warning" as const,
      title:       `License expiring — ${d.name}`,
      description: `CDL expires ${new Date(d.licenseExpiresAt).toLocaleDateString("en-IN")}`,
      timestamp:   d.licenseExpiresAt,
      href:        `/drivers/${d.id}`,
    })),
    // Medium-priority maintenance
    ...activeMaintenance
      .filter((m) => m.priority === MaintenancePriority.Medium)
      .slice(0, 2)
      .map((m) => ({
        id:          `med-${m.id}`,
        severity:    "info" as const,
        title:       `Scheduled Maintenance: ${m.title}`,
        description: `${vehicles.find((v) => v.id === m.vehicleId)?.name ?? "Vehicle"}`,
        timestamp:   m.openedAt,
        href:        `/maintenance/${m.id}`,
      })),
  ].slice(0, 8);

  const activities: FeedActivity[] = [
    ...dispatchedTrips.map((t) => ({
      id:          `dispatch-${t.id}`,
      type:        "trip_started" as const,
      narrative:   `${t.tripNumber} dispatched from ${t.origin} with driver ${drivers.find(d => d.id === t.driverId)?.name ?? 'assigned'}`,
      timestamp:   t.updatedAt,
      href:        `/trips/${t.id}`,
    })),
    ...activeMaintenance.slice(0, 2).map((m) => ({
      id:          `maint-${m.id}`,
      type:        "maintenance_started" as const,
      narrative:   `Maintenance started on ${vehicles.find((v) => v.id === m.vehicleId)?.name ?? m.vehicleId}`,
      timestamp:   m.openedAt,
      href:        `/maintenance/${m.id}`,
    })),
    ...fuelLogs.slice(0, 3).map((f) => ({
      id:          `fuel-${f.id}`,
      type:        "fuel_logged" as const,
      narrative:   `Fuel logged for ${vehicles.find((v) => v.id === f.vehicleId)?.name ?? f.vehicleId} (${f.fuelQuantity}L)`,
      timestamp:   f.loggedAt,
      href:        `/fuel/${f.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 12);

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-8 pb-8">

      {/* 1. Hero */}
      <DashboardHeader
        totalVehicles={vehicles.length}
        activeTrips={dispatchedTrips.length}
        healthScore={operationalHealth}
      />

      {/* 2. Critical KPIs */}
      <KPIGrid data={kpiData} />

      {/* 3. Live Operations */}
      <ActiveOperations trips={activeOperationsData} />

      {/* 4. Exceptions */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <FleetOverviewCard fleetStatus={fleetStatus} />
        <AlertsPanel alerts={alerts} />
      </div>

      {/* 5. Quick Actions & Activity Feed */}
      <div className="flex flex-col gap-6 xl:flex-row items-stretch">
        <div className="w-full shrink-0 empty:hidden xl:w-1/3">
          <QuickActionsPanel />
        </div>
        <div className="flex-1 min-w-0">
          <OperationsFeed activities={activities} />
        </div>
      </div>

    </div>
  );
}
