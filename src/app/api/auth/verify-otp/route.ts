import { NextRequest, NextResponse } from 'next/server';
import { AuthResponse, AuthTokens } from '@/dto/authDTOs';
import ResponseBuilder from '@/shared/common/Helpers';
import { StatusCode } from '@/shared/constants/common';
import { verifyOTPSchema } from '@/validators/auth.validator';
import { AuthService } from '@/services/auth.service';
import { JWTService } from '@/utils/jwt.service';

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and get authentication tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 pattern: '^[0-9]{6}$'
 *                 example: '123456'
 *               role:
 *                 type: string
 *                 enum: [ADMIN, BUYER, SELLER, VISITOR]
 *                 example: BUYER
 *                 description: Optional role filter for verification
 *     responses:
 *       200:
 *         description: OTP verified successfully, returns access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully
 *                 data:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       400:
 *         description: Validation failed, invalid OTP, or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to verify OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(req: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    // Parse request body
    const body = await req.json();

    // Validate request body with Zod (Controller Layer - Input Validation)
    const validationResult = verifyOTPSchema.safeParse(body);

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

    const { email, otp, role } = validationResult.data;

    // Call service layer for business logic
    const result = await AuthService.verifyOTP(email, otp, role);

    if (!result.success || !result.user) {
      return ResponseBuilder.failure(result.message, StatusCode.BADREQUEST);
    }

    // Generate JWT tokens
    const tokens: AuthTokens = JWTService.generateAuthTokens(
      result.user.id,
      result.user.email,
      result.user.role
    );

    // Return success response with tokens (Controller Layer - Output)
    return ResponseBuilder.success(result.message, StatusCode.OK, tokens);
  } catch (error) {
    console.error('Error in verify OTP controller:', error);
    return ResponseBuilder.failure('Failed to verify OTP', StatusCode.INTERNALSERVERERROR);
  }
}

