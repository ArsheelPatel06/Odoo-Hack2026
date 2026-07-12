import Link from "next/link";
import { Button, Card } from "@/shared/components/ui";

export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 text-text">
      <Card className="max-w-md text-center">
        <p className="text-sm font-medium text-danger">403</p>
        <h1 className="mt-2 text-2xl font-semibold">Access denied</h1>
        <p className="mt-3 text-sm text-muted">Your current role does not have permission to view this route.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </Card>
    </main>
  );
}
