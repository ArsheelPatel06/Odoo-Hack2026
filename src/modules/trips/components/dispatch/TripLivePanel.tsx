"use client";

import { useState } from "react";
import { Clock, MapPinned, Radio } from "lucide-react";
import { TripStatus } from "@/shared/domain/enums";
import type { TripDetail } from "@/modules/trips/types";
import { Card, ProgressBar, StatusBadge } from "@/shared/components/ui";
import { SingleTripLiveMap } from "../map/SingleTripLiveMap";
import type { MapplsTripStats } from "../map/MapplsSimulatedTrip";

type TripLivePanelProps = {
  detail: TripDetail;
};

export function TripLivePanel({ detail }: TripLivePanelProps) {
  const [liveStats, setLiveStats] = useState<MapplsTripStats | null>(null);

  const isActiveTrip = detail.trip.status === TripStatus.Dispatched || detail.trip.status === TripStatus.InTransit;

  const progress =
    detail.trip.status === TripStatus.Completed
      ? 100
      : isActiveTrip
        ? liveStats ? liveStats.progress * 100 : 18
        : detail.trip.status === TripStatus.Draft
          ? 0
          : 0;

  const etaLabel = isActiveTrip && liveStats
    ? `${liveStats.etaMinutes} mins`
    : new Date(detail.liveStatus.estimatedCompletion).toLocaleString();

  const gpsLabel = isActiveTrip && liveStats
    ? `${liveStats.speed} km/h (${liveStats.distanceRemainingKm} km left)`
    : detail.liveStatus.placeholders.gps;

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-heading-md font-semibold text-primary">Live operations</h2>
          <p className="mt-1 text-body-sm text-muted">{detail.overview.route}</p>
        </div>
        <StatusBadge label={detail.trip.status} status={detail.trip.status} />
      </div>

      <div className="rounded-card border border-subtle bg-muted-surface/50 p-4">
        <div className="flex items-center justify-between text-body-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPinned className="size-4" />
            Route tracking
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Radio className="size-4" />
            {isActiveTrip ? "Active GPS ping" : detail.trip.status === TripStatus.Completed ? "Tracking Ended" : "Waiting for dispatch"}
          </span>
        </div>
        
        {/* Render Map Visualization directly! */}
        <div className="mt-4 h-64 w-full relative rounded-input border border-subtle overflow-hidden">
          <SingleTripLiveMap 
            detail={detail} 
            onStatsUpdate={setLiveStats} 
          />
        </div>
      </div>

      <ProgressBar value={progress} label="Trip progress" />

      <dl className="grid gap-3 text-body-sm md:grid-cols-2">
        <Info label="Stage" value={isActiveTrip && liveStats ? "In Transit" : detail.trip.status === TripStatus.Completed ? "Completed" : detail.liveStatus.currentStage} />
        <Info label="ETA" value={etaLabel} icon={<Clock className="size-4" />} />
        <Info label="GPS" value={gpsLabel} />
        <Info label="Cargo" value={`${detail.trip.cargoWeight.toLocaleString()} kg`} />
      </dl>
    </Card>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-input border border-subtle px-3 py-2.5">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-1 inline-flex items-center gap-1.5 font-medium text-primary">
        {icon}
        {value}
      </dd>
    </div>
  );
}
