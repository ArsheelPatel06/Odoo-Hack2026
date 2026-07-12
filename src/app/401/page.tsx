import Link from "next/link";
import { Button, Card } from "@/shared/components/ui";

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 text-text">
      <Card className="max-w-md text-center">
        <p className="text-sm font-medium text-warning">401</p>
        <h1 className="mt-2 text-2xl font-semibold">Authentication required</h1>
        <p className="mt-3 text-sm text-muted">Sign in before entering the TransitOps workspace.</p>
        <Button asChild className="mt-6">
          <Link href="/login">Go to login</Link>
        </Button>
      </Card>
    </main>
  );
}
