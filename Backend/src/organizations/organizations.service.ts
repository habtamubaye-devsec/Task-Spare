import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { Role } from '@prisma/client';

@Injectable()
export class OrganizationsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateOrganizationDto, userId: string) {
        // 1. Check if organization name is already taken
        const existingOrg = await this.prisma.organization.findUnique({
            where: { name: dto.name },
        });

        if (existingOrg) {
            throw new ConflictException(`An organization with the name "${dto.name}" already exists. Please choose a different name.`);
        }

        // 2. Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User account not found. Please log in again.');
        }

        // 3. Check if user already belongs to an organization
        if (user.organizationId) {
            throw new ForbiddenException('You already belong to an organization. Users can only be part of one organization at a time.');
        }

        const organization = await this.prisma.organization.create({
            data: {
                name: dto.name,
            },
        });

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                organizationId: organization.id,
                role: Role.ADMIN,
            },
        });

        return organization;
    }

    async findAll() {
        return this.prisma.organization.findMany({
            where: { deletedAt: null },
        });
    }

    async findOne(id: string) {
        const org = await this.prisma.organization.findUnique({
            where: { id },
        });

        if (!org || org.deletedAt) {
            throw new NotFoundException(`Organization with ID "${id}" not found or has been deleted.`);
        }

        return org;
    }

    async update(id: string, dto: UpdateOrganizationDto) {
        await this.findOne(id);

        return this.prisma.organization.update({
            where: { id },
            data: dto,
        });
    }

    async softDelete(id: string) {
        await this.findOne(id);

        return this.prisma.organization.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
