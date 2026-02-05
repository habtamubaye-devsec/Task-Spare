import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/comment.dto';
import { Role } from '@prisma/client';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCommentDto, authorId: string, orgId: string) {
        // Verify task belongs to org
        const task = await this.prisma.task.findFirst({
            where: { id: dto.taskId, orgId, deletedAt: null },
        });
        if (!task) throw new NotFoundException('Task not found in your organization');

        return this.prisma.comment.create({
            data: {
                content: dto.content,
                taskId: dto.taskId,
                authorId,
                orgId,
            },
        });
    }

    async remove(id: string, userId: string, orgId: string) {
        const comment = await this.prisma.comment.findFirst({
            where: { id, orgId, deletedAt: null },
        });

        if (!comment) throw new NotFoundException('Comment not found');

        // Only author or ADMIN can delete
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        if (comment.authorId !== userId && user.role !== Role.ADMIN) {
            throw new ForbiddenException('Not authorized to delete this comment');
        }

        return this.prisma.comment.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
