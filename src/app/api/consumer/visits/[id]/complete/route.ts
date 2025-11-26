import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 

/**
 * @swagger
 * /api/consumer/visits/{id}/complete:
 *   post:
 *     summary: Mark visit as completed
 *     tags: [Consumer]
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
 *         description: Forbidden - Visit does not belong to user
 *       404:
 *         description: Visit not found
 */
export async function POST(_req: NextRequest, { params }: { params: any }) {
  try {
    const user = await getUserFromRequest(_req);
    if (!user || user.role !== UserType.BUYER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const visitId = Number(resolvedParams.id);
    const visit = await storage.getVisitById(visitId);
    if (!visit) return NextResponse.json({ success: false, message: 'Visit not found' }, { status: 404 });
    if (visit.userId !== user.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });

    const updated = await storage.markVisitAsCompleted(visitId);
    await storage.createReward({ userId: user.id, points: 100, reason: 'Completed store visit', referenceId: visitId }).catch(() => {});

    return NextResponse.json({ success: true, message: 'Visit marked as completed', visit: updated });
  } catch (err) {
    console.error('consumer/visits/[id]/complete POST error', err);
    return NextResponse.json({ success: false, message: 'Failed to mark visit completed' }, { status: 500 });
  }
}
