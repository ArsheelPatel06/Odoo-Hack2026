import type { Permission } from "@/shared/types";

type PermissionGateProps = {
  permission?: Permission;
  children: React.ReactNode;
};

export function PermissionGate({ children }: PermissionGateProps) {
  return <>{children}</>;
}
