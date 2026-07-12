export const ANALYTICS_CARDS = [
  { id: "fleetUtilization", label: "Fleet Utilization", metric: "analytics.fleetUtilization" },
  { id: "driverUtilization", label: "Driver Utilization", metric: "analytics.driverUtilization" },
  { id: "fuelEfficiency", label: "Fuel Efficiency", metric: "analytics.fuelEfficiency" },
  { id: "tripCompletionRate", label: "Trip Completion Rate", metric: "analytics.tripCompletionRate" },
  { id: "maintenanceCost", label: "Maintenance Cost", metric: "analytics.maintenanceCost" },
  { id: "expenseBreakdown", label: "Expense Breakdown", metric: "analytics.expenseBreakdown" }
] as const;
