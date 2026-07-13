import { AppShell } from "@/shared/components/layout/AppShell";
import { ProtectedRoute } from "@/shared/components/layout/ProtectedRoute";
import { FloatingQuickCreate } from "@/shared/components/layout/FloatingQuickCreate";
type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRoute>
      <AppShell>
        {children}
        <FloatingQuickCreate />
      </AppShell>
    </ProtectedRoute>
  );
}
