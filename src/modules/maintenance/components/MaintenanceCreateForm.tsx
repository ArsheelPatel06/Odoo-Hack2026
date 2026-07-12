"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fleetVehicleService } from "@/modules/fleet";
import { maintenanceManagementService } from "@/modules/maintenance";
import { MaintenancePriority, MaintenanceType } from "@/shared/domain/enums";
import { Button, Card, Input, Select } from "@/shared/components/ui";

export function MaintenanceCreateForm() {
  const router = useRouter();
  const [vehicleId, setVehicleId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maintenanceType, setMaintenanceType] = useState<MaintenanceType>(MaintenanceType.GeneralService);
  const [priority, setPriority] = useState<MaintenancePriority>(MaintenancePriority.Medium);
  const [assignedTechnician, setAssignedTechnician] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("5000");
  const [expectedCompletionAt, setExpectedCompletionAt] = useState("");

  const eligibleVehicles = useMemo(() => fleetVehicleService.getDispatchableVehicles(), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const record = maintenanceManagementService.createMaintenance({
        vehicleId,
        title,
        description,
        maintenanceType,
        priority,
        assignedTechnician,
        estimatedCost: Number(estimatedCost),
        expectedCompletionAt: new Date(expectedCompletionAt).toISOString()
      });

      toast.success("Maintenance started. Vehicle moved to In Shop via workflow engine.");
      router.push(`/maintenance/${record.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create maintenance.");
    }
  };

  return (
    <Card>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} required>
          <option value="">Select vehicle</option>
          {eligibleVehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name} ({vehicle.registrationNumber})
            </option>
          ))}
        </Select>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Issue title" required />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <Select value={maintenanceType} onChange={(e) => setMaintenanceType(e.target.value as MaintenanceType)}>
          {Object.values(MaintenanceType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
        <Select value={priority} onChange={(e) => setPriority(e.target.value as MaintenancePriority)}>
          {Object.values(MaintenancePriority).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
        <Input value={assignedTechnician} onChange={(e) => setAssignedTechnician(e.target.value)} placeholder="Assigned technician" required />
        <Input value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} placeholder="Estimated cost" required />
        <Input type="date" value={expectedCompletionAt} onChange={(e) => setExpectedCompletionAt(e.target.value)} required />
        <p className="text-sm text-muted">Submitting calls workflow.startMaintenance() and automatically sets the vehicle to In Shop.</p>
        <Button type="submit">Start maintenance</Button>
      </form>
    </Card>
  );
}
