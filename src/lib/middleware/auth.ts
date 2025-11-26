import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { JWTService } from '@/utils/jwt.service';
import ResponseBuilder from '@/shared/common/Helpers';

/**
 * Extracts user from Authorization header (Bearer token).
 * Returns the Prisma User object or null if not authenticated.
 */
export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  const payload = JWTService.verifyToken(token);
  if (payload instanceof ResponseBuilder) return null;

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user;
}

/**
 * Helper that returns a NextResponse 401 when the request is not authenticated.
 * Use this inside route handlers when you want to gate access.
 */
export async function requireAuth(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  return user;
}

/**
 * Higher-order wrapper for Next.js route handlers.
 * Usage:
 *   export const POST = withAuth(async (req, user) => { ... });
 */
export function withAuth(handler: (req: NextRequest, user: any) => Promise<Response | import('next/server').NextResponse | any>) {
  return async (req: NextRequest) => {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    return handler(req, user);
  };
}

export default { getUserFromRequest, requireAuth, withAuth };
