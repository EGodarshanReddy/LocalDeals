import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 

/**
 * @swagger
 * /api/partner/visits/{id}/complete:
 *   post:
 *     summary: Mark visit as completed by partner
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Visit ID
 *     responses:
 *       200:
 *         description: Visit marked as completed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Visit or store not found
 */
export async function POST(_req: NextRequest, { params }: { params: any }) {
  try {
    const user = await getUserFromRequest(_req);
    if (!user || user.role !== UserType.SELLER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const visitId = Number(resolvedParams.id);
  const visit = await storage.getVisitById(visitId);
  if (!visit) return NextResponse.json({ success: false, message: 'Visit not found' }, { status: 404 });

  const store = await storage.getPartnerStoreByUserId(user.id);
  if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 });
  if (visit.partnerId !== store.id) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

    const completed = await storage.markVisitAsCompleted(visitId);
    return NextResponse.json({ success: true, message: 'Visit marked as completed', visit: completed });
  } catch (err) {
    console.error('partner/visits/[id]/complete POST error', err);
    return NextResponse.json({ success: false, message: 'Failed to update visit' }, { status: 500 });
  }
}
