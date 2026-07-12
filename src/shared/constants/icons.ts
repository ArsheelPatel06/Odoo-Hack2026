import {
  BarChart3,
  Car,
  CircleDollarSign,
  Fuel,
  Gauge,
  Settings,
  ShieldCheck,
  Truck,
  UserRound,
  Wrench
} from "lucide-react";

export const icons = {
  analytics: BarChart3,
  dashboard: Gauge,
  drivers: UserRound,
  expenses: CircleDollarSign,
  fleet: Truck,
  fuel: Fuel,
  maintenance: Wrench,
  settings: Settings,
  safety: ShieldCheck,
  trips: Car
} as const;
