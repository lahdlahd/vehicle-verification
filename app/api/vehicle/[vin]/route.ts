import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const vehicle = await prisma.vehicle.findUnique({ where: { vin } });

    if (!vehicle) {
      return NextResponse.json(
        { error: "No record found for this VIN." },
        { status: 404 }
      );
    }

    return NextResponse.json({ vehicle }, { status: 200 });
  } catch (error) {
    console.error("VIN lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}