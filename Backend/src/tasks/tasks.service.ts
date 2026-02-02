import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateTaskDto, creatorId: string, orgId: string) {
        // Verify project belongs to org
        const project = await this.prisma.project.findFirst({
            where: { id: dto.projectId, organizationId: orgId, deletedAt: null },
        });
        if (!project) throw new NotFoundException('Project not found in your organization');

        // Verify assignee belongs to org if provided
        if (dto.assigneeId) {
            const assignee = await this.prisma.user.findFirst({
                where: { id: dto.assigneeId, organizationId: orgId, deletedAt: null },
            });
            if (!assignee) throw new NotFoundException('Assignee not found in your organization');
        }

        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                status: 'TODO',
                projectId: dto.projectId,
                creatorId,
                assigneeId: dto.assigneeId,
                orgId, // Using the orgId field in Task
            },
        });
    }

    async findAll(orgId: string, projectId?: string) {
        return this.prisma.task.findMany({
            where: {
                orgId,
                projectId,
                deletedAt: null
            },
            include: {
                assignee: { select: { id: true, email: true } },
                creator: { select: { id: true, email: true } },
            },
        });
    }

    async findOne(id: string, orgId: string) {
        const task = await this.prisma.task.findFirst({
            where: { id, orgId, deletedAt: null },
            include: {
                project: true,
                assignee: { select: { id: true, email: true } },
                creator: { select: { id: true, email: true } },
                comments: {
                    where: { deletedAt: null },
                    include: { author: { select: { id: true, email: true } } },
                },
            },
        });

        if (!task) throw new NotFoundException('Task not found');

        return task;
    }

    async update(id: string, dto: UpdateTaskDto, orgId: string) {
        const task = await this.findOne(id, orgId);

        if (dto.assigneeId) {
            const assignee = await this.prisma.user.findFirst({
                where: { id: dto.assigneeId, organizationId: orgId, deletedAt: null },
            });
            if (!assignee) throw new NotFoundException('Assignee not found in your organization');
        }

        return this.prisma.task.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, orgId: string) {
        await this.findOne(id, orgId);

        return this.prisma.task.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
