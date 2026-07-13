import { Search, List, SlidersHorizontal, Download, LayoutTemplate } from "lucide-react";
import { Input, Button } from "@/shared/components/ui";

type FleetToolbarProps = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: "all" | "available" | "needs_service";
  setStatusFilter: (f: "all" | "available" | "needs_service") => void;
  viewMode: "grid" | "list";
  setViewMode: (m: "grid" | "list") => void;
  onExport: () => void;
};

export function FleetToolbar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  onExport
}: FleetToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between sticky top-4 z-20">
      
      {/* Left: Search & Quick Filters */}
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-[280px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search vehicles, plates..." 
            className="pl-9 h-10 rounded-full border-slate-200 bg-slate-50 focus-visible:bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="hidden h-6 w-px bg-slate-200 md:block" />

        <div className="hidden items-center gap-2 md:flex">
          <Button 
            variant="ghost" 
            className={`h-10 rounded-full px-4 text-sm font-semibold ${statusFilter === 'available' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 bg-slate-100/50 hover:bg-slate-100'}`}
            onClick={() => setStatusFilter(statusFilter === 'available' ? 'all' : 'available')}
          >
            Available
          </Button>
          <Button 
            variant="ghost" 
            className={`h-10 rounded-full px-4 text-sm font-semibold ${statusFilter === 'needs_service' ? 'bg-amber-100 text-amber-700' : 'text-slate-600 bg-slate-100/50 hover:bg-slate-100'}`}
            onClick={() => setStatusFilter(statusFilter === 'needs_service' ? 'all' : 'needs_service')}
          >
            Needs Service
          </Button>
        </div>
      </div>

      {/* Right: Advanced, View, Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="h-10 rounded-full px-4 text-sm font-semibold" onClick={() => alert("Advanced Filters Modal would open here")}>
          <SlidersHorizontal className="mr-2 size-4" />
          Advanced Filters
        </Button>
        
        <div className="flex items-center rounded-full border border-slate-200 p-1">
          <button 
            className={`rounded-full p-1.5 shadow-sm transition-colors ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutTemplate className="size-4" />
          </button>
          <button 
            className={`rounded-full p-1.5 shadow-sm transition-colors ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            onClick={() => setViewMode('list')}
          >
            <List className="size-4" />
          </button>
        </div>

        <div className="hidden h-6 w-px bg-slate-200 md:block" />

        <Button variant="ghost" className="h-10 rounded-full px-4 text-sm font-semibold text-slate-600 hover:text-slate-900" onClick={onExport}>
          <Download className="mr-2 size-4" />
          Export CSV
        </Button>
      </div>

    </div>
  );
}
