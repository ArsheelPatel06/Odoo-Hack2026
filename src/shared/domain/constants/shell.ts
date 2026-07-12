import { APP_ROUTES } from "@/shared/domain/routes";

export const WORKSPACES = [
  { id: "north-ops", label: "North Operations", region: "Chicago Hub", initials: "NO" },
  { id: "south-ops", label: "South Corridor", region: "Atlanta Hub", initials: "SC" },
  { id: "west-ops", label: "West Fleet", region: "Denver Hub", initials: "WF" }
] as const;

export const QUICK_ACTIONS = [
  { id: "dispatch-trip", label: "Dispatch trip", hint: "Open dispatch wizard", route: "/trips/dispatch" },
  { id: "add-vehicle", label: "Add vehicle", hint: "Register fleet asset", route: "/fleet/new" },
  { id: "add-driver", label: "Add driver", hint: "Onboard operator", route: "/drivers/new" },
  { id: "log-fuel", label: "Log fuel", hint: "Capture fuel entry", route: "/fuel/new" },
  { id: "log-expense", label: "Log expense", hint: "Record operational cost", route: "/expenses/new" },
  { id: "schedule-service", label: "Schedule service", hint: "Create work order", route: "/maintenance/new" }
] as const;

export const SHELL_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Trip TRP-1042 dispatched",
    body: "Vehicle VH-12 left Chicago terminal with driver Marcus Lee.",
    timestamp: "4 min ago",
    unread: true,
    category: "trips" as const
  },
  {
    id: "n2",
    title: "Maintenance due — VH-08",
    body: "Oil change threshold reached. Schedule within 48 hours.",
    timestamp: "22 min ago",
    unread: true,
    category: "maintenance" as const
  },
  {
    id: "n3",
    title: "Driver license expiring",
    body: "Priya Shah CDL expires in 14 days.",
    timestamp: "1 hr ago",
    unread: true,
    category: "compliance" as const
  },
  {
    id: "n4",
    title: "Fuel anomaly flagged",
    body: "VH-03 consumption 18% above fleet baseline.",
    timestamp: "3 hr ago",
    unread: false,
    category: "fuel" as const
  },
  {
    id: "n5",
    title: "Weekly ops digest ready",
    body: "Fleet utilization and cost summary is available.",
    timestamp: "Yesterday",
    unread: false,
    category: "analytics" as const
  }
] as const;

export const NAV_GROUPS = [
  { id: "operations", label: "Operations" },
  { id: "fleet", label: "Fleet & Assets" },
  { id: "finance", label: "Finance" },
  { id: "system", label: "System" }
] as const;

export type NavGroupId = (typeof NAV_GROUPS)[number]["id"];

export const ROUTE_SEGMENT_LABELS: Record<string, string> = {
  new: "New",
  dispatch: "Dispatch",
  fuel: "Fuel",
  expenses: "Expenses",
  maintenance: "Maintenance",
  drivers: "Drivers",
  fleet: "Fleet",
  trips: "Trips",
  analytics: "Analytics",
  compliance: "Compliance",
  settings: "Settings",
  dashboard: "Dashboard"
};

export const MODULE_ROUTE_LABELS: Record<string, string> = {
  [APP_ROUTES.dashboard]: "Dashboard",
  [APP_ROUTES.fleet]: "Fleet",
  [APP_ROUTES.drivers]: "Drivers",
  [APP_ROUTES.trips]: "Trips",
  [APP_ROUTES.maintenance]: "Maintenance",
  [APP_ROUTES.fuel]: "Fuel & Expenses",
  [APP_ROUTES.expenses]: "Expenses",
  [APP_ROUTES.analytics]: "Analytics",
  [APP_ROUTES.compliance]: "Compliance",
  [APP_ROUTES.settings]: "Settings"
};

export const KEYBOARD_SHORTCUTS = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["⌘", "B"], label: "Toggle sidebar" },
  { keys: ["⌘", "⇧", "F"], label: "Focus global search" },
  { keys: ["Esc"], label: "Close overlays" }
] as const;
