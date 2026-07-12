"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fleetVehicleService } from "@/modules/fleet";
import { fuelManagementService } from "@/modules/financial";
import { tripManagementService } from "@/modules/trips";
import type { FuelLog } from "@/shared/domain/models";
import { Button, FilterBar, PageHeader, SearchBar, Select, TableWrapper } from "@/shared/components/ui";

export function FuelRegistry() {
  const [search, setSearch] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const vehicles = useMemo(() => fleetVehicleService.listVehicles({ pagination: { page: 1, pageSize: 100 } }).items, []);

  const result = useMemo(() => {
    void refreshKey;

    return fuelManagementService.listFuelLogs({
      search: search ? { query: search, fields: ["fuelLogNumber", "fuelStation", "notes"] } : undefined,
      vehicleId: vehicleId || undefined,
      sort: { field: "loggedAt", direction: "desc" },
      pagination: { page: 1, pageSize: 20 }
    });
  }, [refreshKey, search, vehicleId]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader title="Fuel Logs" description="Operational fuel records tied to completed trips." />
        <Button asChild>
          <Link href="/fuel/new">Log fuel</Link>
        </Button>
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fuel ID, station, notes" />
        <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="max-w-48">
          <option value="">All vehicles</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name}
            </option>
          ))}
        </Select>
        <Button variant="secondary" onClick={() => setRefreshKey((v) => v + 1)}>
          Refresh
        </Button>
      </FilterBar>

      <TableWrapper>
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Fuel ID</th>
              <th className="px-4 py-3 font-medium">Trip</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Odometer</th>
              <th className="px-4 py-3 font-medium">Quantity (L)</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">Station</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((record) => (
              <FuelRow key={record.id} record={record} />
            ))}
          </tbody>
        </table>
      </TableWrapper>

      <p className="text-sm text-muted">
        Showing {result.items.length} of {result.total} fuel logs
      </p>
    </div>
  );
}

function FuelRow({ record }: { record: FuelLog }) {
  const vehicle = fleetVehicleService.findVehicleRecord(record.vehicleId);
  const trip = tripManagementService.getTripById(record.tripId);

  return (
    <tr className="border-b border-border/70">
      <td className="px-4 py-3 font-medium">{record.fuelLogNumber}</td>
      <td className="px-4 py-3">{trip.tripNumber}</td>
      <td className="px-4 py-3">{vehicle?.name ?? record.vehicleId}</td>
      <td className="px-4 py-3 text-muted">{new Date(record.loggedAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">{record.odometerReading.toLocaleString()} km</td>
      <td className="px-4 py-3">{record.fuelQuantity} L</td>
      <td className="px-4 py-3">₹{record.fuelCost.toLocaleString()}</td>
      <td className="px-4 py-3">{record.fuelStation}</td>
      <td className="px-4 py-3">
        <Button asChild variant="ghost" className="h-8 px-2">
          <Link href={`/fuel/${record.id}`}>View</Link>
        </Button>
      </td>
    </tr>
  );
}
