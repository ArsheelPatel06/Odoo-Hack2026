"use client";

import { ThemeProvider } from "next-themes";
import { DialogProvider, PermissionProvider, SessionProvider, ToastProvider } from "@/shared/providers";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SessionProvider>
        <PermissionProvider>
          <DialogProvider>
            {children}
            <ToastProvider />
          </DialogProvider>
        </PermissionProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
