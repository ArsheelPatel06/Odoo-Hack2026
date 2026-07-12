export enum MaintenanceType {
  OilChange = "Oil Change",
  EngineRepair = "Engine Repair",
  BrakeService = "Brake Service",
  TyreReplacement = "Tyre Replacement",
  Inspection = "Inspection",
  Electrical = "Electrical",
  GeneralService = "General Service",
  Other = "Other"
}

export enum MaintenancePriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical"
}

export enum LicenseCategory {
  LMV = "LMV",
  HMV = "HMV",
  Transport = "Transport",
  Commercial = "Commercial",
  Other = "Other"
}

export enum VehicleType {
  Truck = "Truck",
  Van = "Van",
  MiniTruck = "Mini Truck",
  Trailer = "Trailer",
  Other = "Other"
}

export enum ExpenseType {
  Fuel = "Fuel",
  Maintenance = "Maintenance",
  Toll = "Toll",
  Misc = "Misc"
}

export enum UserRole {
  FleetManager = "FleetManager",
  Dispatcher = "Dispatcher",
  SafetyOfficer = "SafetyOfficer",
  FinancialAnalyst = "FinancialAnalyst"
}
