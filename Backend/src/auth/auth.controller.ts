import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // GOOGLE
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return req.user;
  }

  // GITHUB
  @ApiOperation({ summary: 'Initiate GitHub OAuth login' })
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @ApiOperation({ summary: 'Handle GitHub OAuth callback' })
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(@Req() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
   @ApiOperation({ summary: 'Verify email address' })
  @ApiQuery({ name: 'token', required: true })
  @Get('verify')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @ApiOperation({ summary: 'Resend verification email' })
  @Post('resend-verification')
  async resendVerificationEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.resendVerificationEmail(dto);
  }

  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Request password reset' })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiOperation({ summary: 'Reset password' })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }


  @ApiOperation({ summary: 'Refresh access token' })
  @Post('refresh')
  async refresh(@Body('refreshToken') token: string) {
    return this.authService.refresh(token);
  }

  @ApiOperation({ summary: 'Logout user' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    return this.authService.logout(req.user.userId);
  }
}
