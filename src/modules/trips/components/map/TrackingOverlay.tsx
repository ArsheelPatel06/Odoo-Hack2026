"use client";

import { MockRoute } from "./FleetSimulationEngine";
import { MapplsTripStats } from "./MapplsSimulatedTrip";
import { CheckCircle2 } from "lucide-react";

type TrackingOverlayProps = {
  route: MockRoute;
  stats?: MapplsTripStats;
  isCompleted?: boolean;
};

// Simple SVG progress ring
const ProgressRing = ({ progress }: { progress: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center size-12 shrink-0">
      <svg className="transform -rotate-90 size-12">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-slate-100"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-indigo-600 transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute flex items-center justify-center text-[10px] font-bold text-slate-700">
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
};

export function TrackingOverlay({ route, stats, isCompleted }: TrackingOverlayProps) {
  if (isCompleted) {
    return (
      <div className="flex w-[320px] pointer-events-auto items-center gap-4 rounded-[20px] border border-emerald-100 bg-white/95 p-4 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-left-4 fade-in">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="size-6" />
        </div>
        <div>
          <div className="text-[14px] font-bold text-slate-900">{route.vehicleName} Arrived</div>
          <div className="text-[12px] font-medium text-emerald-600">Trip Completed</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-[320px] pointer-events-auto flex-col gap-3 rounded-[20px] border border-slate-200/60 bg-white/95 p-4 shadow-xl backdrop-blur-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ProgressRing progress={stats?.progress || 0} />
          <div>
            <div className="text-[15px] font-bold tracking-tight text-slate-900">
              {route.vehicleName}
            </div>
            <div className="text-[12px] font-medium text-slate-500">
              {route.driverName}
            </div>
          </div>
        </div>
        <div className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
          On Trip
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-[12px] bg-slate-50 p-2 border border-slate-100">
        <div className="flex flex-col items-center border-r border-slate-200">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">ETA</span>
          <span className="text-[14px] font-bold text-slate-800">
            {stats ? `${stats.etaMinutes}m` : "--"}
          </span>
        </div>
        <div className="flex flex-col items-center border-r border-slate-200">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Speed</span>
          <span className="text-[14px] font-bold text-slate-800">
            {stats ? stats.speed : "--"} <span className="text-[10px] font-medium text-slate-500">km/h</span>
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Left</span>
          <span className="text-[14px] font-bold text-slate-800">
            {stats ? stats.distanceRemainingKm : "--"} <span className="text-[10px] font-medium text-slate-500">km</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-1 px-1">
        <div className="size-2 rounded-full bg-indigo-500 animate-pulse" />
        <div className="text-[11px] font-medium text-slate-500 truncate">
          Heading to <span className="font-semibold text-slate-700">{route.name.split(' to ')[1]}</span>
        </div>
      </div>
    </div>
  );
}
