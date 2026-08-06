import { SignJWT, jwtVerify } from "jose";

const ADMIN_ISSUER = "patril-admin";
const ADMIN_AUDIENCE = "patril-api";

function getSecret(): Uint8Array | null {
  const secret =
    process.env.ADMIN_JWT_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim();
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(): Promise<string | null> {
  const secret = getSecret();
  if (!secret || !process.env.ADMIN_PASSWORD) return null;

  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ADMIN_ISSUER)
    .setAudience(ADMIN_AUDIENCE)
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;

  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: ADMIN_ISSUER,
      audience: ADMIN_AUDIENCE,
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}
