import { NextRequest, NextResponse } from 'next/server';
import { userTypes } from '@/lib/constants';

/**
 * @swagger
 * /api/user-types:
 *   get:
 *     summary: Get user types
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of user types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
export async function GET(_req: NextRequest) {
  return NextResponse.json(userTypes);
}
