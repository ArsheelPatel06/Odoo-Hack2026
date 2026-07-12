"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fleetDriverService } from "@/modules/drivers";
import { fleetVehicleService } from "@/modules/fleet";
import { tripManagementService } from "@/modules/trips";
import { TRIP_STATUS_COLORS } from "@/shared/domain/constants";
import { TripStatus } from "@/shared/domain/enums";
import type { Trip } from "@/shared/domain/models";
import { Button, FilterBar, PageHeader, SearchBar, Select, StatusBadge, TableWrapper } from "@/shared/components/ui";

const statusToneMap = {
  success: "success",
  primary: "primary",
  warning: "warning",
  danger: "danger",
  muted: "muted"
} as const;

export function TripRegistry() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  const result = useMemo(() => {
    void refreshKey;

    return tripManagementService.listTrips({
      search: search ? { query: search, fields: ["tripNumber", "origin", "destination"] } : undefined,
      status: status ? (status as TripStatus) : undefined,
      sort: { field: "createdAt", direction: "desc" },
      pagination: { page: 1, pageSize: 20 }
    });
  }, [refreshKey, search, status]);

  return (
    <div className="grid gap-6">
      <PageHeader title="Trip Registry" description="Operational trip registry with dispatch-centric lifecycle control." />

      <FilterBar>
        <SearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search trip ID, source, or destination"
        />
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="max-w-44">
          <option value="">All statuses</option>
          {Object.values(TripStatus).map((tripStatus) => (
            <option key={tripStatus} value={tripStatus}>
              {tripStatus}
            </option>
          ))}
        </Select>
        <Button variant="secondary" onClick={() => setRefreshKey((value) => value + 1)}>
          Refresh
        </Button>
      </FilterBar>

      <TableWrapper>
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Trip ID</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Destination</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">Cargo</th>
              <th className="px-4 py-3 font-medium">Distance</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((trip) => (
              <TripRow key={trip.id} trip={trip} />
            ))}
          </tbody>
        </table>
      </TableWrapper>

      <p className="text-sm text-muted">
        Showing {result.items.length} of {result.total} trips
      </p>
    </div>
  );
}

function TripRow({ trip }: { trip: Trip }) {
  const tone = statusToneMap[TRIP_STATUS_COLORS[trip.status] as keyof typeof statusToneMap] ?? "muted";
  const vehicle = trip.vehicleId ? fleetVehicleService.findVehicleRecord(trip.vehicleId) : null;
  const driver = trip.driverId ? fleetDriverService.findDriverRecord(trip.driverId) : null;

  return (
    <tr className="border-b border-border/70">
      <td className="px-4 py-3 font-medium">{trip.tripNumber}</td>
      <td className="px-4 py-3">{trip.origin}</td>
      <td className="px-4 py-3">{trip.destination}</td>
      <td className="px-4 py-3">{vehicle?.name ?? "—"}</td>
      <td className="px-4 py-3">{driver?.name ?? "—"}</td>
      <td className="px-4 py-3">{trip.cargoWeight.toLocaleString()} kg</td>
      <td className="px-4 py-3">{trip.plannedDistance.toLocaleString()} km</td>
      <td className="px-4 py-3">
        <StatusBadge label={trip.status} tone={tone} />
      </td>
      <td className="px-4 py-3 text-muted">{new Date(trip.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <Button asChild variant="ghost" className="h-8 px-2">
          <Link href={`/trips/${trip.id}`}>View</Link>
        </Button>
      </td>
    </tr>
  );
}
