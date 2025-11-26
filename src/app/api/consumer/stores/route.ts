import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';

/**
 * @swagger
 * /api/consumer/stores:
 *   get:
 *     summary: Get partner stores
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
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude for nearby search
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Longitude for nearby search
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 10
 *         description: Search radius in km
 *     responses:
 *       200:
 *         description: List of partner stores
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
    const query = url.searchParams.get('query') || '';
    const category = url.searchParams.get('category');
    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');
    const radius = url.searchParams.get('radius') ? Number(url.searchParams.get('radius')) : 10;

    let stores;
    if (lat && lng) {
      stores = await storage.getNearbyPartnerStores(Number(lat), Number(lng), radius);
    } else if (category) {
      stores = await storage.getPartnerStoresByCategory?.(category) || [];
    } else if (query) {
      stores = await storage.searchPartnerStores(query);
    } else {
      stores = await storage.searchPartnerStores('');
    }

    return NextResponse.json(stores);
  } catch (err) {
    console.error('consumer/stores GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch stores' }, { status: 500 });
  }
}
