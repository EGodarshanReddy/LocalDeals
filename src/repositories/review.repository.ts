import prisma from '@/lib/prisma';

export class ReviewRepository {
  static async create(data: {
    userId: number;
    partnerId: number;
    rating: number;
    comment?: string;
    isPublished?: boolean;
  }) {
    return prisma.review.create({ data });
  }

  static async getByPartnerId(partnerId: number, includeUnpublished = false) {
    return prisma.review.findMany({
      where: {
        partnerId,
        ...(includeUnpublished ? {} : { isPublished: true })
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(id: number) {
    return prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        partner: true
      }
    });
  }
}

