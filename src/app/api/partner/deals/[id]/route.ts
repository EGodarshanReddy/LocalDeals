import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 

/**
 * @swagger
 * /api/partner/deals/{id}:
 *   get:
 *     summary: Get deal by ID
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Deal ID
 *     responses:
 *       200:
 *         description: Deal details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Deal not found
 */
export async function GET(_req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const dealId = Number(resolvedParams.id);
    const deal = await storage.getDealById(dealId);
    if (!deal) return NextResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });

    const user = await getUserFromRequest(_req);
    if (!user || user.role !== UserType.SELLER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const store = await storage.getPartnerStoreByUserId(user.id);
    if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 });

    if (deal.partnerId !== store.id) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    return NextResponse.json(deal);
  } catch (err) {
    console.error('partner/deals/[id] GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch deal' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/partner/deals/{id}:
 *   patch:
 *     summary: Update deal
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Deal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Deal updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Deal not found
 */
export async function PATCH(_req: NextRequest, { params }: { params: any }) {
  try {
    const user = await getUserFromRequest(_req);
    if (!user || user.role !== UserType.SELLER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const dealId = Number(resolvedParams.id);
    const deal = await storage.getDealById(dealId);
    if (!deal) return NextResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });

    const store = await storage.getPartnerStoreByUserId(user.id);
    if (!store || deal.partnerId !== store.id) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

    const body = await _req.json();
    const updated = await storage.updateDeal(dealId, body);
    return NextResponse.json({ success: true, message: 'Deal updated', deal: updated });
  } catch (err) {
    console.error('partner/deals/[id] PATCH error', err);
    return NextResponse.json({ success: false, message: 'Failed to update deal' }, { status: 500 });
  }
}
