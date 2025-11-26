import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 

/**
 * @swagger
 * /api/partner/visits:
 *   get:
 *     summary: Get scheduled visits for partner
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of scheduled visits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
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

    const visits = await storage.getScheduledVisitsByPartnerId(store.id);
    const visitsWithUserInfo = await Promise.all((visits || []).map(async (visit: any) => {
      const u = await storage.getUserById(visit.userId).catch(() => null);
      let dealInfo = null;
      if (visit.dealId) {
        const deal = await storage.getDealById(visit.dealId).catch(() => null);
        if (deal) dealInfo = { id: deal.id, name: deal.name };
      }
      return { ...visit, user: u ? { id: u.id, firstName: u.firstName, lastName: u.lastName, phone: u.phone } : null, deal: dealInfo };
    }));

    return NextResponse.json(visitsWithUserInfo);
  } catch (err) {
    console.error('partner/visits GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch scheduled visits' }, { status: 500 });
  }
}
