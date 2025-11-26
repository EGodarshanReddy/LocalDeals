import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 

/**
 * @swagger
 * /api/partner/deals/{id}/deactivate:
 *   post:
 *     summary: Deactivate deal
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
 *         description: Deal deactivated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Deal not found
 */
export async function POST(_req: NextRequest, { params }: { params: any }) {
  try {
    const user = await getUserFromRequest(_req);
    if (!user || user.role !== UserType.SELLER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const dealId = Number(resolvedParams.id);
    const deal = await storage.getDealById(dealId);
    if (!deal) return NextResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });

    const store = await storage.getPartnerStoreByUserId(user.id);
    if (!store || deal.partnerId !== store.id) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

    const deactivated = await storage.deactivateDeal(dealId);
    return NextResponse.json({ success: true, message: 'Deal deactivated', deal: deactivated });
  } catch (err) {
    console.error('partner/deals/[id]/deactivate POST error', err);
    return NextResponse.json({ success: false, message: 'Failed to deactivate deal' }, { status: 500 });
  }
}
