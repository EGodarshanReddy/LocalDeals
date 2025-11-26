import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';

/**
 * @swagger
 * /api/consumer/stores/{id}:
 *   get:
 *     summary: Get store by ID
 *     tags: [Consumer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store details with deals and reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 store:
 *                   type: object
 *                 deals:
 *                   type: array
 *                 reviews:
 *                   type: array
 *       404:
 *         description: Store not found
 */
export async function GET(_req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const storeId = Number(resolvedParams.id);
    const store = await storage.getPartnerStoreById(storeId);
    if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 });

    await storage.incrementStoreViews(storeId).catch(() => {});

    const deals = await storage.getDealsByPartnerId(storeId).catch(() => []);
    const activeDeals = (deals || []).filter((d: any) => d.isActive);
    const reviews = await storage.getReviewsByPartnerId(storeId).catch(() => []);

    return NextResponse.json({ store, deals: activeDeals, reviews });
  } catch (err) {
    console.error('consumer/stores/[id] GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch store details' }, { status: 500 });
  }
}
