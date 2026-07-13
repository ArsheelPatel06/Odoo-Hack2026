import Link from "next/link";
import { ArrowRight, Car, MapPin, Navigation, User } from "lucide-react";
import type { Trip, Vehicle, Driver } from "@/shared/domain/models";
import { TripStatus } from "@/shared/domain/enums";
import { StatusChip } from "@/shared/components/ui/StatusBadge";

type ActiveTripRow = {
  trip: Trip;
  vehicle: Vehicle | null;
  driver: Driver | null;
  etaHours?: number;
};

type ActiveOperationsProps = {
  trips: ActiveTripRow[];
};

export function ActiveOperations({ trips }: ActiveOperationsProps) {
  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-[20px] border border-subtle bg-surface py-14 shadow-soft">
        <Navigation className="size-10 text-muted/30" strokeWidth={1.5} />
        <div className="text-center">
          <p className="text-[14px] font-semibold text-primary">No active operations</p>
          <p className="text-[12px] text-muted">Dispatch a trip to see it monitored here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-primary">Live Operations</h2>
          <p className="mt-0.5 text-[12px] text-muted">Monitoring {trips.length} active fleet movements</p>
        </div>
        <Link href="/trips" className="text-[13px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
          View all trips →
        </Link>
      </div>

      {/* Horizontal scrolling container */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {trips.map(({ trip, driver, vehicle, etaHours }) => (
          <div
            key={trip.id}
            className="group flex w-[280px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[20px] border border-subtle bg-surface shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-elevated sm:w-[320px]"
          >
            <div className="p-5">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted">{trip.tripNumber}</span>
                <StatusChip status={trip.status} pulse={trip.status === TripStatus.Dispatched} size="sm" />
              </div>

              {/* Route */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[14px] font-semibold text-primary">{trip.origin}</p>
                </div>
                <div className="flex shrink-0 items-center justify-center text-muted">
                  <div className="h-px w-6 bg-subtle" />
                  <ArrowRight className="size-3.5 mx-1" />
                  <div className="h-px w-6 bg-subtle" />
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="truncate text-[14px] font-semibold text-primary">{trip.destination}</p>
                </div>
              </div>

              {/* Meta info */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5 text-muted">
                    <User className="size-3.5" /> Driver
                  </span>
                  <span className="font-medium text-primary">{driver?.name ?? "Unassigned"}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5 text-muted">
                    <Car className="size-3.5" /> Vehicle
                  </span>
                  <span className="font-medium text-primary">{vehicle?.name ?? "No Vehicle"}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5 text-muted">
                    <MapPin className="size-3.5" /> ETA
                  </span>
                  <span className="font-medium text-primary">
                    {etaHours ? `${Math.floor(etaHours)}h ${Math.round((etaHours % 1) * 60)}m` : "Calculating..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="border-t border-subtle bg-muted-surface/40 px-5 py-3 transition-colors group-hover:bg-indigo-500/5">
              <Link
                href={`/trips/${trip.id}`}
                className="flex items-center justify-between text-[12px] font-semibold text-indigo-600 dark:text-indigo-400"
              >
                Open Trip Details
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
