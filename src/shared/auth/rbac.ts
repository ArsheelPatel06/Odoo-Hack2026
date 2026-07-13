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

export function matchesAppRoute(pathname: string, baseRoute: string) {
  return pathname === baseRoute || pathname.startsWith(`${baseRoute}/`);
}

export function canAccessModule(role: UserRole, module: string) {
  return (getRoleAccess(role).allowedModules as readonly string[]).includes(module);
}

export function canAccessRoute(role: UserRole, pathname: string) {
  return getRoleAccess(role).allowedRoutes.some((route) => matchesAppRoute(pathname, route));
}

export function getAllowedNavigation(permissions: string[]) {
  const filtered = SIDEBAR_NAVIGATION.filter((item) => hasPermission(permissions, item.permission));
  const byRoute = new Map<string, (typeof SIDEBAR_NAVIGATION)[number]>();

  for (const item of filtered) {
    const existing = byRoute.get(item.route);

    if (!existing || item.permission.endsWith(".view")) {
      byRoute.set(item.route, item);
    }
  }

  return Array.from(byRoute.values());
}

export function getActiveNavigationItem(pathname: string, items: ReturnType<typeof getAllowedNavigation>) {
  return items
    .filter((item) => matchesAppRoute(pathname, item.route))
    .sort((left, right) => right.route.length - left.route.length)[0];
}

export function getRoutePermissions(pathname: string): string[] {
  // Find all navigation items that match this route
  const matches = SIDEBAR_NAVIGATION.filter((item) => matchesAppRoute(pathname, item.route)).sort(
    (left, right) => right.route.length - left.route.length
  );
  
  // Return all unique permissions associated with the longest matched route
  if (matches.length === 0) return [];
  
  const longestRouteLength = matches[0].route.length;
  return matches
    .filter((m) => m.route.length === longestRouteLength)
    .map((m) => m.permission);
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

  const validPermissions = getRoutePermissions(input.pathname);

  // If the route maps to specific permissions, user must have at least one
  if (validPermissions.length > 0) {
    const hasAny = validPermissions.some((perm) => hasPermission(input.permissions, perm));
    if (!hasAny) {
      return "unauthorized";
    }
  }

  return "allow";
}
