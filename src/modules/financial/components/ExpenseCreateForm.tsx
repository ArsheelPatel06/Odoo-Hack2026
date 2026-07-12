"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fleetVehicleService } from "@/modules/fleet";
import { expenseManagementService } from "@/modules/financial";
import { tripManagementService } from "@/modules/trips";
import { ExpenseType } from "@/shared/domain/enums";
import { Button, Card, Input, Select } from "@/shared/components/ui";

export function ExpenseCreateForm() {
  const router = useRouter();
  const [type, setType] = useState<ExpenseType>(ExpenseType.Toll);
  const [amount, setAmount] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [tripId, setTripId] = useState("");
  const [description, setDescription] = useState("");
  const [incurredAt, setIncurredAt] = useState("");

  const vehicles = useMemo(() => fleetVehicleService.listVehicles({ pagination: { page: 1, pageSize: 100 } }).items, []);
  const trips = useMemo(() => tripManagementService.listTrips({ pagination: { page: 1, pageSize: 100 } }).items, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const record = expenseManagementService.createExpense({
        type,
        amount: Number(amount),
        description,
        vehicleId: vehicleId || undefined,
        tripId: tripId || undefined,
        incurredAt: incurredAt ? new Date(incurredAt).toISOString() : undefined
      });

      toast.success("Expense recorded. Operational cost and ROI updated automatically.");
      router.push(`/expenses/${record.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create expense.");
    }
  };

  return (
    <Card>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Select value={type} onChange={(e) => setType(e.target.value as ExpenseType)}>
          {Object.values(ExpenseType).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
        <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
          <option value="">Select vehicle (optional)</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name} ({vehicle.registrationNumber})
            </option>
          ))}
        </Select>
        <Select value={tripId} onChange={(e) => setTripId(e.target.value)}>
          <option value="">Select trip (optional)</option>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.tripNumber} · {trip.origin} → {trip.destination}
            </option>
          ))}
        </Select>
        <Input type="date" value={incurredAt} onChange={(e) => setIncurredAt(e.target.value)} />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <p className="text-sm text-muted">Receipt upload placeholder. Calculated costs are never manually edited.</p>
        <Button type="submit">Add expense</Button>
      </form>
    </Card>
  );
}
