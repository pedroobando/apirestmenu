import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators';
import { IUser } from '../interfaces';
// import { User } from '../entities';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = req.user as IUser;
    if (!user) {
      throw new BadRequestException('User not found');
    }

    //INFO: Cuando es un arreglo
    for (const role of user.role) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    //INFO: Cuando es individual
    if (validRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `User ${user.email} need a valid role: [${validRoles}]`,
    );
  }
}
