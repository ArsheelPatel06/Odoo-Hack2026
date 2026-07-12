"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { evaluateRouteAccess } from "@/shared/auth";
import { LoadingOverlay } from "@/shared/components/layout/LoadingOverlay";
import { useSession } from "@/shared/providers/SessionProvider";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { hasHydrated, isAuthenticated, user } = useSession();

  const access = evaluateRouteAccess({
    isAuthenticated,
    role: user?.role ?? null,
    permissions: user?.permissions ?? [],
    pathname
  });

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (access === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (access === "unauthorized") {
      router.replace("/403");
    }
  }, [access, hasHydrated, router]);

  if (!hasHydrated || access !== "allow") {
    return <LoadingOverlay label={access === "unauthorized" ? "Redirecting" : "Checking access"} />;
  }

  return <>{children}</>;
}
