export const roles = {
  fleetManager: "fleet_manager",
  dispatcher: "dispatcher",
  safetyOfficer: "safety_officer",
  financialAnalyst: "financial_analyst"
} as const;

export const permissions = {
  dashboardView: "dashboard.view",
  fleetView: "fleet.view",
  driversView: "drivers.view",
  tripsView: "trips.view",
  maintenanceView: "maintenance.view",
  fuelView: "fuel.view",
  expensesView: "expenses.view",
  analyticsView: "analytics.view",
  settingsView: "settings.view"
} as const;
