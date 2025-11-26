import { z } from 'zod';

export const createRedemptionSchema = z.object({
  partnerId: z.number().int().positive('Partner ID must be a positive number'),
  points: z.number()
    .int('Points must be an integer')
    .min(500, 'Minimum redemption is 500 points')
    .max(5000, 'Maximum redemption is 5000 points'),
  amount: z.number().int().positive('Amount must be a positive number'),
  proofImageUrl: z.string().url('Invalid image URL').optional().nullable(),
  code: z.string().min(1, 'Code is required'),
});

export type CreateRedemptionRequest = z.infer<typeof createRedemptionSchema>;

