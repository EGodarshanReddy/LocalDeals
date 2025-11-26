import prisma from '@/lib/prisma';

export class NotificationRepository {
  static async getByUserId(userId: number) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async markAsRead(id: number) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  static async getById(id: number) {
    return prisma.notification.findUnique({
      where: { id }
    });
  }

  static async create(data: {
    userId: number;
    title: string;
    message: string;
    isRead?: boolean;
  }) {
    return prisma.notification.create({ data });
  }
}

