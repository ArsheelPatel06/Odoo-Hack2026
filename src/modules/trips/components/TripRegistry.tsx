"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { fleetDriverService } from "@/modules/drivers";
import { fleetVehicleService } from "@/modules/fleet";
import { tripManagementService } from "@/modules/trips";
import { TripStatus } from "@/shared/domain/enums";
import type { Trip } from "@/shared/domain/models";
import {
  Button,
  DataTable,
  SearchInput,
  Select,
  StatusBadge,
  Toolbar
} from "@/shared/components/ui";
import { exportToCSV, exportToPDF } from "@/shared/lib/exportUtils";

export function TripRegistry() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const result = useMemo(() => {
    void refreshKey;

    return tripManagementService.listTrips({
      search: search ? { query: search, fields: ["tripNumber", "origin", "destination"] } : undefined,
      status: status ? (status as TripStatus) : undefined,
      sort: { field: "createdAt", direction: "desc" },
      pagination: { page, pageSize: 10 }
    });
  }, [page, refreshKey, search, status]);

  const columns = useMemo<ColumnDef<Trip>[]>(
    () => [
      {
        accessorKey: "tripNumber",
        header: "Trip ID",
        cell: ({ row }) => <span className="font-medium text-primary">{row.original.tripNumber}</span>
      },
      { accessorKey: "origin", header: "Source" },
      { accessorKey: "destination", header: "Destination" },
      {
        id: "vehicle",
        header: "Vehicle",
        cell: ({ row }) => {
          const vehicle = row.original.vehicleId
            ? fleetVehicleService.findVehicleRecord(row.original.vehicleId)
            : null;
          return vehicle?.name ?? "—";
        }
      },
      {
        id: "driver",
        header: "Driver",
        cell: ({ row }) => {
          const driver = row.original.driverId ? fleetDriverService.findDriverRecord(row.original.driverId) : null;
          return driver?.name ?? "—";
        }
      },
      {
        accessorKey: "cargoWeight",
        header: "Cargo",
        cell: ({ row }) => `${row.original.cargoWeight.toLocaleString()} kg`
      },
      {
        accessorKey: "plannedDistance",
        header: "Distance",
        cell: ({ row }) => `${row.original.plannedDistance.toLocaleString()} km`
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge label={row.original.status} status={row.original.status} />
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <span className="text-muted">{new Date(row.original.createdAt).toLocaleDateString()}</span>
        )
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <Button asChild variant="ghost" className="h-8 px-2">
            <Link href={`/trips/${row.original.id}`}>Open</Link>
          </Button>
        )
      }
    ],
    []
  );

  const handleExport = (format: "csv" | "pdf") => {
    const headers = ["Trip ID", "Origin", "Destination", "Vehicle", "Driver", "Cargo (kg)", "Distance (km)", "Status"];
    const data = result.items.map(t => {
      const vehicle = t.vehicleId ? fleetVehicleService.findVehicleRecord(t.vehicleId) : null;
      const driver = t.driverId ? fleetDriverService.findDriverRecord(t.driverId) : null;
      return [
        t.tripNumber,
        t.origin,
        t.destination,
        vehicle?.name ?? "—",
        driver?.name ?? "—",
        t.cargoWeight,
        t.plannedDistance,
        t.status
      ];
    });

    if (format === "csv") {
      exportToCSV("fleet_trips", headers, data);
    } else {
      exportToPDF("fleet_trips", "Trip Registry Report", headers, data);
    }
  };

  return (
    <div className="grid gap-6">
      <Toolbar className="flex-wrap">
        <SearchInput
          className="min-w-[240px] flex-1"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search trip ID, source, or destination"
        />
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="w-44"
        >
          <option value="">All statuses</option>
          {Object.values(TripStatus).map((tripStatus) => (
            <option key={tripStatus} value={tripStatus}>
              {tripStatus}
            </option>
          ))}
        </Select>
        <div className="flex gap-2 ml-auto">
          <Button variant="secondary" onClick={() => handleExport("csv")}>CSV</Button>
          <Button variant="secondary" onClick={() => handleExport("pdf")}>PDF</Button>
          <Button variant="outline" onClick={() => setRefreshKey((value) => value + 1)}>Refresh</Button>
        </div>
      </Toolbar>

      <DataTable
        columns={columns}
        data={result.items}
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        onPageChange={setPage}
        emptyTitle="No trips in registry"
        emptyDescription="Create a dispatch lane to start operational tracking."
      />
    </div>
  );
}
