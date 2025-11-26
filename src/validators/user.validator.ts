import { z } from 'zod';

// Zod schema for profile update validation
export const updateProfileSchema = z.object({
  phone: z.string().optional().nullable(),
  firstName: z.string().min(1, 'First name cannot be empty').max(100, 'First name is too long').optional().nullable(),
  lastName: z.string().min(1, 'Last name cannot be empty').max(100, 'Last name is too long').optional().nullable(),
  zipCode: z.string().max(20, 'Zip code is too long').optional().nullable(),
  favoriteCategories: z.array(z.string()).optional(),
}).refine(
  (data) => {
    // At least one field should be provided
    return Object.keys(data).length > 0;
  },
  {
    message: 'At least one field must be provided for update',
  }
);

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;

export interface ProfileResponse {
  id: number;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  zipCode: string | null;
  favoriteCategories: string[];
  role: string;
  isVerified: boolean;
  createdAt: Date;
}

