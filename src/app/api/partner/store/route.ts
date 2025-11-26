import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 

/**
 * @swagger
 * /api/partner/store:
 *   get:
 *     summary: Get partner store
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
    return NextResponse.json(store);
  } catch (err) {
    console.error('partner/store GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch store profile' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/partner/store:
 *   patch:
 *     summary: Update partner store
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
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
 *               contactPhone:
 *                 type: string
 *               location:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Store not found
 */
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== UserType.SELLER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const store = await storage.getPartnerStoreByUserId(user.id);
    if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 });

    const body = await req.json();
    const updated = await storage.updatePartnerStore(store.id, body);
    return NextResponse.json({ success: true, message: 'Store updated', store: updated });
  } catch (err) {
    console.error('partner/store PATCH error', err);
    return NextResponse.json({ success: false, message: 'Failed to update store' }, { status: 500 });
  }
}
