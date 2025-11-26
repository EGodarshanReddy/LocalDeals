import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthResponse, SetPasswordRequest } from '@/dto/authDTOs';
import ResponseBuilder from '@/shared/common/Helpers';
import { StatusCode } from '@/shared/constants/common';

/**
 * @swagger
 * /api/auth/setPassword:
 *   post:
 *     summary: Set user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password set successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Email and password are required or user does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to set password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(req: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body: SetPasswordRequest = await req.json();
    const { email, password } = body;
    if (!email || !password) {      
      return ResponseBuilder.failure('Email and password are required', StatusCode.BADREQUEST);
    }
    // Check if user already exists. Use findFirst since email may not be marked unique in Prisma types.
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    if (!existingUser) {      
      return ResponseBuilder.failure('User with this email does not exist', StatusCode.BADREQUEST);
    }
    // Create the user after successful OTP verification
    const hashedPassword = await bcrypt.hash(password, 10);
    const setPassword = await prisma.user.update({
        where: { email },
      data: {
        email,
        password: hashedPassword,
        isVerified: true
      } as any,
      select: {
        id: true,
        email: true
      },
    });
    if(!setPassword){
      return ResponseBuilder.failure('Failed to set password', StatusCode.INTERNALSERVERERROR);
    }
    return ResponseBuilder.success('Password set successfully', StatusCode.OK);    
  } catch (error) {
    console.error('Error in verify OTP:', error);
    return ResponseBuilder.failure('Failed to set password', StatusCode.INTERNALSERVERERROR);
  } 
}