import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { UserType } from '@prisma/client';

/**
 * @swagger
 * /api/consumer/referrals:
 *   post:
 *     summary: Create a referral
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [referredPhone]
 *             properties:
 *               referredPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Referral created successfully
 *       400:
 *         description: Phone already registered
 *       401:
 *         description: Unauthorized
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== UserType.BUYER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const referralData = { ...body, referrerId: user.id };

    const existing = await storage.getUserByPhone(referralData.referredPhone).catch(() => null);
    if (existing) return NextResponse.json({ success: false, message: 'This phone is already registered' }, { status: 400 });

    const referral = await storage.createReferral(referralData);
    return NextResponse.json({ success: true, message: 'Referral created', referral }, { status: 201 });
  } catch (err) {
    console.error('consumer/referrals POST error', err);
    return NextResponse.json({ success: false, message: 'Failed to create referral' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/consumer/referrals:
 *   get:
 *     summary: Get user referrals
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of referrals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== UserType.BUYER) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const referrals = await storage.getReferralsByReferrerId(user.id);
    return NextResponse.json(referrals);
  } catch (err) {
    console.error('consumer/referrals GET error', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch referrals' }, { status: 500 });
  }
}
