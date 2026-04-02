import { createHash } from "crypto";

/**
 * Generates a SHA256 hash for a vehicle record.
 * This simulates blockchain immutability — if any field changes,
 * the hash will no longer match, proving tampering occurred.
 */
export function generateVehicleHash(
  vin: string,
  status: string,
  description: string,
  createdAt: Date
): string {
  const data = `${vin}|${status}|${description}|${createdAt.toISOString()}`;
  return createHash("sha256").update(data).digest("hex");
}

/**
 * Verifies a vehicle record by recomputing and comparing hashes
 */
export function verifyVehicleHash(
  vin: string,
  status: string,
  description: string,
  createdAt: Date,
  storedHash: string
): boolean {
  const computedHash = generateVehicleHash(vin, status, description, createdAt);
  return computedHash === storedHash;
}