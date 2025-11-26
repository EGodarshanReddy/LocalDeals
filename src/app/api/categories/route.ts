import { NextRequest, NextResponse } from 'next/server';
import { businessCategories } from '@/lib/constants';

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get business categories
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of business categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
export async function GET(_req: NextRequest) {
  return NextResponse.json(businessCategories);
}
