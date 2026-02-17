import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `${this.configService.get<string>('FRONTEND_URL')}/auth/verify?token=${token}`;

    await this.transporter.sendMail({
      from: '"Task Spare Support" <no-reply@taskspare.com>',
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Welcome to Task Spare!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${url}">Verify Email</a>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `${this.configService.get<string>('FRONTEND_URL')}/auth/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: '"Task Spare Support" <no-reply@taskspare.com>',
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Reset Password</h1>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${url}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    const loginUrl = `${this.configService.get<string>('FRONTEND_URL')}/auth/login`;

    await this.transporter.sendMail({
      from: '"Task Spare Support" <no-reply@taskspare.com>',
      to: email,
      subject: 'Welcome to Task Spare!',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for verifying your email. Your account is now active.</p>
        <p>You can now log in and start managing your tasks.</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${loginUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Log In to Task Spare</a>
        </div>
      `,
    });
  }

  async sendOrganizationDeletedEmail(email: string, orgName: string) {
    await this.transporter.sendMail({
      from: '"Task Spare Support" <no-reply@taskspare.com>',
      to: email,
      subject: 'Organization Deleted',
      html: `
        <h1>Organization Deleted</h1>
        <p>This is to inform you that the organization "<strong>${orgName}</strong>" you were part of has been deleted by an administrator.</p>
        <p>You have been removed from the organization. You can now create a new organization or join another one.</p>
      `,
    });
  }
}

