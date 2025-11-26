import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';
import { StatusCode } from '@/shared/constants/common';
import ResponseBuilder from '@/shared/common/Helpers';
import { createRedemptionSchema } from '@/validators/redeem.validator';
import { RedemptionService } from '@/services/redemption.service';

/**
 * @swagger
 * /api/consumer/redeem:
 *   post:
 *     summary: Redeem reward points
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [partnerId, points, amount, code]
 *             properties:
 *               partnerId:
 *                 type: integer
 *               points:
 *                 type: integer
 *                 minimum: 500
 *                 maximum: 5000
 *               amount:
 *                 type: integer
 *               proofImageUrl:
 *                 type: string
 *                 format: uri
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Redemption successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation failed or not enough points
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== UserType.BUYER) {
      return ResponseBuilder.failure('Unauthorized', StatusCode.UNAUTHORIZED);
    }

    const body = await req.json();
    
    // Validate request body with Zod
    const validationResult = createRedemptionSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((issue) => {
        const field = issue.path.length > 0 ? issue.path.join('.') : 'root';
        return `${field}: ${issue.message}`;
      });
      return ResponseBuilder.failure(
        'Validation failed: ' + errorMessages.join(', '),
        StatusCode.BADREQUEST
      );
    }

    const redemptionData = {
      ...validationResult.data,
      userId: user.id,
      proofImageUrl: validationResult.data.proofImageUrl ?? undefined
    };

    // Create redemption using service layer
    const redemption = await RedemptionService.createRedemption(redemptionData);
    
    return ResponseBuilder.success('Redemption successful', StatusCode.CREATED, redemption);
  } catch (err: any) {
    console.error('consumer/redeem POST error', err);
    
    // Handle business logic errors
    if (err.message) {
      return ResponseBuilder.failure(err.message, StatusCode.BADREQUEST);
    }
    
    return ResponseBuilder.failure('Failed to process redemption', StatusCode.INTERNALSERVERERROR);
  }
}
