import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role, SystemRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        console.log(user)

        if (!user) {
            throw new UnauthorizedException('Authentication required');
        }

        // Super Admin bypasses role checks ONLY if they are not in an Organization context.
        // If they are in an Org, they must have the correct Org Role (ADMIN/MANAGER).
        if (user.systemRole === SystemRole.SUPER_ADMIN) {
            return true;
        }

        if (!requiredRoles) {
            return true;
        }

        const hasRole = requiredRoles.includes(user.role);
        
        if (!hasRole) {
            throw new ForbiddenException(
                `Forbidden: You need one of the following roles: ${requiredRoles.join(', ')}. Your current role is: ${user.role || 'NONE'}`
            );
        }

        return true;
    }
}
