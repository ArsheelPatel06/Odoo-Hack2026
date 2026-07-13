import { Driver, Expense, FuelLog, MaintenanceLog, Trip, Vehicle } from "@/shared/domain/models";
import { DriverStatus, ExpenseType, LicenseCategory, MaintenancePriority, MaintenanceStatus, MaintenanceType, TripStatus, VehicleStatus, VehicleType } from "@/shared/domain/enums";

// Utility for realistic timestamps
const pastDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateId = (prefix: string, id: number) => `${prefix}_${id.toString().padStart(3, '0')}`;

const indianNames = [
  "Asha Verma", "Rahul Mehta", "Priya Nair", "Imran Khan", "Neha Desai",
  "Arjun Singh", "Kavita Rao", "Sanjay Patel", "Anjali Gupta", "Vikram Sharma",
  "Ramesh Kumar", "Suresh Yadav", "Sunita Reddy", "Deepak Joshi", "Rakesh Tiwari",
  "Kiran Bedi", "Rajesh Khanna", "Amitabh Bachchan", "Ravi Shastri", "Gautam Gambhir"
];

const indianLocations = [
  "Mumbai Hub", "Pune Depot", "Delhi NCR Terminal", "Bangalore Station", "Chennai Port",
  "Hyderabad Logistics", "Ahmedabad Branch", "Surat Facility", "Jaipur Depot", "Lucknow Hub"
];

