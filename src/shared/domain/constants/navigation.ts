import { APP_ROUTES } from "@/shared/domain/routes";
import type { NavGroupId } from "./shell";

type NavigationEntry = {
  label: string;
  route: string;
  module: string;
  icon: string;
  permission: string;
  group: NavGroupId;
  accessLabel?: string;
};

export const SIDEBAR_NAVIGATION = [
  {
    label: "Dashboard",
    route: APP_ROUTES.dashboard,
    module: "dashboard",
    icon: "dashboard",
    permission: "dashboard.view",
    group: "operations"
  },
  {
    label: "Trips",
    route: APP_ROUTES.trips,
    module: "trips",
    icon: "trips",
    permission: "trips.view",
    group: "operations"
  },
  {
    label: "Fleet",
    route: APP_ROUTES.fleet,
    module: "fleet",
    icon: "fleet",
    permission: "fleet.view",
    group: "fleet"
  },
  {
    label: "Fleet",
    route: APP_ROUTES.fleet,
    module: "fleet",
    icon: "fleet",
    permission: "fleet.read",
    group: "fleet",
    accessLabel: "Read"
  },
  {
    label: "Drivers",
    route: APP_ROUTES.drivers,
    module: "drivers",
    icon: "drivers",
    permission: "drivers.view",
    group: "fleet"
  },
  {
    label: "Drivers",
    route: APP_ROUTES.drivers,
    module: "drivers",
    icon: "drivers",
    permission: "drivers.read",
    group: "fleet",
    accessLabel: "Read"
  },
  {
    label: "Maintenance",
    route: APP_ROUTES.maintenance,
    module: "maintenance",
    icon: "maintenance",
    permission: "maintenance.view",
    group: "fleet"
  },
  {
    label: "Fuel & Expenses",
    route: APP_ROUTES.fuel,
    module: "fuel",
    icon: "fuel",
    permission: "fuel.view",
    group: "finance"
  },
  {
    label: "Expenses",
    route: APP_ROUTES.expenses,
    module: "expenses",
    icon: "expenses",
    permission: "expenses.view",
    group: "finance"
  },
  {
    label: "Analytics",
    route: APP_ROUTES.analytics,
    module: "analytics",
    icon: "analytics",
    permission: "analytics.view",
    group: "finance"
  },
  {
    label: "Compliance",
    route: APP_ROUTES.compliance,
    module: "compliance",
    icon: "safety",
    permission: "compliance.view",
    group: "system"
  },
  {
    label: "Settings",
    route: APP_ROUTES.settings,
    module: "settings",
    icon: "settings",
    permission: "settings.view",
    group: "system"
  }
] as const satisfies readonly NavigationEntry[];
