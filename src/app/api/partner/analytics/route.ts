import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 

/**
 * @swagger
 * /api/partner/analytics:
 *   get:
 *     summary: Get partner analytics for last 7 days
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data with stats and totals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totals:
 *                   type: object
 *                   properties:
 *                     storeViews:
 *                       type: number
 *                     dealViews:
 *                       type: number
 *                     scheduledVisits:
 *                       type: number
 *                     actualVisits:
 *                       type: number
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

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const stats = await storage.getPartnerStatsByDateRange(store.id, startDate, endDate);
    const totalStoreViews = (stats || []).reduce((t: any, s: any) => t + (s.storeViews ?? 0), 0);
    const totalDealViews = (stats || []).reduce((t: any, s: any) => t + (s.dealViews ?? 0), 0);
    const totalScheduledVisits = (stats || []).reduce((t: any, s: any) => t + (s.scheduledVisits ?? 0), 0);
    const totalActualVisits = (stats || []).reduce((t: any, s: any) => t + (s.actualVisits ?? 0), 0);

    return NextResponse.json({ stats, totals: { storeViews: totalStoreViews, dealViews: totalDealViews, scheduledVisits: totalScheduledVisits, actualVisits: totalActualVisits } });
  } catch (err) {
    console.error('partner/analytics GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch analytics' }, { status: 500 });
  }
}
