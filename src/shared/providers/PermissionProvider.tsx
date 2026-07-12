"use client";

import { createContext, useContext, useMemo } from "react";
import {
  canAccessModule,
  canAccessRoute,
  getAllowedNavigation,
  getRoleAccess,
  hasPermission
} from "@/shared/auth";
import { useSession } from "@/shared/providers/SessionProvider";

type PermissionContextValue = {
  permissions: string[];
  allowedRoutes: readonly string[];
  allowedModules: readonly string[];
  navigation: ReturnType<typeof getAllowedNavigation>;
  hasPermission: (permission: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  canAccessModule: (module: string) => boolean;
};

const PermissionContext = createContext<PermissionContextValue | null>(null);

type PermissionProviderProps = {
  children: React.ReactNode;
};

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { user } = useSession();

  const value = useMemo<PermissionContextValue>(() => {
    const permissions = user?.permissions ?? [];
    const roleAccess = user ? getRoleAccess(user.role) : null;

    return {
      permissions,
      allowedRoutes: roleAccess?.allowedRoutes ?? [],
      allowedModules: roleAccess?.allowedModules ?? [],
      navigation: getAllowedNavigation(permissions),
      hasPermission: (permission: string) => hasPermission(permissions, permission),
      canAccessRoute: (route: string) => (user ? canAccessRoute(user.role, route) : false),
      canAccessModule: (module: string) => (user ? canAccessModule(user.role, module) : false)
    };
  }, [user]);

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermission() {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error("usePermission must be used within PermissionProvider.");
  }

  return context;
}
