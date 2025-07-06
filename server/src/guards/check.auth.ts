import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Global,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { PROTECTED_KEY } from './decorators';
import { Request, Response } from 'express';
import { Roles } from '@prisma/client';

@Injectable()
@Global()
export class CheckAuth implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<
      Request & { role?: Roles; userId?: string }
    >();

    const response = ctx.getResponse<Response>();

    if (!isProtected) {
      request.role = Roles.USER;
      return true;
    }

    const accessToken = request.cookies.accessToken;
    const refreshToken = request.cookies.refreshToken;

    if (refreshToken && !accessToken) {
      const payload = this.jwt.verify(refreshToken);

      const newAccesToken = this.jwt.sign({
        id: payload?.id,
        role: payload?.role,
      });
      const newRefreshToken = this.jwt.sign({
        id: payload?.id,
        role: payload?.role,
      });
      response.cookie('accessToken', newAccesToken, {
        maxAge: 60 * 60 * 1000,
        secure: false,
      });
      response.cookie('refreshToken', newRefreshToken, {
        maxAge: 60 * 60 * 1000 * 24,
        secure: false,
      });
    }
    if (!accessToken) {
      throw new BadRequestException('Incorrect token format');
    }

    try {
      const payload = this.jwt.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      request.userId = payload?.id;
      request.role = payload?.role;

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Token has expired');
      } else if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException('Invalid token');
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
