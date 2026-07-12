import { UserRole } from "@/shared/domain/enums";
import { SIDEBAR_NAVIGATION } from "@/shared/domain/constants";
import { ROLE_ACCESS } from "@/shared/domain/permissions";

export type RoleAccess = (typeof ROLE_ACCESS)[UserRole];

export function getRoleAccess(role: UserRole): RoleAccess {
  return ROLE_ACCESS[role];
}

export function hasPermission(permissions: string[], permission: string) {
  return permissions.includes(permission);
}

export function canAccessModule(role: UserRole, module: string) {
  return (getRoleAccess(role).allowedModules as readonly string[]).includes(module);
}

export function canAccessRoute(role: UserRole, route: string) {
  return (getRoleAccess(role).allowedRoutes as readonly string[]).includes(route);
}

export function getAllowedNavigation(permissions: string[]) {
  return SIDEBAR_NAVIGATION.filter((item) => hasPermission(permissions, item.permission));
}

export function getRoutePermission(pathname: string) {
  const match = SIDEBAR_NAVIGATION.find((item) => item.route === pathname);
  return match?.permission ?? null;
}

export type RouteAccessResult = "allow" | "unauthenticated" | "unauthorized";

export function evaluateRouteAccess(input: {
  isAuthenticated: boolean;
  role: UserRole | null;
  permissions: string[];
  pathname: string;
}): RouteAccessResult {
  if (!input.isAuthenticated || !input.role) {
    return "unauthenticated";
  }

  if (!canAccessRoute(input.role, input.pathname)) {
    return "unauthorized";
  }

  const requiredPermission = getRoutePermission(input.pathname);

  if (requiredPermission && !hasPermission(input.permissions, requiredPermission)) {
    return "unauthorized";
  }

  return "allow";
}
