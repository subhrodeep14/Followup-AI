import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined.");
}

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
}

interface TokenPayload extends JwtPayload {
  userId: string;
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET as string) as TokenPayload;
}