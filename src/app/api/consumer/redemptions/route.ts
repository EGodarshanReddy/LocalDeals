import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
 
import { StatusCode } from '@/shared/constants/common';
import ResponseBuilder from '@/shared/common/Helpers';
import { RedemptionService } from '@/services/redemption.service';

/**
 * @swagger
 * /api/consumer/redemptions:
 *   get:
 *     summary: Get user redemptions
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of redemptions
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           points:
 *                             type: integer
 *                           amount:
 *                             type: integer
 *                           status:
 *                             type: string
 *                           partner:
 *                             type: object
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== UserType.BUYER) {
      return ResponseBuilder.failure('Unauthorized', StatusCode.UNAUTHORIZED);
    }

    const redemptions = await RedemptionService.getRedemptionsByUserId(user.id);
    return ResponseBuilder.success('Redemptions fetched successfully', StatusCode.OK, redemptions);
  } catch (err) {
    console.error('consumer/redemptions GET error', err);
    return ResponseBuilder.failure('Failed to fetch redemptions', StatusCode.INTERNALSERVERERROR);
  }
}
