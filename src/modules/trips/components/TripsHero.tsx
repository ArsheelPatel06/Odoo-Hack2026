import { Button } from "@/shared/components/ui";
import { Plus } from "lucide-react";

type TripsHeroProps = {
  activeTrips: number;
  completedToday: number;
  inTransit: number;
  scheduled: number;
  onDispatchClick: () => void;
};

export function TripsHero({ activeTrips, completedToday, inTransit, scheduled, onDispatchClick }: TripsHeroProps) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-[24px] bg-indigo-600 p-8 text-white shadow-soft">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute -right-20 -top-20 size-[300px] rounded-full bg-white/10 blur-[80px]" />
      
      <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        
        {/* Left Side: Title & Composition */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Trips & Dispatch</h1>
            <p className="mt-1 text-indigo-100">Monitoring {activeTrips} active operations across all routes.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{activeTrips}</span>
              <span className="text-sm text-indigo-200">Active</span>
            </div>
            <div className="h-4 w-px bg-indigo-500" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-300">{completedToday}</span>
              <span className="text-sm text-indigo-200">Completed Today</span>
            </div>
            <div className="h-4 w-px bg-indigo-500" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-sky-300">{inTransit}</span>
              <span className="text-sm text-indigo-200">In Transit</span>
            </div>
            <div className="h-4 w-px bg-indigo-500" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-amber-300">{scheduled}</span>
              <span className="text-sm text-indigo-200">Scheduled</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action */}
        <div className="flex flex-col items-end gap-6">
          <Button 
            onClick={onDispatchClick} 
            className="bg-white text-indigo-600 hover:bg-slate-50 px-6 font-semibold shadow-sm"
          >
            <Plus className="size-4 mr-2" />
            Dispatch Trip
          </Button>

          <div className="flex flex-col items-end gap-2 w-[240px]">
             <div className="flex w-full justify-between items-end">
               <span className="text-sm font-medium text-indigo-200">On-Time Performance</span>
               <span className="text-2xl font-bold tracking-tight text-emerald-300">94%</span>
             </div>
             {/* Horizontal Block Progress Bar */}
             <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-sm">
               {Array.from({ length: 20 }).map((_, i) => (
                 <div 
                   key={i} 
                   className={`h-full flex-1 rounded-sm ${i < (94 / 100) * 20 ? 'bg-emerald-400' : 'bg-indigo-500'}`} 
                 />
               ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
