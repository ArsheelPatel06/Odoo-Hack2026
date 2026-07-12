"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fleetVehicleService } from "@/modules/fleet";
import { VehicleType } from "@/shared/domain/enums";
import { Button, Card, Input, Select } from "@/shared/components/ui";

export function VehicleCreateForm() {
  const router = useRouter();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<VehicleType>(VehicleType.Truck);
  const [capacity, setCapacity] = useState("5000");
  const [odometerReading, setOdometerReading] = useState("0");
  const [acquisitionCost, setAcquisitionCost] = useState("0");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const vehicle = fleetVehicleService.createVehicle({
        registrationNumber,
        name,
        type,
        capacity: Number(capacity),
        odometerReading: Number(odometerReading),
        acquisitionCost: Number(acquisitionCost)
      });

      toast.success("Vehicle registered.");
      router.push(`/fleet/${vehicle.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create vehicle.");
    }
  };

  return (
    <Card>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Input
          value={registrationNumber}
          onChange={(event) => setRegistrationNumber(event.target.value)}
          placeholder="Registration number"
          required
        />
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Vehicle name" required />
        <Select value={type} onChange={(event) => setType(event.target.value as VehicleType)}>
          {Object.values(VehicleType).map((vehicleType) => (
            <option key={vehicleType} value={vehicleType}>
              {vehicleType}
            </option>
          ))}
        </Select>
        <Input value={capacity} onChange={(event) => setCapacity(event.target.value)} placeholder="Capacity (kg)" required />
        <Input
          value={odometerReading}
          onChange={(event) => setOdometerReading(event.target.value)}
          placeholder="Current odometer"
          required
        />
        <Input
          value={acquisitionCost}
          onChange={(event) => setAcquisitionCost(event.target.value)}
          placeholder="Acquisition cost"
          required
        />
        <p className="text-sm text-muted">New vehicles are automatically registered as Available through the workflow engine.</p>
        <Button type="submit">Create vehicle</Button>
      </form>
    </Card>
  );
}
