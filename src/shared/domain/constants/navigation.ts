import { APP_ROUTES } from "@/shared/domain/routes";

export const SIDEBAR_NAVIGATION = [
  { label: "Dashboard", route: APP_ROUTES.dashboard, module: "dashboard", icon: "dashboard" },
  { label: "Fleet", route: APP_ROUTES.fleet, module: "fleet", icon: "fleet" },
  { label: "Drivers", route: APP_ROUTES.drivers, module: "drivers", icon: "drivers" },
  { label: "Trips", route: APP_ROUTES.trips, module: "trips", icon: "trips" },
  { label: "Maintenance", route: APP_ROUTES.maintenance, module: "maintenance", icon: "maintenance" },
  { label: "Fuel", route: APP_ROUTES.fuel, module: "fuel", icon: "fuel" },
  { label: "Expenses", route: APP_ROUTES.expenses, module: "expenses", icon: "expenses" },
  { label: "Analytics", route: APP_ROUTES.analytics, module: "analytics", icon: "analytics" },
  { label: "Settings", route: APP_ROUTES.settings, module: "settings", icon: "settings" }
] as const;
