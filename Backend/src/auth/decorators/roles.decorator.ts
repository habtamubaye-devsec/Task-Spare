import { SetMetadata } from '@nestjs/common';
import { Role, SystemRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
export const SYSTEM_ROLES_KEY = 'systemRoles';
export const SystemRoles = (...systemRoles: SystemRole[]) => SetMetadata(SYSTEM_ROLES_KEY, systemRoles);
