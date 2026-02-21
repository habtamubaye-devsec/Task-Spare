import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import {
  Role,
  ProjectStatus,
  TaskStatus,
  SystemRole,
} from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto, userId: string, orgId: string) {
    // If managerId is not provided, default to the creator
    const managerId = dto.managerId || userId;

    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status || ProjectStatus.ACTIVE,
        organizationId: orgId,
        managerId: managerId, // Use scalar ID instead of relation connect
        members: dto.memberIds
          ? {
              connect: dto.memberIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });
  }

  async findAll(
    userId: string,
    orgId: string,
    userRole: Role,
    systemRole?: SystemRole,
  ) {
    return this.prisma.project.findMany({
      where: { organizationId: orgId, deletedAt: null },
      include: {
        manager: { select: { id: true, name: true, email: true } },
        members: { select: { id: true, name: true, email: true } },
        tasks: { where: { deletedAt: null }, select: { status: true } },
        _count: {
          select: { tasks: { where: { deletedAt: null } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(
    id: string,
    userId: string,
    orgId: string,
    userRole: Role,
    systemRole?: SystemRole,
  ) {
    const isAdmin =
      userRole === Role.ADMIN || systemRole === SystemRole.SUPER_ADMIN;

    const project = await this.prisma.project.findFirst({
      where: { id, organizationId: orgId, deletedAt: null },
      include: {
        manager: { select: { id: true, name: true, email: true } },
        members: { select: { id: true, name: true, email: true } },
        tasks: {
          where: { deletedAt: null },
          include: {
            assignee: { select: { id: true, email: true, name: true } },
          },
        },
      },
    });

    if (!project) throw new NotFoundException('Project not found');

    const totalTasks = project.tasks ? project.tasks.length : 0;
    const completedTasks = project.tasks
      ? project.tasks.filter((t) => t.status === TaskStatus.DONE).length
      : 0;
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { ...project, progress };
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    userId: string,
    orgId: string,
    userRole: Role,
    systemRole?: SystemRole,
  ) {
    const isAdmin =
      userRole === Role.ADMIN || systemRole === SystemRole.SUPER_ADMIN;
    const project = await this.findOne(id, userId, orgId, userRole, systemRole);

    // Permission check: Only Admin or the Project Manager can update
    if (!isAdmin && project.managerId !== userId) {
      throw new ForbiddenException(
        'Only the project manager or admin can update this project',
      );
    }

    // If changing manager, validate the new manager's role
    // if (dto.managerId && dto.managerId !== project.managerId) {
    //   await this.validateManagerRole(dto.managerId);
    // }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        members: dto.memberIds
          ? {
              set: dto.memberIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });
  }

  async remove(
    id: string,
    userId: string,
    orgId: string,
    userRole: Role,
    systemRole?: SystemRole,
  ) {
    const isAdmin =
      userRole === Role.ADMIN || systemRole === SystemRole.SUPER_ADMIN;
    const project = await this.findOne(id, userId, orgId, userRole, systemRole);

    // Permission check: Only Admin or Project Manager
    if (!isAdmin && project.managerId !== userId) {
      throw new ForbiddenException(
        'Only the project manager or admin can delete this project',
      );
    }

    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
