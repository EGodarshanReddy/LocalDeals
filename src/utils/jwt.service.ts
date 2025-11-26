import { AuthTokens } from '@/dto/authDTOs';
import ResponseBuilder from '@/shared/common/Helpers';
import { REFRESH_TOKEN_EXPIRATION, StatusCode, TOKEN_EXPIRATION } from '@/shared/constants/common';
import { UserType } from '@prisma/client';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'your-secret-key';
export class JWTService {
  static generateAccessToken(userId: number, email: string, role: UserType): string {
    return jwt.sign(
      {
        userId,
        email,
        role
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION}
    );
  }
  // Generate Refresh Token (long lifespan)
  static generateRefreshToken(userId: number, email: string, role: UserType): string {
    return jwt.sign(
      { userId, email, role },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );
  }

  // Generate both tokens together
  static generateAuthTokens(userId: number, email: string, role: UserType): AuthTokens {
    const accessToken = this.generateAccessToken(userId, email, role);
    const refreshToken = this.generateRefreshToken(userId, email, role);
    return {
      accessToken :accessToken,
      refreshToken :refreshToken
    };
  }
  static verifyToken(token: string): { userId: number; email: string, role: UserType } | ResponseBuilder {
    try {
      const isVerifyToken = jwt.verify(token, JWT_SECRET) as { userId: number; email: string, role: UserType };
      return isVerifyToken;
    } catch (error) {
      console.error('Token verification failed:', error);
      return ResponseBuilder.failure('Invalid token', StatusCode.UNAUTHORIZED);
    }
  }
  // Verify Refresh Token
  static verifyRefreshToken(token: string): { userId: number ; email: string; role: UserType } | ResponseBuilder {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as {
        userId: number ; email: string; role: UserType
      };
    }catch (error) {
      console.error('Refresh token verification failed:', error);
      return ResponseBuilder.failure('Invalid refresh token', StatusCode.UNAUTHORIZED);
    }
  }
}