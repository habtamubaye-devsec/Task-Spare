import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { comparePasswords, hashPassword } from './password.util';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  
  async validateOAuthLogin(profile: any) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new UnauthorizedException(
        'No email found in OAuth profile. Please ensure your OAuth provider is configured to provide email access.',
      );
    }

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      console.log(`User found: ${email}. Skipping welcome email.`);
    }

    if (!user) {
      console.log(`Creating new OAuth user: ${email}`);
      // Generate random 8 length string password for new users, they can reset it later if needed
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await hashPassword(password);

      user = await this.prisma.user.create({
        data: {
          name: profile.displayName || 'OAuth User',
          email,
          passwordHash: hashedPassword,
          verified: true, // OAuth users are verified by default
        },
      });

      // Send welcome email only for new users
      try {
        console.log(`Sending welcome email to: ${user.email}`);
        await this.emailService.sendWelcomeEmail(user.email, user.name);
        console.log(`Welcome email sent successfully.`);
      } catch (error) {
        console.error('Error sending welcome email for OAuth user:', error);
      }
    }

    return this.generateTokens(user);
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `The email address "${dto.email}" is already registered. Please use a different email or log in.`,
      );
    }

    const hashedPassword = await hashPassword(dto.password);
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt,
      },
    });

    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
    );

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException(
        'User not found. Please check the verification link or register for a new account.',
      );
    }

    if (user.verified) {
      return { message: 'Email is already verified. You can log in.' };
    }

    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < new Date()
    ) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    // Send welcome email after successful verification
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async resendVerificationEmail(dto: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security reasons
      return {
        message:
          'If an account with that email exists, we sent you a verification email.',
      };
    }
    if (user.verified) {
      return { message: 'Email is already verified. You can log in.' };
    }
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.prisma.user.update({
      where: { id: user.id },
      data: { verificationToken, verificationTokenExpiresAt },
    });
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
    );

    return {
      message:
        'If an account with that email exists, we sent you a verification email.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException(
        'Invalid email or password. Please check your credentials and try again.',
      );
    }

    const passwordValid = await comparePasswords(
      dto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Invalid email or password. Please check your credentials and try again.',
      );
    }

    if (!user.verified) {
      throw new UnauthorizedException(
        'Your email address has not been verified. Please check your inbox for a verification email and follow the instructions to verify your account.',
      );
    }

    return this.generateTokens(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security reasons
      return {
        message:
          'If an account with that email exists, we sent you a password reset email.',
      };
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiresAt,
      },
    });

    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message:
        'If an account with that email exists, we sent you a password reset email.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: dto.token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const hashedPassword = await hashPassword(dto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return {
      message:
        'Password has been reset successfully. You can now log in with your new password.',
    };
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async refresh(token: string) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (
      !refreshToken ||
      refreshToken.revokedAt ||
      refreshToken.expiresAt < new Date()
    ) {
      throw new UnauthorizedException(
        'Your session has expired or the security token is invalid. Please log in again.',
      );
    }

    return this.generateTokens(refreshToken.user);
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      orgId: user.organizationId,
      role: user.role,
      systemRole: user.systemRole,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });

    const refreshTokenString = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    // Revoke old tokens maybe? For now just create new.
    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenString,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenString,
    };
  }
}
