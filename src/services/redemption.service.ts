import { RedemptionRepository } from '@/repositories/redemption.repository';
import { RewardService } from './reward.service';
import { PartnerStoreRepository } from '@/repositories/partner-store.repository';

export class RedemptionService {
  static readonly MIN_REDEMPTION_POINTS = 500;
  static readonly MAX_REDEMPTION_POINTS = 5000;

  static async createRedemption(data: {
    userId: number;
    partnerId: number;
    points: number;
    amount: number;
    proofImageUrl?: string;
    code: string;
  }) {
    // Validate points range
    if (data.points < this.MIN_REDEMPTION_POINTS) {
      throw new Error(`Minimum redemption is ${this.MIN_REDEMPTION_POINTS} points`);
    }

    if (data.points > this.MAX_REDEMPTION_POINTS) {
      throw new Error(`Maximum redemption is ${this.MAX_REDEMPTION_POINTS} points`);
    }

    // Check if user has enough points
    const totalPoints = await RewardService.getTotalPointsByUserId(data.userId);
    if (totalPoints < data.points) {
      throw new Error('Not enough points');
    }

    // Verify partner exists
    const partner = await PartnerStoreRepository.getById(data.partnerId);
    if (!partner) {
      throw new Error('Partner store not found');
    }

    // Create redemption
    return RedemptionRepository.create({
      ...data,
      status: 'pending'
    });
  }

  static async getRedemptionsByUserId(userId: number) {
    return RedemptionRepository.getByUserId(userId);
  }

  static async getRedemptionsByPartnerId(partnerId: number) {
    return RedemptionRepository.getByPartnerId(partnerId);
  }
}
