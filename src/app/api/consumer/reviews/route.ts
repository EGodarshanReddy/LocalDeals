import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 

/**
 * @swagger
 * /api/consumer/reviews:
 *   post:
 *     summary: Submit a review
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [partnerId, rating]
 *             properties:
 *               partnerId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       401:
 *         description: Unauthorized
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== UserType.BUYER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const reviewData = { ...body, userId: user.id };
    const review = await storage.createReview(reviewData);
    return NextResponse.json({ success: true, message: 'Review submitted', review }, { status: 201 });
  } catch (err) {
    console.error('consumer/reviews POST error', err);
    return NextResponse.json({ success: false, message: 'Failed to submit review' }, { status: 500 });
  }
}
