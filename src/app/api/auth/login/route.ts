import { NextRequest, NextResponse } from 'next/server';;
import bcrypt from 'bcryptjs';
import { JWTService } from '@/utils/jwt.service';
import { AuthResponse } from '@/dto/authDTOs';
import { StatusCode } from '@/shared/constants/common';
import ResponseBuilder from '@/shared/common/Helpers';
import prisma from '@/lib/prisma';
import { UserType } from '@prisma/client';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
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
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
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
 *         description: Email and password are required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(req: NextRequest): Promise<NextResponse<AuthResponse>> {
    try {
        const { email, password } = await req.json();
        // Validate required fields
        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
        }
        // email may not be a unique field in the Prisma schema; use findFirst to locate by email
        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
        const u: any = user as any;
        const isMatch = await bcrypt.compare(password, u.password || '');
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
        const token = JWTService.generateAuthTokens(user.id, user.email || '', user.role || UserType.VISITOR);
        return ResponseBuilder.success('Login successful', StatusCode.OK, token)
    } catch (error) {
        console.error('Error in login route:', error);
        return NextResponse.json({ success: false, message: 'Failed to login' }, { status: 500 });
    } 
}
