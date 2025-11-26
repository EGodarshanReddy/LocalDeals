import { RewardRepository } from '@/repositories/reward.repository';

export class RewardService {
  static async getTotalPointsByUserId(userId: number): Promise<number> {
    return RewardRepository.getTotalPointsByUserId(userId);
  }

  static async getRewardsByUserId(userId: number) {
    return RewardRepository.getByUserId(userId);
  }

  static async createReward(data: {
    userId: number;
    points: number;
    reason: string;
    referenceId?: number;
  }) {
    return RewardRepository.create(data);
  }
}

