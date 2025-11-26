import prisma from '@/lib/prisma';

export class PartnerStoreRepository {
  static async getById(id: number) {
    return prisma.partnerStore.findUnique({
      where: { id },
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

  static async getByUserId(userId: number) {
    return prisma.partnerStore.findFirst({
      where: { userId },
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

  static async create(data: {
    userId: number;
    name: string;
    description?: string;
    contactPhone: string;
    location: string;
    latitude?: string;
    longitude?: string;
    categories: string[];
    businessHours?: any;
    priceRating?: number;
    upiId?: string;
    images?: string[];
    servicesOffered?: string[];
  }) {
    return prisma.partnerStore.create({ data });
  }

  static async update(id: number, data: Partial<{
    name: string;
    description: string;
    contactPhone: string;
    location: string;
    latitude: string;
    longitude: string;
    categories: string[];
    businessHours: any;
    priceRating: number;
    upiId: string;
    images: string[];
    servicesOffered: string[];
  }>) {
    return prisma.partnerStore.update({
      where: { id },
      data
    });
  }

  static async search(query: string) {
    const q = query || '';
    return prisma.partnerStore.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } }
        ]
      }
    });
  }

  static async getByCategory(category: string) {
    return prisma.partnerStore.findMany({
      where: { categories: { has: category } }
    });
  }

  static async getAll() {
    return prisma.partnerStore.findMany({
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
}

