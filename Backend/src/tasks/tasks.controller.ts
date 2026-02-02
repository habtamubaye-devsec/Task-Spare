import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @ApiOperation({ summary: 'Create a new task' })
    @Roles(Role.ADMIN, Role.MANAGER)
    @Post()
    async create(@Body() dto: CreateTaskDto, @Request() req: any) {
        if (!req.user.orgId) throw new ForbiddenException('User is not in an organization');
        return this.tasksService.create(dto, req.user.userId, req.user.orgId);
    }

    @ApiOperation({ summary: 'List all tasks in the organization' })
    @ApiQuery({ name: 'projectId', required: false })
    @Get()
    async findAll(@Request() req: any, @Query('projectId') projectId?: string) {
        if (!req.user.orgId) throw new ForbiddenException('User is not in an organization');
        return this.tasksService.findAll(req.user.orgId, projectId);
    }

    @ApiOperation({ summary: 'Get task details' })
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req: any) {
        return this.tasksService.findOne(id, req.user.orgId);
    }

    @ApiOperation({ summary: 'Update task' })
    @Roles(Role.ADMIN, Role.MANAGER)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req: any) {
        return this.tasksService.update(id, dto, req.user.orgId);
    }

    @ApiOperation({ summary: 'Delete task' })
    @Roles(Role.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {
        return this.tasksService.remove(id, req.user.orgId);
    }
}
