"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fleetVehicleService } from "@/modules/fleet";
import { VEHICLE_STATUS_COLORS } from "@/shared/domain/constants";
import { VehicleStatus, VehicleType } from "@/shared/domain/enums";
import type { Vehicle } from "@/shared/domain/models";
import { Button, FilterBar, PageHeader, SearchBar, Select, StatusBadge, TableWrapper } from "@/shared/components/ui";

const statusToneMap = {
  success: "success",
  primary: "primary",
  warning: "warning",
  danger: "danger",
  muted: "muted"
} as const;

export function VehicleRegistry() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  const result = useMemo(() => {
    void refreshKey;

    return fleetVehicleService.listVehicles({
      search: search ? { query: search, fields: ["registrationNumber", "name"] } : undefined,
      type: type ? (type as VehicleType) : undefined,
      status: status ? (status as VehicleStatus) : undefined,
      sort: { field: "createdAt", direction: "desc" },
      pagination: { page: 1, pageSize: 20 }
    });
  }, [refreshKey, search, status, type]);

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Fleet Registry"
        description="Master vehicle registry with lifecycle-controlled status and searchable fleet assets."
      />

      <FilterBar>
        <SearchBar value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search registration or vehicle name" />
        <Select value={type} onChange={(event) => setType(event.target.value)} className="max-w-48">
          <option value="">All types</option>
          {Object.values(VehicleType).map((vehicleType) => (
            <option key={vehicleType} value={vehicleType}>
              {vehicleType}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="max-w-48">
          <option value="">All statuses</option>
          {Object.values(VehicleStatus).map((vehicleStatus) => (
            <option key={vehicleStatus} value={vehicleStatus}>
              {vehicleStatus}
            </option>
          ))}
        </Select>
        <Button variant="secondary" onClick={() => setRefreshKey((value) => value + 1)}>
          Refresh
        </Button>
      </FilterBar>

      <TableWrapper>
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Registration</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Capacity</th>
              <th className="px-4 py-3 font-medium">Odometer</th>
              <th className="px-4 py-3 font-medium">Acquisition Cost</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((vehicle) => (
              <VehicleRow key={vehicle.id} vehicle={vehicle} />
            ))}
          </tbody>
        </table>
      </TableWrapper>

      <p className="text-sm text-muted">
        Showing {result.items.length} of {result.total} vehicles
      </p>
    </div>
  );
}

function VehicleRow({ vehicle }: { vehicle: Vehicle }) {
  const tone = statusToneMap[VEHICLE_STATUS_COLORS[vehicle.status] as keyof typeof statusToneMap] ?? "muted";

  return (
    <tr className="border-b border-border/70">
      <td className="px-4 py-3 font-medium">{vehicle.registrationNumber}</td>
      <td className="px-4 py-3">{vehicle.name}</td>
      <td className="px-4 py-3">{vehicle.type}</td>
      <td className="px-4 py-3">{vehicle.capacity.toLocaleString()} kg</td>
      <td className="px-4 py-3">{vehicle.odometerReading.toLocaleString()} km</td>
      <td className="px-4 py-3">₹{vehicle.acquisitionCost.toLocaleString()}</td>
      <td className="px-4 py-3">
        <StatusBadge label={vehicle.status} tone={tone} />
      </td>
      <td className="px-4 py-3 text-muted">{new Date(vehicle.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <Button asChild variant="ghost" className="h-8 px-2">
          <Link href={`/fleet/${vehicle.id}`}>View</Link>
        </Button>
      </td>
    </tr>
  );
}
