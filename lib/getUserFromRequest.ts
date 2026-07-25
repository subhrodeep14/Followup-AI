import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function getUserFromRequest(req: NextRequest): string {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Authorization header missing");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Invalid authorization header");
  }

  const token = authHeader.split(" ")[1];

  const payload = verifyToken(token);

  return payload.userId;
}