import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully (client should delete token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out (client should delete token/cookie)
 */
export async function POST(_req: NextRequest) {
  // On JWT-based flows, client should simply delete token. If you use server
  // sessions, implement cookie/session clearing here.
  return NextResponse.json({ success: true, message: 'Logged out (client should delete token/cookie)' });
}
