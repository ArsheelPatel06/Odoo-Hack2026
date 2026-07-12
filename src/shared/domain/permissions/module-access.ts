import { UserRole } from "@/shared/domain/enums";

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
    [UserRole.SafetyOfficer]: true,
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
    [UserRole.SafetyOfficer]: true,
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
    [UserRole.Dispatcher]: true,
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
  [UserRole.Dispatcher]: ["dashboard.view", "fleet.view", "drivers.view", "trips.view", "fuel.view", "analytics.view"],
  [UserRole.SafetyOfficer]: ["dashboard.view", "fleet.view", "drivers.view", "trips.view", "maintenance.view", "analytics.view"],
  [UserRole.FinancialAnalyst]: ["dashboard.view", "maintenance.view", "fuel.view", "expenses.view", "analytics.view"]
} as const;
