import { Controller, Post, Body, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @ApiOperation({ summary: 'Add a comment to a task' })
    @Post()
    async create(@Body() dto: CreateCommentDto, @Request() req: any) {
        if (!req.user.orgId) throw new ForbiddenException('User is not in an organization');
        return this.commentsService.create(dto, req.user.userId, req.user.orgId);
    }

    @ApiOperation({ summary: 'Delete a comment' })
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {
        return this.commentsService.remove(id, req.user.userId, req.user.orgId);
    }
}
