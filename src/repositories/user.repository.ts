import prisma from '@/lib/prisma';
import { UserType } from '@prisma/client';

export class UserRepository {
  /**
   * Find user by email
   */
  static async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() },
    });
  }

  /**
   * Find user by ID
   */
  static async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user
   */
  static async create(data: {
    email: string;
    role: UserType;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  }) {
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        role: data.role,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  }

  /**
   * Update user by ID
   */
  static async updateById(
    id: number,
    data: {
      phone?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      zipCode?: string | null;
      favoriteCategories?: string[];
    }
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Find user by email and role
   */
  static async findByEmailAndRole(email: string) {
    return prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
      },
    });
  }
}

