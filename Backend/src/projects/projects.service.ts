import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateProjectDto, orgId: string) {
        return this.prisma.project.create({
            data: {
                ...dto,
                organizationId: orgId,
            },
        });
    }

    async findAll(orgId: string) {
        return this.prisma.project.findMany({
            where: { organizationId: orgId, deletedAt: null },
            include: {
                _count: {
                    select: { tasks: { where: { deletedAt: null } } },
                },
            },
        });
    }

    async findOne(id: string, orgId: string) {
        const project = await this.prisma.project.findFirst({
            where: { id, organizationId: orgId, deletedAt: null },
            include: {
                tasks: {
                    where: { deletedAt: null },
                    include: { assignee: { select: { id: true, email: true } } },
                },
            },
        });

        if (!project) throw new NotFoundException('Project not found');

        return project;
    }

    async update(id: string, dto: UpdateProjectDto, orgId: string) {
        await this.findOne(id, orgId);

        return this.prisma.project.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, orgId: string) {
        await this.findOne(id, orgId);

        return this.prisma.project.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
