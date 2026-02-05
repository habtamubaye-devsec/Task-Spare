import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SystemRole } from '@prisma/client';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) { }

    @ApiOperation({ summary: 'Create a new organization for the current user' })
    @Post('organizations')
    create(@Body() dto: CreateOrganizationDto, @Request() req: any) {
        return this.organizationsService.create(dto, req.user.userId);
    }

    @ApiOperation({ summary: 'Get current user organization' })
    @Get('organizations/me')
    findMe(@Request() req: any) {
        if (!req.user.orgId) {
            throw new ForbiddenException('User has no organization');
        }
        return this.organizationsService.findOne(req.user.orgId);
    }

    @ApiOperation({ summary: 'Get all organizations (SUPER_ADMIN only)' })
    @Get('admin/organizations')
    findAll(@Request() req: any) {
        if (req.user.systemRole !== SystemRole.SUPER_ADMIN) {
            throw new ForbiddenException('Only Super Admin can see all organizations');
        }
        return this.organizationsService.findAll();
    }

    @ApiOperation({ summary: 'Update organization info' })
    @Patch('organizations/:id')
    update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
        return this.organizationsService.update(id, dto);
    }

    @ApiOperation({ summary: 'Delete organization' })
    @Delete('organizations/:id')
    remove(@Param('id') id: string) {
        return this.organizationsService.softDelete(id);
    }
}
