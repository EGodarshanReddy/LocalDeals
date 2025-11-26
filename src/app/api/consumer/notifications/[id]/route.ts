import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';


/**
 * @swagger
 * /api/consumer/notifications/{id}:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
export async function PATCH(_req: NextRequest, { params }: { params: any }) {
  try {
    const user = await getUserFromRequest(_req);
    if (!user || user.role !== UserType.BUYER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const notificationId = Number(resolvedParams.id);
    const updated = await storage.markNotificationAsRead(notificationId);
    if (!updated) return NextResponse.json({ success: false, message: 'Notification not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Notification marked as read', notification: updated });
  } catch (err) {
    console.error('consumer/notifications/[id] PATCH error', err);
    return NextResponse.json({ success: false, message: 'Failed to update notification' }, { status: 500 });
  }
}
