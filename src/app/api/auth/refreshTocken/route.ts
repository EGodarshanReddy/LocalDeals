import { NextRequest } from 'next/server';
import { JWTService } from '@/utils/jwt.service';
import ResponseBuilder from '@/shared/common/Helpers';
import { StatusCode } from '@/shared/constants/common';

/**
 * @swagger
 * /api/auth/refreshTocken:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthTokens'
 *       400:
 *         description: Refresh token missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(req: NextRequest) {
    try {
        const { refreshToken } = await req.json();
        // Validate the refresh token
        if (!refreshToken) {
            return ResponseBuilder.failure('Refresh token missing', StatusCode.BADREQUEST);
        }
        // Verify refresh token
        const decoded = JWTService.verifyRefreshToken(refreshToken);
        // If token is invalid or expired
        if (!decoded || decoded instanceof ResponseBuilder) {
            return ResponseBuilder.failure('Invalid refresh token', StatusCode.UNAUTHORIZED);
        }
        // Generate new tokens
        const newTokens = JWTService.generateAuthTokens(decoded.userId, decoded.email, decoded.role);
        return ResponseBuilder.success('Token refreshed', StatusCode.OK, newTokens);

    } catch (error) {
        console.error('Error in refresh token:', error);
        return ResponseBuilder.failure('Something went wrong', StatusCode.INTERNALSERVERERROR, error);
    }
}
