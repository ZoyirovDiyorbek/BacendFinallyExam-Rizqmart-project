import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Global,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './decorators';

@Injectable()
@Global()
export class CheckRole implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<
      Request & { role?: Roles; userId?: string }
    >();

    const roles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    let userRole = request.role;

    if (roles.includes(Roles.ALL)) {
      return true;
    }

    if (!roles || !userRole || !roles.includes(userRole)) {
      throw new ForbiddenException(
        'You do not have any access for this operation',
      );
    }
    return true;
  }
}
