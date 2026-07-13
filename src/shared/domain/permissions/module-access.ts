import { UserRole } from "@/shared/domain/enums";
import { APP_ROUTES } from "@/shared/domain/routes";

export const MODULE_PERMISSIONS = {
  dashboard: {
    [UserRole.FleetManager]: true,
    [UserRole.Dispatcher]: true,
    [UserRole.SafetyOfficer]: true,
    [UserRole.FinancialAnalyst]: true
  },
  fleet: {
    [UserRole.FleetManager]: true,
    [UserRole.Dispatcher]: true,
    [UserRole.SafetyOfficer]: false,
    [UserRole.FinancialAnalyst]: false
  },
  drivers: {
    [UserRole.FleetManager]: true,
    [UserRole.Dispatcher]: true,
    [UserRole.SafetyOfficer]: true,
    [UserRole.FinancialAnalyst]: false
  },
  trips: {
    [UserRole.FleetManager]: true,
    [UserRole.Dispatcher]: true,
    [UserRole.SafetyOfficer]: false,
    [UserRole.FinancialAnalyst]: false
  },
  maintenance: {
    [UserRole.FleetManager]: true,
    [UserRole.Dispatcher]: false,
    [UserRole.SafetyOfficer]: true,
    [UserRole.FinancialAnalyst]: true
  },
  fuel: {
    [UserRole.FleetManager]: true,
    [UserRole.Dispatcher]: false,
    [UserRole.SafetyOfficer]: false,
    [UserRole.FinancialAnalyst]: true
  },
  expenses: {
    [UserRole.FleetManager]: true,
    [UserRole.Dispatcher]: false,
    [UserRole.SafetyOfficer]: false,
    [UserRole.FinancialAnalyst]: true
  },
  analytics: {
    [UserRole.FleetManager]: true,
    [UserRole.Dispatcher]: true,
    [UserRole.SafetyOfficer]: true,
    [UserRole.FinancialAnalyst]: true
  },
  settings: {
    [UserRole.FleetManager]: true,
    [UserRole.Dispatcher]: false,
    [UserRole.SafetyOfficer]: false,
    [UserRole.FinancialAnalyst]: false
  },
  compliance: {
    [UserRole.FleetManager]: false,
    [UserRole.Dispatcher]: false,
    [UserRole.SafetyOfficer]: true,
    [UserRole.FinancialAnalyst]: false
  }
} as const;

export const ROLE_PERMISSIONS = {
  [UserRole.FleetManager]: [
    "dashboard.view",
    "fleet.view",
    "drivers.view",
    "trips.view",
    "maintenance.view",
    "fuel.view",
    "expenses.view",
    "analytics.view",
    "settings.view"
  ],
  [UserRole.Dispatcher]: ["dashboard.view", "fleet.read", "drivers.read", "trips.view"],
  [UserRole.SafetyOfficer]: ["dashboard.view", "drivers.view", "compliance.view"],
  [UserRole.FinancialAnalyst]: ["dashboard.view", "fuel.view", "expenses.view", "analytics.view"]
} as const;

export const ROLE_ACCESS = {
  [UserRole.FleetManager]: {
    allowedRoutes: [
      APP_ROUTES.dashboard,
      APP_ROUTES.fleet,
      APP_ROUTES.drivers,
      APP_ROUTES.trips,
      APP_ROUTES.maintenance,
      APP_ROUTES.fuel,
      APP_ROUTES.expenses,
      APP_ROUTES.analytics,
      APP_ROUTES.settings,
      APP_ROUTES.docs
    ],
    allowedModules: ["dashboard", "fleet", "drivers", "trips", "maintenance", "fuel", "expenses", "analytics", "settings"],
    permissions: ROLE_PERMISSIONS[UserRole.FleetManager]
  },
  [UserRole.Dispatcher]: {
    allowedRoutes: [APP_ROUTES.dashboard, APP_ROUTES.trips, APP_ROUTES.fleet, APP_ROUTES.drivers, APP_ROUTES.docs],
    allowedModules: ["dashboard", "trips", "fleet", "drivers"],
    permissions: ROLE_PERMISSIONS[UserRole.Dispatcher]
  },
  [UserRole.SafetyOfficer]: {
    allowedRoutes: [APP_ROUTES.dashboard, APP_ROUTES.drivers, APP_ROUTES.compliance, APP_ROUTES.docs],
    allowedModules: ["dashboard", "drivers", "compliance"],
    permissions: ROLE_PERMISSIONS[UserRole.SafetyOfficer]
  },
  [UserRole.FinancialAnalyst]: {
    allowedRoutes: [APP_ROUTES.dashboard, APP_ROUTES.fuel, APP_ROUTES.expenses, APP_ROUTES.analytics, APP_ROUTES.docs],
    allowedModules: ["dashboard", "fuel", "expenses", "analytics"],
    permissions: ROLE_PERMISSIONS[UserRole.FinancialAnalyst]
  }
} as const;
