import { ROLE_PERMISSIONS } from "@/shared/domain/permissions";
import { UserRole } from "@/shared/domain/enums";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  token: string;
};

export const MOCK_USERS: MockUser[] = [
  {
    id: "user_fleet_manager",
    name: "Fleet Manager",
    email: "admin@transitops.com",
    role: UserRole.FleetManager,
    permissions: [...ROLE_PERMISSIONS[UserRole.FleetManager]],
    token: "mock-token-fleet-manager"
  },
  {
    id: "user_dispatcher",
    name: "Dispatcher",
    email: "dispatcher@transitops.com",
    role: UserRole.Dispatcher,
    permissions: [...ROLE_PERMISSIONS[UserRole.Dispatcher]],
    token: "mock-token-dispatcher"
  },
  {
    id: "user_safety",
    name: "Safety Officer",
    email: "safety@transitops.com",
    role: UserRole.SafetyOfficer,
    permissions: [...ROLE_PERMISSIONS[UserRole.SafetyOfficer]],
    token: "mock-token-safety"
  },
  {
    id: "user_finance",
    name: "Financial Analyst",
    email: "finance@transitops.com",
    role: UserRole.FinancialAnalyst,
    permissions: [...ROLE_PERMISSIONS[UserRole.FinancialAnalyst]],
    token: "mock-token-finance"
  }
];
