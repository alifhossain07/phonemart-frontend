import { NextRequest } from "next/server";

/**
 * Extracts the Bearer token from the Authorization header of a Next.js request
 * @param request - Next.js request object
 * @returns The Bearer token string, or null if not found
 */
export function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7); // Remove "Bearer " prefix
}

