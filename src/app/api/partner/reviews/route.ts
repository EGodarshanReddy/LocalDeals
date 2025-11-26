import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 

/**
 * @swagger
 * /api/partner/reviews:
 *   get:
 *     summary: Get reviews for partner store
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reviews with user info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   rating:
 *                     type: integer
 *                   comment:
 *                     type: string
 *                   user:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Store not found
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== UserType.SELLER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const store = await storage.getPartnerStoreByUserId(user.id);
    if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 });

    const reviews = await storage.getReviewsByPartnerId(store.id);
    const reviewsWithUserInfo = await Promise.all((reviews || []).map(async (r: any) => {
      const u = await storage.getUserById(r.userId).catch(() => null);
      return { ...r, user: u ? { id: u.id, firstName: u.firstName, lastName: u.lastName } : null };
    }));

    return NextResponse.json(reviewsWithUserInfo);
  } catch (err) {
    console.error('partner/reviews GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch reviews' }, { status: 500 });
  }
}
