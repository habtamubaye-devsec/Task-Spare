import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @ApiOperation({ summary: 'Create a new project' })
    @Roles(Role.ADMIN, Role.MANAGER)
    @Post()
    async create(@Body() dto: CreateProjectDto, @Request() req: any) {
        if (!req.user.orgId) throw new ForbiddenException('User is not in an organization');
        return this.projectsService.create(dto, req.user.orgId);
    }

    @ApiOperation({ summary: 'List all projects' })
    @Get()
    async findAll(@Request() req: any) {
        if (!req.user.orgId) throw new ForbiddenException('User is not in an organization');
        return this.projectsService.findAll(req.user.orgId);
    }

    @ApiOperation({ summary: 'Get project details' })
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req: any) {
        return this.projectsService.findOne(id, req.user.orgId);
    }

    @ApiOperation({ summary: 'Update project' })
    @Roles(Role.ADMIN, Role.MANAGER)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Request() req: any) {
        return this.projectsService.update(id, dto, req.user.orgId);
    }

    @ApiOperation({ summary: 'Delete project' })
    @Roles(Role.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {
        return this.projectsService.remove(id, req.user.orgId);
    }
}
