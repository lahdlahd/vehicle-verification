import { createClient, chains } from "genlayer-js";

const client = createClient({
  chain: chains.localnet,
  endpoint: process.env.GENLAYER_RPC_URL || "https://studio.genlayer.com/api",
});

const CONTRACT_ADDRESS = process.env.GENLAYER_CONTRACT_ADDRESS as `0x${string}`;

export interface VehicleRecord {
  vin: string;
  status: string;
  description: string;
  hash: string;
  verified: boolean;
}

export async function getVehicleFromChain(vin: string): Promise<VehicleRecord | null> {
  try {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_vehicle",
      args: [vin],
    });
    if (!result) return null;
    const parsed = typeof result === "string" ? JSON.parse(result) : result;
    return parsed as VehicleRecord;
  } catch {
    return null;
  }
}

export async function verifyVehicleOnChain(vin: string): Promise<boolean> {
  try {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "verify_vehicle",
      args: [vin],
    });
    return result === true;
  } catch {
    return false;
  }
}

export async function vehicleExistsOnChain(vin: string): Promise<boolean> {
  try {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "vehicle_exists",
      args: [vin],
    });
    return result === true;
  } catch {
    return false;
  }
}