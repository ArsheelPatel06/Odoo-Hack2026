import { X, Edit, Trash2 } from "lucide-react";
import { type Vehicle } from "@/shared/domain/models";
import { VEHICLE_STATUS_COLORS } from "@/shared/domain/constants";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui";

type FleetDetailDrawerProps = {
  vehicle: Vehicle;
  onClose: () => void;
};

export function FleetDetailDrawer({ vehicle, onClose }: FleetDetailDrawerProps) {
  const tone = VEHICLE_STATUS_COLORS[vehicle.status] || "muted";

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 flex w-[480px] shrink-0 flex-col overflow-hidden bg-white shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-100">
        
        {/* Header & Context */}
        <div className="relative p-6 pb-0">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <X className="size-4" />
          </button>

          {/* Large Image Placeholder */}
          <div className="mb-6 flex h-[160px] w-full items-center justify-center rounded-2xl bg-slate-50">
            <svg viewBox="0 0 200 120" className="h-[120px] w-[200px] text-slate-200 drop-shadow-sm" fill="currentColor">
              <rect x="20" y="40" width="160" height="60" rx="12" />
              <rect x="140" y="20" width="40" height="40" rx="8" />
              <circle cx="50" cy="100" r="14" fill="#94a3b8" />
              <circle cx="150" cy="100" r="14" fill="#94a3b8" />
            </svg>
          </div>

          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{vehicle.name}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">{vehicle.registrationNumber} • {vehicle.type}</p>
            </div>
            <StatusBadge label={vehicle.status} tone={tone} size="md" className="shadow-sm" />
          </div>

          {/* KPI Strip */}
          <div className="mb-6 grid grid-cols-4 gap-2 rounded-2xl bg-slate-50 p-4">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Driver</p>
              <p className="mt-0.5 text-xs font-bold text-slate-900">Alex M.</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Trip</p>
              <p className="mt-0.5 text-xs font-bold text-slate-900">TRP-21</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Health</p>
              <p className="mt-0.5 text-xs font-bold text-emerald-500">96%</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Fuel</p>
              <p className="mt-0.5 text-xs font-bold text-slate-900">4.6 km/L</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 shrink-0">
          {["Overview", "Timeline", "Maintenance", "Fuel", "Expenses"].map((tab, i) => (
            <button 
              key={tab}
              className={`pb-3 text-sm font-semibold transition-colors mr-6 ${
                i === 1 ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area (Timeline active for mockup) */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-2 h-full w-px bg-slate-100" />
            
            {/* Today */}
            <div className="mb-8">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Today</h3>
              <div className="mb-6 flex gap-4">
                <div className="relative z-10 flex size-6 items-center justify-center rounded-full border-[3px] border-white bg-indigo-500 shadow-sm" />
                <div className="mt-0.5">
                  <p className="text-sm font-bold text-slate-900">Trip TRP-21 Completed</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Arrived at Stockholm Distribution Center at 14:30</p>
                </div>
              </div>
              <div className="mb-6 flex gap-4">
                <div className="relative z-10 flex size-6 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500 shadow-sm" />
                <div className="mt-0.5">
                  <p className="text-sm font-bold text-slate-900">Fuel Added (120L)</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Logged by Driver Alex M. at Shell Station #42</p>
                </div>
              </div>
            </div>

            {/* Yesterday */}
            <div className="mb-8">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Yesterday</h3>
              <div className="mb-6 flex gap-4">
                <div className="relative z-10 flex size-6 items-center justify-center rounded-full border-[3px] border-white bg-amber-500 shadow-sm" />
                <div className="mt-0.5">
                  <p className="text-sm font-bold text-slate-900">Maintenance Completed</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Brake pad replacement and oil change at Central Shop.</p>
                </div>
              </div>
            </div>

            {/* July 6 */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">July 6</h3>
              <div className="mb-6 flex gap-4">
                <div className="relative z-10 flex size-6 items-center justify-center rounded-full border-[3px] border-white bg-slate-900 shadow-sm" />
                <div className="mt-0.5">
                  <p className="text-sm font-bold text-slate-900">Vehicle Registered</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Added to fleet registry with starting odometer 18,100km.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="flex shrink-0 items-center gap-3 border-t border-slate-100 bg-white p-6 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
          <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-full h-10 shadow-sm">
            Assign
          </Button>
          <Button variant="outline" className="flex-1 font-semibold rounded-full h-10 shadow-sm">
            Maintenance
          </Button>
          <button className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors">
            <Edit className="size-4" />
          </button>
          <button className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors">
            <Trash2 className="size-4" />
          </button>
        </div>

      </div>
    </>
  );
}
