import { UserType } from '@prisma/client';
import { z } from 'zod';


// Send OTP validation schema
export const sendOTPSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),

  role: z.enum(['ADMIN', 'BUYER', 'SELLER', 'VISITOR'], {
    message: "Invalid role. Allowed roles: ADMIN, BUYER, SELLER, VISITOR",
  }),
});

// Export types
export type SendOTPRequest = z.infer<typeof sendOTPSchema>;


// Zod schema for verifying OTP
export const verifyOTPSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  otp: z
    .string()
    .min(1, 'OTP is required')
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
  role: z.nativeEnum(UserType).optional(),
});

export type VerifyOTPRequest = z.infer<typeof verifyOTPSchema>;

// Zod schema for setting password
export const setPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export type SetPasswordRequest = z.infer<typeof setPasswordSchema>;

