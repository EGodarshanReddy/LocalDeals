import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';

/**
 * @swagger
 * /api/consumer/deals/{id}:
 *   get:
 *     summary: Get deal by ID
 *     tags: [Consumer]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deal:
 *                   type: object
 *                 store:
 *                   type: object
 *       404:
 *         description: Deal not found
 */
export async function GET(_req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const dealId = Number(resolvedParams.id);
    const deal = await storage.getDealById(dealId);
    if (!deal) return NextResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });

    await storage.incrementDealViews(deal.partnerId).catch(() => {});
    const store = await storage.getPartnerStoreById(deal.partnerId).catch(() => null);

    return NextResponse.json({ deal, store });
  } catch (err) {
    console.error('consumer/deals/[id] GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch deal details' }, { status: 500 });
  }
}
