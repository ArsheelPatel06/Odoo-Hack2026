import { Button } from "@/shared/components/ui";

type FleetHeroProps = {
  health: number;
  total: number;
  running: number;
  available: number;
  service: number;
  onRegisterClick: () => void;
};

export function FleetHero({ health, total, running, available, service, onRegisterClick }: FleetHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-slate-900 p-8 text-white shadow-soft shrink-0">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 size-[300px] rounded-full bg-emerald-500/10 blur-[80px]" />
      
      <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        
        {/* Left Side: Title & Composition */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Fleet Management</h1>
            <p className="mt-1 text-slate-400">Manage {total} active fleet assets across all regions.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{total}</span>
              <span className="text-sm text-slate-400">Vehicles</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-400">{available}</span>
              <span className="text-sm text-slate-400">Available</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-indigo-400">{running}</span>
              <span className="text-sm text-slate-400">Running</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-amber-400">{service}</span>
              <span className="text-sm text-slate-400">Service</span>
            </div>
          </div>
        </div>

        {/* Right Side: Health & Action */}
        <div className="flex flex-col items-end gap-6">
          <Button 
            onClick={onRegisterClick} 
            className="bg-white text-slate-900 hover:bg-slate-100 px-6 font-semibold"
          >
            Register Vehicle
          </Button>

          <div className="flex flex-col items-end gap-2 w-[240px]">
            <div className="flex w-full justify-between items-end">
              <span className="text-sm font-medium text-slate-400">Fleet Health</span>
              <span className="text-2xl font-bold tracking-tight text-emerald-400">{health}%</span>
            </div>
            {/* Horizontal Block Progress Bar */}
            <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-sm">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-full flex-1 rounded-sm ${i < (health / 100) * 20 ? 'bg-emerald-500' : 'bg-slate-800'}`} 
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
