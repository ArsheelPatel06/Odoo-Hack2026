"use client";

import { usePermission } from "@/shared/providers/PermissionProvider";

type PermissionGateProps = {
  permission?: string;
  module?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function PermissionGate({ children, permission, module, fallback = null }: PermissionGateProps) {
  const { hasPermission, canAccessModule } = usePermission();

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (module && !canAccessModule(module)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
