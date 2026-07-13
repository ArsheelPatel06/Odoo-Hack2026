"use client";

import { TrendingUp, Truck, Map, IndianRupee, Mail } from "lucide-react";
import { 
  fleetVehicleService, 
  tripManagementService, 
  fuelManagementService, 
  expenseManagementService 
} from "@/shared/mock-data";
import { VehicleStatus, TripStatus } from "@/shared/domain/enums";
import { EmailSenderModal } from "@/shared/components/ui";
import { useState, useMemo } from "react";
import { getAnalyticsReportTemplate } from "@/shared/lib/email-templates";
import { motion } from "framer-motion";
import { Sparkles, Users, Activity, BarChart2 } from "lucide-react";

type KPIProps = {
  title: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  icon: React.ReactNode;
};

function KPICard({ title, value, trend, trendDirection, icon }: KPIProps) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className="flex flex-col gap-4 rounded-[20px] bg-white p-6 shadow-sm hover:shadow-xl transition-shadow border border-slate-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-[12px] bg-slate-50 text-indigo-600">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendDirection === "up" ? "text-emerald-500" : "text-rose-500"}`}>
          <TrendingUp className={`size-3.5 ${trendDirection === "down" ? "rotate-180" : ""}`} />
          {trend}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </motion.div>
  );
}

export function AnalyticsDashboard() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Fetch all Data
  const vehicles = useMemo(() => fleetVehicleService.listVehicles({ pagination: { page: 1, pageSize: 1000 } }).items, []);
  const trips = useMemo(() => tripManagementService.listTrips({ pagination: { page: 1, pageSize: 1000 } }).items, []);
  const fuelLogs = useMemo(() => fuelManagementService.listFuelLogs({ pagination: { page: 1, pageSize: 1000 } }).items, []);
  const expenses = useMemo(() => expenseManagementService.listExpenses({ pagination: { page: 1, pageSize: 1000 } }).items, []);

  // Compute Revenue
  const completedTrips = trips.filter(t => t.status === TripStatus.Completed);
  const totalRevenue = completedTrips.reduce((sum, t) => sum + (t.revenue || 0), 0);

  // Compute Operating Cost
  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + (f.fuelCost || 0), 0);
  const totalOtherExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const operatingCost = totalFuelCost + totalOtherExpense;

  // Compute Fleet Efficiency
  const availableVehicles = vehicles.filter(v => v.status === VehicleStatus.Available).length;
  const onTripVehicles = vehicles.filter(v => v.status === VehicleStatus.OnTrip).length;
  const inShopVehicles = vehicles.filter(v => v.status === VehicleStatus.InShop).length;
  
  const fleetEfficiency = vehicles.length > 0 ? (onTripVehicles / vehicles.length) * 100 : 0;
  const avgDistance = completedTrips.length > 0 
    ? Math.round(completedTrips.reduce((sum, t) => sum + (t.plannedDistance || 0), 0) / completedTrips.length) 
    : 0;

  // Compute Monthly Data for Chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIndex = new Date().getMonth();
  
  // Last 6 months
  const chartLabels = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIndex - i + 12) % 12;
    chartLabels.push(months[idx]);
  }

  // Generate Email HTML
  const emailHtml = getAnalyticsReportTemplate(totalRevenue, operatingCost, fleetEfficiency, completedTrips.length);

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex justify-end">
        <button 
          onClick={() => setIsEmailModalOpen(true)}
          className="flex items-center gap-2 bg-[#0f172a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1e293b] transition-colors"
        >
          <Mail className="size-4" />
          Share Report
        </button>
      </div>

      <EmailSenderModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        subject="Daily Analytics Report - TransitOps"
        htmlContent={emailHtml}
        title="Share Analytics Report"
        description="Send a beautiful HTML summary of today's operations to your inbox."
      />
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Revenue" 
          value={`₹ ${(totalRevenue / 1000).toFixed(1)}k`} 
          trend="+12.5%" 
          trendDirection="up"
          icon={<IndianRupee className="size-5" />} 
        />
        <KPICard 
          title="Fleet Efficiency" 
          value={`${fleetEfficiency.toFixed(1)}%`} 
          trend="+4.2%" 
          trendDirection="up"
          icon={<Truck className="size-5" />} 
        />
        <KPICard 
          title="Avg. Trip Distance" 
          value={`${avgDistance} km`} 
          trend="-2.1%" 
          trendDirection="down"
          icon={<Map className="size-5" />} 
        />
        <KPICard 
          title="Operating Cost" 
          value={`₹ ${(operatingCost / 1000).toFixed(1)}k`} 
          trend="-8.4%" 
          trendDirection="down"
          icon={<IndianRupee className="size-5" />} 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="col-span-1 lg:col-span-2 rounded-[24px] bg-white p-6 shadow-soft border border-slate-100 flex flex-col min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Revenue vs Expenses (Last 6 Months)</h3>
          
          <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-8 mt-auto border-b border-slate-100 relative">
            {/* Mock Y-Axis */}
            <div className="absolute left-0 top-0 bottom-8 w-full flex flex-col justify-between text-xs text-slate-400 -z-10">
              <div className="border-b border-slate-50 border-dashed w-full pb-1">High</div>
              <div className="border-b border-slate-50 border-dashed w-full pb-1">Med</div>
              <div className="border-b border-slate-50 border-dashed w-full pb-1">Low</div>
              <div className="w-full pb-1">0</div>
            </div>

            {/* Mock Bars using pseudo random derived from our total */}
            {chartLabels.map((month, i) => {
              const baseH = 30 + (i * 10) + ((totalRevenue % 10) * 2); 
              const revH = Math.min(100, baseH + Math.random() * 20);
              const expH = revH * (0.3 + Math.random() * 0.4);
              return (
                <div key={month} className="flex flex-col items-center gap-2 group flex-1">
                  <div className="relative flex items-end justify-center w-full max-w-[40px] h-[300px]">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${expH}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="absolute bottom-0 w-full rounded-t-[6px] bg-rose-400 transition-opacity duration-300 group-hover:opacity-80" 
                    />
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${revH}%` }}
                      transition={{ duration: 1, delay: i * 0.1 + 0.2 }}
                      className="absolute bottom-0 w-full rounded-t-[6px] bg-indigo-500 opacity-90 transition-opacity duration-300 group-hover:opacity-100" 
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500">{month}</span>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-indigo-500" />
              <span className="text-sm text-slate-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-rose-400" />
              <span className="text-sm text-slate-600">Expenses</span>
            </div>
          </div>
        </div>

        {/* Side Chart */}
        <div className="rounded-[24px] bg-slate-900 p-6 text-white shadow-soft flex flex-col min-h-[400px]">
          <h3 className="text-lg font-semibold mb-6">Fleet Status Distribution</h3>
          
          <div className="flex-1 flex flex-col justify-center gap-8">
            <div className="relative mx-auto size-[200px] flex items-center justify-center">
              {/* Dynamic Donut Chart using Conic Gradient */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-slate-900" 
                style={{
                  background: `conic-gradient(
                    #34d399 0% ${(availableVehicles/vehicles.length)*100}%, 
                    #6366f1 ${(availableVehicles/vehicles.length)*100}% ${((availableVehicles+onTripVehicles)/vehicles.length)*100}%, 
                    #fb7185 ${((availableVehicles+onTripVehicles)/vehicles.length)*100}% 100%
                  )`
                }}
              />
              <div className="absolute inset-4 rounded-full bg-slate-900" />
              <div className="relative text-center">
                <span className="block text-3xl font-bold">{vehicles.length}</span>
                <span className="text-xs font-medium text-slate-400">Total Assets</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-emerald-400" />
                  <span className="text-sm text-slate-300">Available ({availableVehicles})</span>
                </div>
                <span className="text-sm font-bold">{vehicles.length ? Math.round((availableVehicles/vehicles.length)*100) : 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-indigo-500" />
                  <span className="text-sm text-slate-300">On Trip ({onTripVehicles})</span>
                </div>
                <span className="text-sm font-bold">{vehicles.length ? Math.round((onTripVehicles/vehicles.length)*100) : 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-rose-400" />
                  <span className="text-sm text-slate-300">In Shop ({inShopVehicles})</span>
                </div>
                <span className="text-sm font-bold">{vehicles.length ? Math.round((inShopVehicles/vehicles.length)*100) : 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Command Center Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        
        {/* Predictive AI Insights */}
        <div className="col-span-1 rounded-[24px] bg-gradient-to-br from-indigo-900 to-slate-900 p-6 text-white shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Sparkles className="size-24" />
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="size-5 text-indigo-400" />
            <h3 className="text-lg font-semibold">Predictive AI Insights</h3>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <p className="text-sm font-medium text-indigo-200 mb-1">Maintenance Forecast</p>
              <p className="text-sm">3 vehicles (TRK-004, TRK-012, VAN-002) show anomalous engine telemetry. Scheduling preventive maintenance now will save estimated ₹45,000.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <p className="text-sm font-medium text-emerald-200 mb-1">Route Optimization</p>
              <p className="text-sm">Re-routing the Mumbai-Pune corridor based on projected traffic delays could improve overall fleet efficiency by 8% today.</p>
            </div>
          </div>
        </div>

        {/* Driver Performance Rankings */}
        <div className="col-span-1 rounded-[24px] bg-white p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Users className="size-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-900">Driver Rankings</h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            {[
              { name: "Rahul Sharma", score: 98, trend: "+2", id: 1 },
              { name: "Amit Kumar", score: 95, trend: "+1", id: 2 },
              { name: "Suresh Singh", score: 91, trend: "-1", id: 3 },
              { name: "Vikram Patel", score: 88, trend: "0", id: 4 },
            ].map((driver, i) => (
              <div key={driver.id} className="flex items-center justify-between border-b border-slate-50 last:border-0 py-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{driver.name}</p>
                    <p className="text-xs text-slate-500">Safety Score: {driver.score}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${driver.trend.startsWith('+') ? 'text-emerald-500' : driver.trend.startsWith('-') ? 'text-rose-500' : 'text-slate-400'}`}>
                  {driver.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Activity Heatmap (Mock) */}
        <div className="col-span-1 rounded-[24px] bg-white p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="size-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-900">Regional Activity</h3>
          </div>
          
          <div className="flex-1 relative rounded-xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            
            <div className="w-full space-y-4 relative z-10">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-700">Maharashtra Hub</span>
                  <span className="text-indigo-600">45 Active Trips</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1 }} className="h-full bg-indigo-500" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-700">Karnataka Hub</span>
                  <span className="text-emerald-600">32 Active Trips</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-emerald-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-700">Gujarat Hub</span>
                  <span className="text-rose-600">12 Active Trips</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-rose-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
