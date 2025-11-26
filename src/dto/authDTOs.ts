import { UserType } from "@prisma/client";

export interface SendOTPRequest {  
  email: string;
  role?: UserType;    
}

export interface VerifyOTPRequest {  
  email: string;  
  otp: string;
}
export interface SetPasswordRequest {  
  email: string;  
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    phone: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    role?: string;
  };
}

export interface AccessTokenPayload {
  userId: number;
  email: string;
  role: UserType;
}

export interface RefreshTokenPayload {
  userId: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}