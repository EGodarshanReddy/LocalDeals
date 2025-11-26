import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client'; 
import { StatusCode } from '@/shared/constants/common';
import ResponseBuilder from '@/shared/common/Helpers';
import { RewardService } from '@/services/reward.service';

/**
 * @swagger
 * /api/consumer/rewards:
 *   get:
 *     summary: Get user rewards and total points
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rewards and total points
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         rewards:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               points:
 *                                 type: integer
 *                               reason:
 *                                 type: string
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                         totalPoints:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== UserType.BUYER) {
      return ResponseBuilder.failure('Unauthorized', StatusCode.UNAUTHORIZED);
    }

    const rewards = await RewardService.getRewardsByUserId(user.id);
    const totalPoints = await RewardService.getTotalPointsByUserId(user.id);
    return ResponseBuilder.success('Rewards fetched successfully', StatusCode.OK, { rewards, totalPoints });
  } catch (err) {
    console.error('consumer/rewards GET error', err);
    return ResponseBuilder.failure('Failed to fetch rewards', StatusCode.INTERNALSERVERERROR);
  }
}
