import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 
/**
 * @swagger
 * /api/partner/deals:
 *   get:
 *     summary: Get partner deals
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deals
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

    const deals = await storage.getDealsByPartnerId(store.id);
    return NextResponse.json(deals);
  } catch (err) {
    console.error('partner/deals GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch deals' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/partner/deals:
 *   post:
 *     summary: Create a new deal
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, startDate, endDate, dealType, category]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               dealType:
 *                 type: string
 *               discountPercentage:
 *                 type: integer
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Deal created successfully
 *       400:
 *         description: Maximum 3 active deals per category
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Store not found
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== UserType.SELLER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const store = await storage.getPartnerStoreByUserId(user.id);
    if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 });

    const body = await req.json();
    const existingDeals = await storage.getDealsByPartnerId(store.id);
    const activeInCategory = (existingDeals || []).filter((d: any) => d.isActive && d.category === body.category);
    if (activeInCategory.length >= 3) return NextResponse.json({ success: false, message: 'You already have 3 active deals in this category' }, { status: 400 });

    const dealData = { ...body, partnerId: store.id };
    const deal = await storage.createDeal(dealData);
    return NextResponse.json({ success: true, message: 'Deal created', deal }, { status: 201 });
  } catch (err) {
    console.error('partner/deals POST error', err);
    return NextResponse.json({ success: false, message: 'Failed to create deal' }, { status: 500 });
  }
}
