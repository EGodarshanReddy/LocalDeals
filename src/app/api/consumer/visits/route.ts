import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 

/**
 * @swagger
 * /api/consumer/visits:
 *   post:
 *     summary: Schedule a visit
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [partnerId, visitDate]
 *             properties:
 *               partnerId:
 *                 type: integer
 *               visitDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               dealId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Visit scheduled successfully
 *       401:
 *         description: Unauthorized
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== UserType.BUYER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const visitData = { ...body, userId: user.id };
    const visit = await storage.createVisit(visitData);
    return NextResponse.json({ success: true, message: 'Visit scheduled', visit }, { status: 201 });
  } catch (err) {
    console.error('consumer/visits POST error', err);
    return NextResponse.json({ success: false, message: 'Failed to schedule visit' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/consumer/visits:
 *   get:
 *     summary: Get user visits
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user visits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== UserType.BUYER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const visits = await storage.getVisitsByUserId(user.id);
    const visitsWithStoreInfo = await Promise.all((visits || []).map(async (visit: any) => {
      const store = await storage.getPartnerStoreById(visit.partnerId).catch(() => null);
      let dealInfo = null;
      if (visit.dealId) {
        const deal = await storage.getDealById(visit.dealId).catch(() => null);
        if (deal) dealInfo = { id: deal.id, name: deal.name, dealType: deal.dealType, discountPercentage: deal.discountPercentage };
      }
      return { ...visit, store: store ? { id: store.id, name: store.name, categories: store.categories, location: store.location } : null, deal: dealInfo };
    }));

    return NextResponse.json(visitsWithStoreInfo);
  } catch (err) {
    console.error('consumer/visits GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch visits' }, { status: 500 });
  }
}
