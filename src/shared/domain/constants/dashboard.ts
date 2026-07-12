export const DASHBOARD_KPI_CARDS = [
  { id: "totalVehicles", label: "Total Vehicles", metric: "vehicles.total" },
  { id: "availableVehicles", label: "Available Vehicles", metric: "vehicles.available" },
  { id: "activeTrips", label: "Active Trips", metric: "trips.active" },
  { id: "availableDrivers", label: "Available Drivers", metric: "drivers.available" },
  { id: "maintenanceActive", label: "Active Maintenance", metric: "maintenance.active" },
  { id: "monthlyExpenses", label: "Monthly Expenses", metric: "expenses.monthly" }
] as const;