export function generateSeedData() {
  const vehicles: Vehicle[] = [];
  const drivers: Driver[] = [];
  const trips: Trip[] = [];
  const fuelLogs: FuelLog[] = [];
  const expenses: Expense[] = [];
  const maintenanceLogs: MaintenanceLog[] = [];

  // Generate 25 Vehicles
  for (let i = 1; i <= 25; i++) {
    vehicles.push({
      id: generateId("vehicle", i),
      registrationNumber: `MH-${randomInt(10, 49)}-${randomElement(['AB', 'CD', 'EF', 'GH'])}-${randomInt(1000, 9999)}`,
      name: `Transit Truck ${randomElement(['Alpha', 'Beta', 'Gamma', 'Delta'])} ${i}`,
      type: randomElement([VehicleType.Truck, VehicleType.Van]),
      status: randomElement([VehicleStatus.Available, VehicleStatus.Available, VehicleStatus.InShop, VehicleStatus.OnTrip]),
      capacity: randomInt(1000, 10000),
      odometerReading: randomInt(5000, 150000),
      acquisitionCost: randomInt(800000, 2500000),
      isArchived: false,
      documentCount: randomInt(0, 5),
      createdAt: pastDays(randomInt(30, 365)),
      updatedAt: pastDays(randomInt(1, 30)),
    });
  }

  // Generate 25 Drivers
  for (let i = 1; i <= 25; i++) {
    drivers.push({
      id: generateId("driver", i),
      name: indianNames[i - 1] || `Driver ${i}`,
      email: `${(indianNames[i - 1] || `driver${i}`).toLowerCase().replace(' ', '.')}@transitops.com`,
      phone: `+91-9${randomInt(100000000, 999999999)}`,
      licenseNumber: `DL-${randomInt(10, 99)}-20${randomInt(10, 26)}-${randomInt(1000, 9999)}`,
      licenseCategory: randomElement([LicenseCategory.HMV, LicenseCategory.LMV]),
      licenseExpiresAt: pastDays(-randomInt(100, 1000)), // Future date
      safetyScore: randomInt(60, 100),
      status: randomElement([DriverStatus.Available, DriverStatus.Available, DriverStatus.OffDuty, DriverStatus.OnTrip]),
      isArchived: false,
      documentCount: randomInt(0, 4),
      kycStatus: randomElement(["VERIFIED", "VERIFIED", "PENDING"]),
      createdAt: pastDays(randomInt(30, 365)),
      updatedAt: pastDays(randomInt(1, 30)),
    });
  }

  // Generate 60 Trips
  for (let i = 1; i <= 60; i++) {
    const isCompleted = Math.random() > 0.4; // 60% completed trips (reduced from 70%)
    const vehicle = randomElement(vehicles);
    const driver = randomElement(drivers);
    
    let status: TripStatus;
    if (isCompleted) {
      status = TripStatus.Completed;
    } else {
      status = randomElement([TripStatus.Dispatched, TripStatus.InTransit, TripStatus.Draft]);
    }

    // Adjust statuses if the trip is active
    if (!isCompleted && status !== TripStatus.Draft) {
      vehicle.status = VehicleStatus.OnTrip;
      driver.status = DriverStatus.OnTrip;
    }

    const plannedDistance = randomInt(50, 800);
    const tripRevenue = randomInt(5000, 30000); // 5k to 30k INR revenue

    const trip: Trip = {
      id: generateId("trip", i),
      tripNumber: `TRP-${randomInt(1000, 9999)}`,
      status,
      origin: randomElement(indianLocations),
      destination: randomElement(indianLocations),
      cargoWeight: randomInt(500, vehicle.capacity),
      plannedDistance,
      vehicleId: vehicle.id,
      driverId: driver.id,
      scheduledStartAt: pastDays(randomInt(1, 100)),
      scheduledEndAt: pastDays(randomInt(0, 99)),
      createdAt: pastDays(randomInt(1, 100)),
      updatedAt: pastDays(randomInt(0, 10)),
      
      // Financials only if completed
      finalOdometer: isCompleted ? vehicle.odometerReading + plannedDistance : undefined,
      fuelConsumed: isCompleted ? Math.floor(plannedDistance / 5) : undefined, // 5kmpl
      revenue: isCompleted ? tripRevenue : undefined,
    };
    
    trips.push(trip);

    if (isCompleted) {
      // Add Expense
      expenses.push({
        id: generateId("expense", i),
        expenseNumber: `EXP-${randomInt(1000, 9999)}`,
        type: ExpenseType.Toll,
        amount: randomInt(200, 1500),
        description: "Highway toll & miscellaneous",
        tripId: trip.id,
        vehicleId: vehicle.id,
        incurredAt: trip.updatedAt,
        placeholders: {
          receipt: "Receipt placeholder",
          invoiceUpload: "Invoice upload placeholder",
          receiptOcr: "Receipt OCR placeholder",
          fuelCard: "Fuel card placeholder",
          vendor: "Vendor placeholder",
          tax: "Tax placeholder",
          gst: "GST placeholder"
        },
        createdAt: trip.updatedAt,
        updatedAt: trip.updatedAt,
      });

      // Add Fuel Log
      fuelLogs.push({
        id: generateId("fuel", i),
        fuelLogNumber: `FUEL-${randomInt(1000, 9999)}`,
        vehicleId: vehicle.id,
        tripId: trip.id,
        fuelQuantity: trip.fuelConsumed || randomInt(20, 100),
        fuelCost: (trip.fuelConsumed || randomInt(20, 100)) * randomInt(90, 100), // ~90-100 INR/liter
        odometerReading: trip.finalOdometer || vehicle.odometerReading,
        fuelStation: "HP Petrol Pump",
        notes: "En-route refill",
        loggedAt: trip.updatedAt,
        placeholders: {
          invoiceUpload: "Invoice upload placeholder",
          receiptOcr: "Receipt OCR placeholder",
          fuelCard: "Fuel card placeholder",
          vendor: "Vendor placeholder",
          tax: "Tax placeholder",
          gst: "GST placeholder"
        },
        createdAt: trip.updatedAt,
        updatedAt: trip.updatedAt,
      });
    }
  }

  // Generate a few maintenance logs
  for (let i = 1; i <= 15; i++) {
    maintenanceLogs.push({
      id: generateId("maintenance", i),
      maintenanceNumber: `MNT-${randomInt(1000, 9999)}`,
      vehicleId: randomElement(vehicles).id,
      status: randomElement([MaintenanceStatus.Active, MaintenanceStatus.Completed]),
      title: "Routine Service",
      description: "Oil change and brake inspection",
      maintenanceType: MaintenanceType.GeneralService,
      priority: MaintenancePriority.Medium,
      assignedTechnician: "Ravi Sharma",
      estimatedCost: randomInt(3000, 15000),
      expectedCompletionAt: pastDays(randomInt(-5, 5)),
      openedAt: pastDays(randomInt(0, 10)),
      createdAt: pastDays(randomInt(0, 10)),
      updatedAt: pastDays(randomInt(0, 10)),
    });
  }

  return {
    vehicles,
    drivers,
    trips,
    fuelLogs,
    expenses,
    maintenanceLogs
  };
}
