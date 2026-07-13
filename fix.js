const fs = require('fs');

function replace(file, search, replace) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(search, replace);
  fs.writeFileSync(file, content);
}

replace('src/app/(app)/docs/page.tsx', /'([^']*)'/g, "&apos;$1&apos;");
replace('src/app/api/send-email/route.ts', /catch \(error: any\)/g, "catch (error: unknown)");
replace('src/core/testing/mock-factories.ts', /const now = new Date\(\)\.toISOString\(\);\n/g, "");
replace('src/modules/analytics/components/AnalyticsDashboard.tsx', /, BarChart2 /g, " ");
replace('src/modules/fleet/components/VehicleCard.tsx', /import { cn } from "@/shared\/lib";\n/g, "");
replace('src/modules/trips/components/LiveFleetMap.tsx', /\[mapInstance\]/g, "[mapInstance, mapplsClass]");
replace('src/modules/trips/components/map/MapplsSimulatedTrip.tsx', /\[mapInstance, tripId\]/g, "[mapInstance, tripId, mapplsClass]");
replace('src/modules/trips/components/map/SingleTripLiveMap.tsx', /const \[progress, setProgress\] = useState\(0\);/g, "const [, setProgress] = useState(0);");
replace('src/modules/trips/components/map/SingleTripLiveMap.tsx', /let startTime = Date\.now\(\);/g, "const startTime = Date.now();");
replace('src/shared/lib/exportUtils.ts', /\/\/ @ts-expect-error/g, "// @ts-expect-error - no types for jspdf-autotable");

// Removing unused imports which are comma separated inside braces
function removeImport(file, name) {
  let content = fs.readFileSync(file, 'utf8');
  const regex = new RegExp(`\\b${name}\\b,?`, 'g');
  content = content.replace(regex, "");
  // cleanup dangling commas
  content = content.replace(/,\s*,/g, ",");
  content = content.replace(/{\s*,/g, "{");
  content = content.replace(/,\s*}/g, "}");
  fs.writeFileSync(file, content);
}

removeImport('src/app/(app)/trips/page.tsx', 'Button');
removeImport('src/app/(app)/trips/page.tsx', 'PlayCircle');
removeImport('src/app/(app)/trips/page.tsx', 'StopCircle');
replace('src/app/(app)/trips/page.tsx', /const \[isDemoActive, setIsDemoActive\] = useState\(false\);/g, "const [isDemoActive] = useState(false);");
replace('src/app/(app)/trips/page.tsx', /const \[refreshKey, setRefreshKey\] = useState\(0\);/g, "const [, setRefreshKey] = useState(0);");

removeImport('src/app/page.tsx', 'Box');
removeImport('src/app/page.tsx', 'ShieldCheck');
removeImport('src/app/page.tsx', 'Zap');
replace('src/app/page.tsx', /import \{ \} from "lucide-react";\n/g, "");

removeImport('src/modules/drivers/components/DriverRegistry.tsx', 'PageHeader');
replace('src/modules/drivers/components/DriverRegistry.tsx', /import \{ \} from "@/shared\/components\/ui";\n/g, "");

removeImport('src/modules/financial/components/FuelRegistry.tsx', 'PageHeader');
replace('src/modules/financial/components/FuelRegistry.tsx', /import \{ \} from "@/shared\/components\/ui\/PageHeader";\n/g, "");
replace('src/modules/financial/components/FuelRegistry.tsx', /import \{ PageHeader \} from "@/shared\/components\/ui\/PageHeader";\n/g, "");

removeImport('src/modules/fleet/components/OperationsFeed.tsx', 'Sparkles');

removeImport('src/modules/maintenance/components/MaintenanceRegistry.tsx', 'PageHeader');
replace('src/modules/maintenance/components/MaintenanceRegistry.tsx', /import \{ PageHeader \} from "@/shared\/components\/ui\/PageHeader";\n/g, "");

removeImport('src/modules/settings/components/SettingsLayout.tsx', 'useState');
replace('src/modules/settings/components/SettingsLayout.tsx', /import \{ \} from "react";\n/g, "");

replace('src/modules/trips/services/trip-management-service.ts', /const trip = this\.mockData\.trips/g, "const _trip = this.mockData.trips");

replace('src/shared/components/layout/AppShell.tsx', /import \{ cn \} from "@/shared\/lib";\n/g, "");
replace('src/shared/components/layout/AppShell.tsx', /const sidebarWidth = /g, "// const sidebarWidth = ");

replace('src/shared/components/layout/ModuleShell.tsx', /description,\n/g, "");
replace('src/shared/components/layout/ModuleShell.tsx', /description /g, "");

console.log("Done");
