import Link from "next/link";
import { TripRegistry } from "@/modules/trips/components";
import { Button, PageHeader } from "@/shared/components/ui";

export default function TripsPage() {
  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          title="Trip Management"
          description="Operational control center for dispatch, validation, and trip lifecycle orchestration."
        />
        <Button asChild>
          <Link href="/trips/dispatch">Open dispatch wizard</Link>
        </Button>
      </div>

      <TripRegistry />
    </div>
  );
}
