import { NextRequest, NextResponse } from 'next/server';
import { AuthResponse } from '@/dto/authDTOs';
import ResponseBuilder from '@/shared/common/Helpers';
import { StatusCode } from '@/shared/constants/common';
import { sendOTPSchema } from '@/validators/auth.validator';
import { AuthService } from '@/services/auth.service';

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to user email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, role]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               role:
 *                 type: string
 *                 enum: [ADMIN, BUYER, SELLER, VISITOR]
 *                 example: BUYER
 *     responses:
 *       201:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation failed or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to send OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(req: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    // Parse request body
    const SendOTPRequest = await req.json();

    // Validate request body with Zod (Controller Layer - Input Validation)
    const validationResult = sendOTPSchema.safeParse(SendOTPRequest);

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

    const { email, role } = SendOTPRequest;

    // Call service layer for business logic
    const result = await AuthService.sendOTP(email, role);

    if (!result.success) {
      return ResponseBuilder.failure(result.message, StatusCode.INTERNALSERVERERROR);
    }

    // Return success response (Controller Layer - Output)
    return ResponseBuilder.success(result.message, StatusCode.CREATED);
  } catch (error) {
    console.error('Error in send OTP controller:', error);
    return ResponseBuilder.failure('Failed to send OTP', StatusCode.INTERNALSERVERERROR);
  }
}
