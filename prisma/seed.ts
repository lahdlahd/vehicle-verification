// prisma/seed.ts
// Seed script — populates DB with 3 sample vehicles
// Run with: npx prisma db seed

import { PrismaClient, VehicleStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing records
  await prisma.vehicle.deleteMany();

  // 1. Clean vehicle
  await prisma.vehicle.create({
    data: {
      vin: "1HGBH41JXMN109186",
      status: VehicleStatus.clean,
      description:
        "No accidents or damage reported. Single owner. Regular maintenance history on record. Passed all inspections.",
    },
  });

  // 2. Minor damage vehicle
  await prisma.vehicle.create({
    data: {
      vin: "2T1BURHE0JC043821",
      status: VehicleStatus.minor_damage,
      description:
        "Minor rear-end collision reported in 2022. Repaired at certified body shop. No structural damage. Airbags did not deploy.",
    },
  });

  // 3. Write-off vehicle
  await prisma.vehicle.create({
    data: {
      vin: "3VWFE21C04M000001",
      status: VehicleStatus.write_off,
      description:
        "Total loss declared by insurer following severe front-end collision in 2023. Structural frame damage. Vehicle should not be resold for road use.",
    },
  });

  console.log("✅ Seed complete — 3 vehicles added.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
