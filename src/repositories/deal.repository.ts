import prisma from '@/lib/prisma';

export class DealRepository {
  static async getById(id: number) {
    return prisma.deal.findUnique({
      where: { id },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            location: true,
            contactPhone: true
          }
        }
      }
    });
  }

  static async getByPartnerId(partnerId: number) {
    return prisma.deal.findMany({
      where: { partnerId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getActiveDeals() {
    return prisma.deal.findMany({
      where: { isActive: true },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getByCategory(category: string) {
    return prisma.deal.findMany({
      where: { category, isActive: true },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async search(query: string) {
    const q = query || '';
    return prisma.deal.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async create(data: {
    partnerId: number;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    dealType: string;
    discountPercentage?: number;
    category: string;
    images?: string[];
    isActive?: boolean;
  }) {
    return prisma.deal.create({ data });
  }

  static async update(id: number, data: Partial<{
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    dealType: string;
    discountPercentage: number;
    category: string;
    images: string[];
    isActive: boolean;
  }>) {
    return prisma.deal.update({
      where: { id },
      data
    });
  }

  static async deactivate(id: number) {
    return prisma.deal.update({
      where: { id },
      data: { isActive: false }
    });
  }
}

