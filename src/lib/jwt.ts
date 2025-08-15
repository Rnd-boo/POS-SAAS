import { TextEncoder } from "util";

// Your JWT secret from environment variables
export function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  // jose needs the secret as Uint8Array
  return new TextEncoder().encode(secret);
}
