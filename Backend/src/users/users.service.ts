import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InviteUserDto, UpdateUserRoleDto } from './dto/user.dto';
import { hashPassword } from '../auth/password.util';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async invite(dto: InviteUserDto, inviterOrgId: string) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            if (existingUser.organizationId) {
                throw new ConflictException('User already belongs to an organization');
            }

            // If user exists but has no org, bind them
            return this.prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    organizationId: inviterOrgId,
                    role: dto.role,
                },
            });
        }

        const tempPassword = await hashPassword('Temporary123!'); // In reality, send email with reset link

        return this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash: tempPassword,
                organizationId: inviterOrgId,
                role: dto.role,
            },
        });
    }

    async findAllInOrg(orgId: string) {
        return this.prisma.user.findMany({
            where: {
                organizationId: orgId,
                deletedAt: null,
            },
        });
    }

    async updateRole(id: string, dto: UpdateUserRoleDto, orgId: string) {
        const user = await this.prisma.user.findFirst({
            where: { id, organizationId: orgId },
        });

        if (!user) throw new NotFoundException('User not found in your organization');

        return this.prisma.user.update({
            where: { id },
            data: { role: dto.role },
        });
    }

    async remove(id: string, orgId: string) {
        const user = await this.prisma.user.findFirst({
            where: { id, organizationId: orgId },
        });

        if (!user) throw new NotFoundException('User not found in your organization');

        return this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
