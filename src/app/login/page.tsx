"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { MOCK_USERS } from "@/shared/auth";
import { Button, Card, Input, Select } from "@/shared/components/ui";
import { useSession } from "@/shared/providers/SessionProvider";

export default function LoginPage() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, login } = useSession();
  const [email, setEmail] = useState(MOCK_USERS[0].email);
  const [password, setPassword] = useState("demo-password");

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, isAuthenticated, router]);

  const selectedUser = MOCK_USERS.find((user) => user.email === email);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = login(email);

    if (!success) {
      toast.error("No mock user found for that email.");
      return;
    }

    toast.success(`Welcome back, ${selectedUser?.name ?? "operator"}.`);
    router.replace("/dashboard");
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-10 text-text">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_45%)]" />
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-card bg-primary text-lg font-bold text-white shadow-panel">
            TO
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-normal">TransitOps</h1>
          <p className="mt-2 text-sm text-muted">Secure access to the operations console.</p>
        </div>

        <Card>
          <div className="mb-5 flex items-center gap-3 rounded-md border border-border bg-slate-950/30 px-4 py-3">
            <ShieldCheck className="size-5 text-primary" />
            <div className="text-left text-sm">
              <div className="font-medium text-text">Hackathon mock authentication</div>
              <div className="text-muted">Choose a demo role to enter the application shell.</div>
            </div>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium text-text">
                Work email
              </label>
              <Select id="email" value={email} onChange={(event) => setEmail(event.target.value)}>
                {MOCK_USERS.map((user) => (
                  <option key={user.email} value={user.email}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium text-text">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Any value works in demo mode"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="token" className="text-sm font-medium text-text">
                Session token
              </label>
              <Input id="token" value={selectedUser?.token ?? "Generated after login"} readOnly />
            </div>

            <Button type="submit" className="w-full">
              Enter Application
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
