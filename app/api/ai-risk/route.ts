import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVehicleHash, verifyVehicleHash } from "@/lib/hash";
import { getVehicleFromChain, verifyVehicleOnChain } from "@/lib/genlayer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vin: string }> }
) {
  const { vin: rawVin } = await params;
  const vin = rawVin.toUpperCase().trim();

  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return NextResponse.json(
      { error: "Invalid VIN format. VINs must be 17 alphanumeric characters." },
      { status: 400 }
    );
  }

  try {
    // ── Try GenLayer first ──────────────────────────────
    if (process.env.GENLAYER_CONTRACT_ADDRESS) {
      console.log("Trying GenLayer contract:", process.env.GENLAYER_CONTRACT_ADDRESS);
      try {
        const chainVehicle = await getVehicleFromChain(vin);
        console.log("GenLayer result:", chainVehicle);

        if (chainVehicle) {
          const isVerified = await verifyVehicleOnChain(vin);
          return NextResponse.json({
            vehicle: {
              ...chainVehicle,
              id: vin,
              createdAt: new Date().toISOString(),
              source: "genlayer",
            },
            isVerified,
            source: "genlayer",
          }, { status: 200 });
        }
      } catch (e) {
        console.error("GenLayer error:", e);
      }
    }

    // ── Fall back to Prisma DB ──────────────────────────
    console.log("Falling back to Prisma DB");
    const vehicle = await prisma.vehicle.findUnique({ where: { vin } });

    if (!vehicle) {
      return NextResponse.json(
        { error: "No record found for this VIN." },
        { status: 404 }
      );
    }

    let hash = vehicle.hash;
    if (!hash) {
      hash = generateVehicleHash(
        vehicle.vin,
        vehicle.status,
        vehicle.description,
        vehicle.createdAt
      );
      await prisma.vehicle.update({
        where: { vin },
        data: { hash },
      });
    }

    const isVerified = verifyVehicleHash(
      vehicle.vin,
      vehicle.status,
      vehicle.description,
      vehicle.createdAt,
      hash
    );

    return NextResponse.json({
      vehicle: { ...vehicle, hash },
      isVerified,
      source: "database",
    }, { status: 200 });

  } catch (error) {
    console.error("VIN lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}