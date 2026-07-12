import { AppShell } from "@/shared/components/layout/AppShell";
import { ProtectedRoute } from "@/shared/components/layout/ProtectedRoute";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
