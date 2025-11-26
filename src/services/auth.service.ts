import { UserRepository } from '@/repositories/user.repository';
import { OTPService } from '@/utils/otp.service';
import { UserType } from '@prisma/client';

export class AuthService {
  /**
   * Send OTP to user email
   * Creates user if they don't exist, then generates and sends OTP
   */
  static async sendOTP(email: string, role: UserType): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(email);

      // If user does not exist → create user
      if (!existingUser) {
        await UserRepository.create({
          email,
          role,
        });
      }

      // Generate and store OTP
      const otp = await OTPService.createOTP(email);
      
      if (!otp) {
        return {
          success: false,
          message: 'Failed to generate OTP',
        };
      }

      return {
        success: true,
        message: 'OTP sent successfully to your email',
      };
    } catch (error) {
      console.error('Error in AuthService.sendOTP:', error);
      throw new Error('Failed to send OTP');
    }
  }

  /**
   * Verify OTP for user
   * Returns user data if verification is successful, null otherwise
   */
  static async verifyOTP(
    email: string,
    otp: string,
    role?: UserType
  ): Promise<{ success: boolean; user: { id: number; email: string; role: UserType } | null; message: string }> {
    try {
      let user;

      // If role is provided, verify user exists with that role
      if (role) {
        user = await UserRepository.findByEmailAndRole(email);
        if (!user) {
          return {
            success: false,
            user: null,
            message: 'User not found with the provided email and role',
          };
        }
      } else {
        user = await UserRepository.findByEmail(email);
        if (!user) {
          return {
            success: false,
            user: null,
            message: 'User not found. Please send OTP first',
          };
        }
      }

      // Verify OTP
      const isValid = await OTPService.verifyOTP(email, otp);
      
      if (!isValid) {
        return {
          success: false,
          user: null,
          message: 'Invalid or expired OTP',
        };
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        message: 'OTP verified successfully',
      };
    } catch (error) {
      console.error('Error in AuthService.verifyOTP:', error);
      return {
        success: false,
        user: null,
        message: 'Failed to verify OTP',
      };
    }
  }
}

