import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import type { Transporter } from 'nodemailer';

// Create a single instance of PrismaClient to be reused
const prisma = new PrismaClient();

export class OTPService {
  private static transporter: Transporter | null = null;

  public static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public static async createOTP(email: string): Promise<string> {
    // Delete any existing OTP for this email
    await prisma.otp.deleteMany({
      where: { identifier: email } as any
    });

    const otp = this.generateOTP();
    
    // Create new OTP record
    await prisma.otp.create({
      data: {
        identifier: email,
        code: otp,
        expiresAt: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes expiry
      } as any
    });

    // Send OTP via email
    await this.sendOTPByEmail(email, otp);
    
    return otp;
  }

  public static async verifyOTP(email: string, code: string): Promise<boolean> {
    const otpRecord = await prisma.otp.findFirst({
      where: {
        identifier: email,
        code,
        expiresAt: {
          gt: new Date()
        }
      } as any
    });

    if (otpRecord) {
      // Delete the OTP record after successful verification
      await prisma.otp.delete({
        where: { id: otpRecord.id }
      });
      return true;
    }

    return false;
  }

  private static getTransporter(): Transporter | null {
    if (this.transporter) return this.transporter;

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === 'true';

    if (!host || !user || !pass) {
      return null; // Fallback to console logging in dev
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    });

    return this.transporter;
  }

  private static async sendOTPByEmail(email: string, otp: string): Promise<void> {
    const transporter = this.getTransporter();

    if (!transporter) {
      // Log OTP for development if no email service is configured
      console.log(`[DEV] OTP for ${email}: ${otp}`);
      return;
    }

    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (sendgridApiKey) {
      // Use SendGrid if configured
      sgMail.setApiKey(sendgridApiKey);
      const msg = {
        to: email,
        from: process.env.SMTP_USER || 'noreply@shoppulse.com',
        subject: 'Your ShopPulse OTP Code',
        text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your ShopPulse Verification Code</h2>
            <p>Your OTP code is:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">${otp}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `,
      };

      await sgMail.send(msg);
    } else {
      // Fallback to SMTP
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'noreply@shoppulse.com',
        to: email,
        subject: 'Your ShopPulse OTP Code',
        text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your ShopPulse Verification Code</h2>
            <p>Your OTP code is:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">${otp}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `,
      });
    }
  }
}