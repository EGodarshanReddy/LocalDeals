import prisma from '@/lib/prisma';

export class VisitRepository {
  static async create(data: {
    userId: number;
    partnerId: number;
    visitDate: Date;
    notes?: string;
    dealId?: number;
    status?: string;
  }) {
    return prisma.visit.create({ data });
  }

  static async getByUserId(userId: number) {
    return prisma.visit.findMany({
      where: { userId },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        deal: {
          select: {
            id: true,
            name: true,
            discountPercentage: true
          }
        }
      },
      orderBy: { visitDate: 'desc' }
    });
  }

  static async getById(id: number) {
    return prisma.visit.findUnique({
      where: { id },
      include: {
        partner: true,
        deal: true,
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

  static async markAsCompleted(id: number) {
    return prisma.visit.update({
      where: { id },
      data: { status: 'completed', markedAsVisited: true }
    });
  }

  static async getScheduledByPartnerId(partnerId: number) {
    return prisma.visit.findMany({
      where: { partnerId, status: 'scheduled' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        deal: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { visitDate: 'asc' }
    });
  }
}

