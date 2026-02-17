import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/organization.dto';
import { Role } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { use } from 'passport';

@Injectable()
export class OrganizationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateOrganizationDto, userId: string) {
    // 1. Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        'User account not found. Please log in again.',
      );
    }

    // 2. Check if user already belongs to an organization
    if (user.organizationId) {
      throw new ForbiddenException(
        'You already belong to an organization. Users can only be part of one organization at a time.',
      );
    }

    // 3. Check if organization name is already taken
    const existingOrg = await this.prisma.organization.findUnique({
      where: { name: dto.name },
    });

    if (existingOrg) {
      throw new ConflictException(
        `An organization with the name "${dto.name}" already exists. Please choose a different name.`,
      );
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

  async findMyOrganization(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new NotFoundException(
        'User account not found. Please log in again.',
      );
    }

    return user.organization;
  }

  async updateMyOrganization(userId: string, dto: UpdateOrganizationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });
    if (!user) {
      throw new NotFoundException(
        'User account not found. Please log in again.',
      );
    }
    if (!user.organization) {
      throw new NotFoundException('You do not belong to any organization.');
    }
    return this.prisma.organization.update({
      where: { id: user.organization.id },
      data: dto,
    });
  }

  //Leave Organization For not Admin User
  async leaveOrganization(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new NotFoundException(
        'User account not found. Please log in again.',
      );
    }

    if (!user.organization) {
      throw new NotFoundException('You do not belong to any organization.');
    }

    if (user.role === Role.ADMIN) {
      throw new ForbiddenException(
        'Admins cannot leave the organization. Please delete the organization if you want to leave.',
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { organizationId: null },
    });
  }

  //SoftDelete the Organization ( Only for Admin)
  async adminSoftDelete(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new NotFoundException(
        'User account not found. Please log in again.',
      );
    }

    if (!user.organizationId || !user.organization) {
      throw new NotFoundException('You do not belong to any organization.');
    }

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Only Admin can soft delete the organization',
      );
    }

    const organizationId = user.organizationId;
    const organizationName = user.organization.name; // Get name before deletion

    // Find all users in this organization before removing them
    const orgUsers = await this.prisma.user.findMany({
      where: { organizationId: organizationId },
      select: { email: true, id: true },
    });

    // Use a transaction to ensure all updates happen or none
    const deletedOrg = await this.prisma.$transaction(async (tx) => {
      // 1. Soft delete the organization
      const deletedOrg = await tx.organization.update({
        where: { id: organizationId },
        data: {
          deletedAt: new Date(),
          name: `deleted - ${organizationName}`,
        },
      });

      // 2. Remove all users from this organization and reset their roles if needed
      await tx.user.updateMany({
        where: { organizationId: organizationId },
        data: {
          organizationId: null,
          role: Role.MEMBER, // Reset admin(s) to member as well
        },
      });

      return deletedOrg;
    });

    // 3. Send emails AFTER the transaction completes successfully
    // We do this outside the transaction so email failures don't roll back the DB changes
    for (const orgUser of orgUsers) {
      if (orgUser.email) {
        try {
          await this.emailService.sendOrganizationDeletedEmail(
            orgUser.email,
            organizationName,
          );
        } catch (error) {
          console.error(
            `Failed to send organization deletion email to ${orgUser.email}`,
            error,
          );
        }
      }
    }

    return deletedOrg;
  }

  async findAll() {
    console.log(userId => `Fetching all organizations for user ${userId}`);
    console.log('Fetching all organizations');
    return this.prisma.organization.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!org || org.deletedAt) {
      throw new NotFoundException(
        `Organization with ID "${id}" not found or has been deleted.`,
      );
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
