import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dtos';
import { ApiOperation } from '@nestjs/swagger';
import { EnableRoles, Protected } from 'src/guards/decorators';
import { Roles } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Protected(false)
  @EnableRoles([Roles.ALL])
  @ApiOperation({
    summary: 'Register',
  })
  @Post('register')
  async register(@Body() payload: RegisterDto, @Res() res: Response) {
    const data = await this.service.register(payload);

    res.cookie('accessToken', data.data.token.accesToken, {
      maxAge: 60 * 60 * 1000,
      secure: false,
    });
    res.cookie('refreshToken', data.data.token.refreshToken, {
      maxAge: 60 * 60 * 1000 * 24,
      secure: false,
    });

    res.send(data);
  }

  @Protected(false)
  @EnableRoles([Roles.ALL])
  @ApiOperation({
    summary: 'Login',
  })
  @Post('login')
  async login(@Body() payload: LoginDto, @Res() res: Response) {
    const data = await this.service.login(payload);

    res.cookie('accessToken', data.data.token.accesToken, {
      maxAge: 60 * 60 * 1000,
      secure: false,
    });
    res.cookie('refreshToken', data.data.token.refreshToken, {
      maxAge: 60 * 60 * 1000 * 24,
      secure: false,
    });

    res.send(data);
  }

  @Protected(false)
  @EnableRoles([Roles.ALL])
  @ApiOperation({
    summary: 'Forgot password',
  })
  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    return await this.service.forgotPassword(payload);
  }

  @Protected(false)
  @EnableRoles([Roles.ALL])
  @ApiOperation({
    summary: 'Reset password',
  })
  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.service.resetPassword(payload);
  }

  @Protected(false)
  @EnableRoles([Roles.ALL])
  @ApiOperation({ summary: 'Login with google' })
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async google() {}

  @Protected(false)
  @EnableRoles([Roles.ALL])
  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res: Response) {
    const data = await this.service.google(req.user.email);

    res.cookie('accessToken', data.data.token.accesToken, {
      maxAge: 60 * 60 * 1000,
      secure: false,
    });
    res.cookie('refreshToken', data.data.token.refreshToken, {
      maxAge: 60 * 60 * 1000 * 24,
      secure: false,
    });
    res.redirect('http://localhost:4000');
  }

  @Protected(true)
  @EnableRoles([Roles.ALL])
  @Get('/me')
  async profile(@Req() req: Request & { userId: number }) {
    const id = req.userId;
    return await this.service.profile(id);
  }

  @Protected(false)
  @EnableRoles([Roles.ALL])
  @Get('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully' });
  }


}
