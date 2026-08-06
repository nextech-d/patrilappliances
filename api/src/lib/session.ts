import { getPrisma } from "./db.js";
import type { AuthUser } from "../types.js";

export async function getUserBySessionId(sessionId: string | undefined): Promise<AuthUser | null> {
  if (!sessionId) return null;
  const prisma = getPrisma();
  if (!prisma) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: sessionId } }).catch(() => undefined);
    }
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    phone: session.user.phone,
  };
}

export function extractBearerToken(header: string | undefined): string | null {
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const prisma = getPrisma();
  if (!prisma) return;
  await prisma.session.deleteMany({ where: { id: sessionId } });
}
