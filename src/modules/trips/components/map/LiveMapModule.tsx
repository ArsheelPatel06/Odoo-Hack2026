"use client";

import dynamic from "next/dynamic";
import { MOCK_ROUTES } from "./FleetSimulationEngine";

const LeafletMap = dynamic(
  () => import("@/shared/components/ui/LeafletMap").then(mod => mod.LeafletMap),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-[24px]">Loading Map...</div> }
);

interface LiveMapModuleProps {
  apiKey?: string;
  isDemoActive: boolean;
}

export function LiveMapModule({ isDemoActive }: LiveMapModuleProps) {
  return (
    <div className="relative w-full h-[600px] bg-slate-100 rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
      <LeafletMap 
        origin={MOCK_ROUTES[0].origin}
        destination={MOCK_ROUTES[0].destination}
        isActive={isDemoActive}
      />
    </div>
  );
}
