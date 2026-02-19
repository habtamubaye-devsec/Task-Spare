import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InviteUserDto, UpdateUserRoleDto } from './dto/user.dto';
import { hashPassword } from '../auth/password.util';
import { Role } from '@prisma/client';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ) { }

    async invite(dto: InviteUserDto, inviterOrgId: string) {
        const inviterOrg = await this.prisma.organization.findUnique({
            where: { id: inviterOrgId },
        });

        if (!inviterOrg) {
            throw new NotFoundException('Organization not found');
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            if (existingUser.organizationId === inviterOrgId) {
                throw new ConflictException('User is already a member of this organization');
            }

            if (existingUser.organizationId) {
                throw new ConflictException('User already belongs to another organization');
            }

            // If user exists but has no org, bind them
            await this.prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    organizationId: inviterOrgId,
                    role: dto.role,
                },
            });

            await this.emailService.sendOrgJoinEmail(existingUser.email, inviterOrg.name, dto.role);
            return { message: 'User added to organization and notified' };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        // Temporary random password, user will set it via reset token
        const tempPassword = await hashPassword(crypto.randomBytes(16).toString('hex'));

        const newUser = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash: tempPassword,
                organizationId: inviterOrgId,
                role: dto.role,
                verified: true,
                resetToken,
                resetTokenExpiresAt,
            },
        });

        await this.emailService.sendAccountInviteEmail(newUser.email, resetToken, inviterOrg.name, dto.role);

        return { message: 'User created and invitation sent' };
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
