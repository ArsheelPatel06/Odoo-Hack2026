import { APP_ROUTES } from "@/shared/domain/routes";

export const SIDEBAR_NAVIGATION = [
  { label: "Dashboard", route: APP_ROUTES.dashboard, module: "dashboard", icon: "dashboard", permission: "dashboard.view" },
  { label: "Fleet", route: APP_ROUTES.fleet, module: "fleet", icon: "fleet", permission: "fleet.view" },
  { label: "Fleet", route: APP_ROUTES.fleet, module: "fleet", icon: "fleet", permission: "fleet.read", accessLabel: "Read" },
  { label: "Drivers", route: APP_ROUTES.drivers, module: "drivers", icon: "drivers", permission: "drivers.view" },
  { label: "Drivers", route: APP_ROUTES.drivers, module: "drivers", icon: "drivers", permission: "drivers.read", accessLabel: "Read" },
  { label: "Trips", route: APP_ROUTES.trips, module: "trips", icon: "trips", permission: "trips.view" },
  { label: "Maintenance", route: APP_ROUTES.maintenance, module: "maintenance", icon: "maintenance", permission: "maintenance.view" },
  { label: "Fuel & Expenses", route: APP_ROUTES.fuel, module: "fuel", icon: "fuel", permission: "fuel.view" },
  { label: "Expenses", route: APP_ROUTES.expenses, module: "expenses", icon: "expenses", permission: "expenses.view" },
  { label: "Analytics", route: APP_ROUTES.analytics, module: "analytics", icon: "analytics", permission: "analytics.view" },
  { label: "Compliance", route: APP_ROUTES.compliance, module: "compliance", icon: "safety", permission: "compliance.view" },
  { label: "Settings", route: APP_ROUTES.settings, module: "settings", icon: "settings", permission: "settings.view" }
] as const;
