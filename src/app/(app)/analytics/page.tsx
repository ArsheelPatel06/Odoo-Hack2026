"use client";

import { AnalyticsDashboard } from "@/modules/analytics/components";
import { PageHeader } from "@/shared/components/ui/PageHeader";

export default function AnalyticsPage() {
  return (
    <div className="flex h-[calc(100vh-32px)] flex-col gap-6 pt-4 pb-4 overflow-hidden">
      
      {/* Scrollable Main Area */}
      <div className="flex flex-col gap-6 overflow-y-auto px-4 scrollbar-hide pb-12">
        
        <PageHeader 
          title="Analytics Overview" 
          description="High-level insights across fleet operations, trips, and expenses." 
        />
        
        <AnalyticsDashboard />

      </div>

    </div>
  );
}
