import prisma from '@/lib/prisma';

export class ReferralRepository {
  static async create(data: {
    referrerId: number;
    referredPhone: string;
    status?: string;
  }) {
    return prisma.referral.create({ data });
  }

  static async getByReferrerId(referrerId: number) {
    return prisma.referral.findMany({
      where: { referrerId },
      orderBy: { createdAt: 'desc' }
    });
  }
}

