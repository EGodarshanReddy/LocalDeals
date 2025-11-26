import prisma from '@/lib/prisma';

export class RewardRepository {
  static async getByUserId(userId: number) {
    return prisma.reward.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getTotalPointsByUserId(userId: number): Promise<number> {
    const result = await prisma.reward.aggregate({
      where: { userId },
      _sum: { points: true }
    });
    return result._sum.points || 0;
  }

  static async create(data: {
    userId: number;
    points: number;
    reason: string;
    referenceId?: number;
  }) {
    return prisma.reward.create({ data });
  }
}

