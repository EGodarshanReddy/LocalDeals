import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';

/**
 * @swagger
 * /api/consumer/deals:
 *   get:
 *     summary: Get active deals
 *     tags: [Consumer]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of active deals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const category = url.searchParams.get('category');

    let deals;
    if (category) {
      // category specific filtering may be implemented in storage
      deals = await storage.getDealsByCategory?.(category) || await storage.getActiveDeals();
    } else if (query) {
      deals = await storage.searchDeals(query);
    } else {
      deals = await storage.getActiveDeals();
    }

    const dealsWithStoreInfo = await Promise.all((deals || []).map(async (deal: any) => {
      const store = await storage.getPartnerStoreById(deal.partnerId).catch(() => null);
      return { ...deal, store: store ? { id: store.id, name: store.name, categories: store.categories, priceRating: store.priceRating, location: store.location, latitude: store.latitude, longitude: store.longitude } : null };
    }));

    return NextResponse.json(dealsWithStoreInfo);
  } catch (err) {
    console.error('consumer/deals GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch deals' }, { status: 500 });
  }
}
