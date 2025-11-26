import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { StatusCode } from '@/shared/constants/common';
import ResponseBuilder from '@/shared/common/Helpers';
import { UpdateProfileRequest, updateProfileSchema } from '@/validators/user.validator';

/**
 * @swagger
 * /api/consumer/profile/{id}:
 *   patch:
 *     summary: Update user profile
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 nullable: true
 *               firstName:
 *                 type: string
 *                 nullable: true
 *               lastName:
 *                 type: string
 *                 nullable: true
 *               zipCode:
 *                 type: string
 *                 nullable: true
 *               favoriteCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
export async function PATCH(req: NextRequest) {
  try {
    
    const body: UpdateProfileRequest = await req.json();
    const userId = req.nextUrl.pathname.split('/').pop();
    if (!userId) {
      return ResponseBuilder.failure('User ID is required', StatusCode.BADREQUEST);
    }
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });
    if (!user) {
      return ResponseBuilder.failure('User not found', StatusCode.NOTFOUND);
    }
    // Validate request body with Zod
    const validationResult = updateProfileSchema.safeParse(body);
    
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

    const updateData = validationResult.data;


    // Update user using Prisma
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(updateData.phone !== undefined && { phone: updateData.phone }),
        ...(updateData.firstName !== undefined && { firstName: updateData.firstName }),
        ...(updateData.lastName !== undefined && { lastName: updateData.lastName }),
        ...(updateData.zipCode !== undefined && { zipCode: updateData.zipCode }),
        ...(updateData.favoriteCategories !== undefined && { favoriteCategories: updateData.favoriteCategories }),
      },
      select: {
        id: true,
        phone: true,
        firstName: true,
        lastName: true,
        email: true,
        zipCode: true,
        favoriteCategories: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });

    return ResponseBuilder.success('Profile updated successfully', StatusCode.OK, updated);
  } catch (err) {
    console.error('consumer/profile PATCH error', err);        
    return ResponseBuilder.failure('Failed to update profile', StatusCode.INTERNALSERVERERROR);
  }
}
