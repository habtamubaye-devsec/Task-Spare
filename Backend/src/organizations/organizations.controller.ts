import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SystemRole } from '@prisma/client';
import { Role } from '@prisma/client';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Create a new organization for the current user' })
  @Post('organizations')
  create(@Body() dto: CreateOrganizationDto, @Request() req: any) {
    return this.organizationsService.create(dto, req.user.userId);
  }

  @ApiOperation({ summary: 'Get current user organization' })
  @Get('organizations/me')
  findMe(@Request() req: any) {
    // if (!req.user.userId) {
    //     throw new ForbiddenException('User has no organization');
    // }
    return this.organizationsService.findMyOrganization(req.user.userId);
  }

  @ApiOperation({ summary: 'Update current user organization ' })
  @Patch('organizations/me')
  updateMyOrganization(
    @Body() dto: UpdateOrganizationDto,
    @Request() req: any,
  ) {
    if (req.user.role !== Role.ADMIN) { 
      throw new ForbiddenException('Only Admin can update the organization');
    }
    return this.organizationsService.updateMyOrganization(req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Leave User Organization' })
  @Patch('organizations/me/leave')
  leaveOrganization(@Request() req: any) {
    if (req.user.role === Role.ADMIN) {
      throw new ForbiddenException('Admins cannot leave the organization. Please delete the organization if you wants to leave.');
    }
    return this.organizationsService.leaveOrganization(req.user.userId);
  }

  @ApiOperation({ summary: 'Soft delete organization (Admin only)' })
  @Patch('organizations/me/soft-delete')
  adminSoftDelete(@Request() req: any) {
    if (req.user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only Admin can soft delete the organization');
    }
    return this.organizationsService.adminSoftDelete(req.user.userId);
  } 

  @ApiOperation({ summary: 'Get all organizations (SUPER_ADMIN only)' })
  @Get('admin/organizations')
  findAll(@Request() req: any) {
    if (req.user.systemRole !== SystemRole.SUPER_ADMIN) {
        console.log(`User ${req.user.userId} with system role ${req.user.systemRole} attempted to access all organizations`);
        
      throw new ForbiddenException(
        `Only Super Admin can see all organizations ${req.user.systemRole}`,
      );
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
