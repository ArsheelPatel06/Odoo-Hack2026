import { PageHeader, Card } from "@/shared/components/ui";
import { BookOpen, MapPin, Truck, BarChart3, ShieldCheck, Zap, Box, Wrench } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-8 pb-20 pt-4">
      <div className="flex items-center gap-3">
        <BookOpen className="size-8 text-indigo-600" />
        <PageHeader 
          title="TransitOps Platform Guide" 
          description="A comprehensive overview of the platform's capabilities, architecture, and modules." 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Business Architecture Section */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Zap className="size-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-900">Platform Architecture</h2>
          </div>
          <div className="text-sm text-slate-600 space-y-3">
            <p>
              TransitOps is designed to unify your entire logistics ecosystem. The platform architecture connects the physical fleet to a central dispatch brain, enabling real-time routing, automated maintenance triggers, and comprehensive financial tracking.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Centralized Dispatching:</strong> All active trips, unassigned routes, and drivers are pooled into a central, AI-ready dispatch matrix.</li>
              <li><strong>Real-time Telemetry:</strong> Vehicles stream their geolocation and health status back to the platform, automatically updating ETAs and triggering maintenance alerts.</li>
              <li><strong>Unified Resource Management:</strong> The system ensures that a driver, a healthy vehicle, and an active route are perfectly synchronized before any dispatch occurs.</li>
              <li><strong>Proactive Compliance:</strong> Regulatory checks and safety requirements are enforced system-wide, preventing non-compliant operations.</li>
            </ul>
          </div>
        </Card>

        {/* Modules & Pages Section */}
        <Card className="flex flex-col gap-4 md:row-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Box className="size-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-900">Platform Pages & Modules</h2>
          </div>
          <div className="text-sm text-slate-600 space-y-5">
            <p>
              The platform is divided into specialized pages, each tailored for specific operational roles:
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <BarChart3 className="size-4 text-indigo-500" /> Dashboard
                </div>
                <p>Your daily command center. Offers a high-level view of active operations, fleet health metrics, delayed shipments, and pending alerts at a single glance.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <MapPin className="size-4 text-indigo-500" /> Trips & Dispatch
                </div>
                <p>The operational heart of the system. Features a drag-and-drop Kanban board for managing trips from 'Ready' to 'In Transit' to 'Completed', accompanied by a live map tracking all active assets.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Truck className="size-4 text-indigo-500" /> Fleet Management
                </div>
                <p>A comprehensive registry of your physical assets. Track vehicle registration, mileage, capacity, and current assignment statuses.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Wrench className="size-4 text-indigo-500" /> Maintenance
                </div>
                <p>Preventative and reactive maintenance tracking. Automatically flags vehicles requiring service, calculates repair costs (parts & labor), and tracks repair histories.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <ShieldCheck className="size-4 text-indigo-500" /> Personnel & Compliance
                </div>
                <p>Manage your drivers, shifts, and safety records. Ensure licenses are up-to-date and hours-of-service compliance is maintained across the workforce.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Scalability & Future */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BarChart3 className="size-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-900">Analytics & Insights</h2>
          </div>
          <div className="text-sm text-slate-600 space-y-3">
            <p>
              Every action taken within the platform generates valuable data. The Analytics module aggregates trip completion rates, average maintenance costs, and driver performance scores.
            </p>
            <p>
              By leveraging historical trends, operations managers can identify bottlenecks in specific routes or recurring mechanical failures in certain vehicle classes, enabling data-driven optimization.
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
}
