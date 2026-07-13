import Link from "next/link";
import { Star, User } from "lucide-react";
import { type Vehicle } from "@/shared/domain/models";
import { VEHICLE_STATUS_COLORS } from "@/shared/domain/constants";
import { CircularGauge } from "@/shared/components/ui/CircularGauge";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui";
import { cn } from "@/shared/lib";

type VehicleCardProps = {
  vehicle: Vehicle;
  onClick: () => void;
  isList?: boolean;
};

// Generating stable mock data for the UI presentation layer based on vehicle ID
function generateMockData(id: string) {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const health = 70 + (hash % 30);
  const fuel = (3.5 + (hash % 20) / 10).toFixed(1);
  const value = (2.1 + (hash % 30) / 10).toFixed(1);
  return { health, fuel, value };
}

export function VehicleCard({ vehicle, onClick, isList = false }: VehicleCardProps) {
  const mock = generateMockData(vehicle.id);
  const tone = VEHICLE_STATUS_COLORS[vehicle.status] || "muted";

  if (isList) {
    return (
      <div 
        onClick={onClick}
        className="group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-[24px] border border-slate-100 bg-white p-4 pr-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-200"
      >
        <div className="flex items-center gap-6">
          {/* Favorite Star */}
          <div className="text-slate-300 hover:text-amber-400">
            <Star className="size-5" />
          </div>

          {/* SVG Image Placeholder */}
          <div className="relative h-[60px] w-[100px] transition-transform duration-500 group-hover:scale-[1.02]">
            <svg viewBox="0 0 200 120" className="h-full w-full text-slate-200 drop-shadow-sm" fill="currentColor">
              <rect x="20" y="40" width="160" height="60" rx="12" />
              <rect x="140" y="20" width="40" height="40" rx="8" />
              <circle cx="50" cy="100" r="14" fill="#64748b" />
              <circle cx="150" cy="100" r="14" fill="#64748b" />
              <path d="M 20 60 L 180 60" stroke="#f1f5f9" strokeWidth="4" />
            </svg>
          </div>

          {/* Title & Value */}
          <div className="w-[140px]">
            <h3 className="text-base font-bold text-slate-900">{vehicle.name}</h3>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">₹{mock.value} Cr</p>
          </div>

          <div className="hidden h-10 w-px bg-slate-100 md:block" />

          {/* Health & Status */}
          <div className="flex items-center gap-4 w-[160px]">
            <CircularGauge value={mock.health} size={36} strokeWidth={3} />
            <div>
              <StatusBadge label={vehicle.status} tone={tone} size="sm" className="shadow-sm group-hover:shadow-md transition-shadow" />
            </div>
          </div>

          <div className="hidden h-10 w-px bg-slate-100 md:block" />

          {/* Stats */}
          <div className="hidden items-center gap-8 md:flex">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Capacity</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{vehicle.capacity.toLocaleString()} kg</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Mileage</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{vehicle.odometerReading.toLocaleString()} km</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Driver</p>
              <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <User className="size-3.5 text-slate-400" /> Alex M.
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button variant="outline" size="sm" className="h-9 rounded-full px-4 font-semibold shadow-sm" onClick={(e) => { e.stopPropagation(); }}>Assign</Button>
          <div onClick={(e) => e.stopPropagation()}>
            <Link href={`/fleet/${vehicle.id}`}>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-9 rounded-full px-4 font-semibold shadow-sm bg-slate-900 text-white hover:bg-slate-800"
              >
                Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-200"
    >
      {/* Favorite Star */}
      <div className="absolute left-6 top-6 z-10 text-slate-300 hover:text-amber-400">
        <Star className="size-5" />
      </div>

      {/* SVG Image Placeholder with slight scale on hover */}
      <div className="relative mx-auto mb-6 h-[120px] w-[200px] transition-transform duration-500 group-hover:scale-[1.02]">
        <svg viewBox="0 0 200 120" className="h-full w-full text-slate-200 drop-shadow-sm" fill="currentColor">
          <rect x="20" y="40" width="160" height="60" rx="12" />
          <rect x="140" y="20" width="40" height="40" rx="8" />
          <circle cx="50" cy="100" r="14" fill="#64748b" />
          <circle cx="150" cy="100" r="14" fill="#64748b" />
          <path d="M 20 60 L 180 60" stroke="#f1f5f9" strokeWidth="4" />
        </svg>
      </div>

      {/* Title & Value */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-slate-900">{vehicle.name}</h3>
        <p className="mt-0.5 text-xs font-semibold text-slate-400">₹{mock.value} Cr</p>
      </div>

      {/* Health & Status Container */}
      <div className="mb-6 flex items-center justify-between rounded-2xl bg-slate-50 p-3">
        <div className="flex items-center gap-3">
          <CircularGauge value={mock.health} size={42} strokeWidth={4} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Health</p>
            <StatusBadge label={vehicle.status} tone={tone} size="sm" className="mt-0.5 shadow-sm group-hover:shadow-md transition-shadow" />
          </div>
        </div>
      </div>

      {/* Context Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
        <div>
          <p className="text-[11px] font-medium text-slate-400">Capacity</p>
          <p className="mt-0.5 font-semibold text-slate-900">{vehicle.capacity.toLocaleString()} kg</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-400">Mileage</p>
          <p className="mt-0.5 font-semibold text-slate-900">{vehicle.odometerReading.toLocaleString()} km</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-400">Driver</p>
          <div className="mt-0.5 flex items-center gap-1.5 font-semibold text-slate-900">
            <User className="size-3.5 text-slate-400" /> Alex M.
          </div>
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-400">Efficiency</p>
          <p className="mt-0.5 font-semibold text-slate-900">{mock.fuel} km/L</p>
        </div>
      </div>

      {/* Quick Actions (Fade in on hover) */}
      <div className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-center gap-2 bg-white/90 p-4 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <Button variant="outline" size="sm" className="h-9 rounded-full px-4 font-semibold shadow-sm" onClick={(e) => { e.stopPropagation(); }}>Assign</Button>
        <div onClick={(e) => e.stopPropagation()}>
          <Link href={`/fleet/${vehicle.id}`}>
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-9 rounded-full px-4 font-semibold shadow-sm bg-slate-900 text-white hover:bg-slate-800"
            >
              View Full Details
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
