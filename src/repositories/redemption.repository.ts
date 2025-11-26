import prisma from '@/lib/prisma';

export class RedemptionRepository {
  static async create(data: {
    userId: number;
    partnerId: number;
    points: number;
    amount: number;
    proofImageUrl?: string;
    code: string;
    status?: string;
  }) {
    return prisma.redemption.create({ data });
  }

  static async getByUserId(userId: number) {
    return prisma.redemption.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    });
  }

  static async getByPartnerId(partnerId: number) {
    return prisma.redemption.findMany({
      where: { partnerId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
  }

  static async getById(id: number) {
    return prisma.redemption.findUnique({
      where: { id },
      include: {
        partner: true,
        user: true
      }
    });
  }
}

