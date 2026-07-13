import type { Driver, Vehicle } from "@/shared/domain/models";
import { DispatchDriverCard } from "@/modules/trips/components/dispatch/DispatchDriverCard";
import { DispatchVehicleCard } from "@/modules/trips/components/dispatch/DispatchVehicleCard";
import { AlertCard, Button, Card, SearchInput, Toolbar } from "@/shared/components/ui";

type DispatchDriverStepProps = {
  drivers: Driver[];
  search: string;
  selectedDriverId: string | null;
  onSearchChange: (value: string) => void;
  onSelectDriver: (driverId: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function DispatchDriverStep({
  drivers,
  search,
  selectedDriverId,
  onSearchChange,
  onSelectDriver,
  onBack,
  onContinue
}: DispatchDriverStepProps) {
  const filtered = drivers.filter((driver) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return driver.name.toLowerCase().includes(query) || driver.licenseNumber.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div>
          <h2 className="text-heading-md font-semibold text-primary">Driver assignment</h2>
          <p className="mt-1 text-body-sm text-muted">Only available drivers with valid licenses can be dispatched.</p>
        </div>

        <Toolbar>
          <SearchInput
            className="min-w-[240px] flex-1"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search driver or license"
          />
        </Toolbar>
      </Card>

      {filtered.length === 0 ? (
        <AlertCard tone="warning" title="No dispatchable drivers" description="All operators are on trip, off duty, or suspended." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((driver) => (
            <DispatchDriverCard
              key={driver.id}
              driver={driver}
              selected={selectedDriverId === driver.id}
              onSelect={() => onSelectDriver(driver.id)}
            />
          ))}
        </div>
      )}

      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button disabled={!selectedDriverId} onClick={onContinue}>
          Continue to dispatch validation
        </Button>
      </div>
    </div>
  );
}

type DispatchVehicleStepProps = {
  vehicles: Vehicle[];
  cargoWeight: number;
  search: string;
  selectedVehicleId: string | null;
  onSearchChange: (value: string) => void;
  onSelectVehicle: (vehicleId: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function DispatchVehicleStep({
  vehicles,
  cargoWeight,
  search,
  selectedVehicleId,
  onSearchChange,
  onSelectVehicle,
  onBack,
  onContinue
}: DispatchVehicleStepProps) {
  const filtered = vehicles.filter((vehicle) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      vehicle.name.toLowerCase().includes(query) ||
      vehicle.registrationNumber.toLowerCase().includes(query) ||
      vehicle.type.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div>
          <h2 className="text-heading-md font-semibold text-primary">Vehicle assignment</h2>
          <p className="mt-1 text-body-sm text-muted">
            Retired and in-shop units are excluded. Capacity fit is calculated against your cargo load.
          </p>
        </div>

        <Toolbar>
          <SearchInput
            className="min-w-[240px] flex-1"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search vehicle, plate, or type"
          />
        </Toolbar>
      </Card>

      {filtered.length === 0 ? (
        <AlertCard tone="warning" title="No dispatchable vehicles" description="All units are on trip, in shop, or retired." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((vehicle) => (
            <DispatchVehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              cargoWeight={cargoWeight}
              selected={selectedVehicleId === vehicle.id}
              onSelect={() => onSelectVehicle(vehicle.id)}
            />
          ))}
        </div>
      )}

      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button disabled={!selectedVehicleId} onClick={onContinue}>
          Continue to driver selection
        </Button>
      </div>
    </div>
  );
}
