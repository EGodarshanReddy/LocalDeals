import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 

/**
 * @swagger
 * /api/partner/redemptions:
 *   get:
 *     summary: Get redemptions for partner store
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of redemptions with user info and total due amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 redemptions:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalDueAmount:
 *                   type: number
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

    const redemptions = await storage.getRedemptionsByPartnerId(store.id);
    const redemptionsWithUserInfo = await Promise.all((redemptions || []).map(async (r: any) => {
      const u = await storage.getUserById(r.userId).catch(() => null);
      return { ...r, user: u ? { id: u.id, firstName: u.firstName, lastName: u.lastName } : null };
    }));

    const pending = (redemptionsWithUserInfo || []).filter((r: any) => r.status === 'pending');
    const totalDueAmount = pending.reduce((t: number, r: any) => t + (r.amount ?? 0), 0);

    return NextResponse.json({ redemptions: redemptionsWithUserInfo, totalDueAmount });
  } catch (err) {
    console.error('partner/redemptions GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch redemptions' }, { status: 500 });
  }
}
