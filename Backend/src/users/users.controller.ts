import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { InviteUserDto, UpdateUserRoleDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Invite a user to the organization' })
    @Roles(Role.ADMIN)
    @Post('invite')
    async invite(@Body() dto: InviteUserDto, @Request() req: any) {
        if (!req.user.orgId) throw new ForbiddenException('User is not in an organization');
        return this.usersService.invite(dto, req.user.orgId);
    }

    @ApiOperation({ summary: 'List all users in the organization' })
    @Roles(Role.ADMIN, Role.MANAGER)
    @Get()
    async findAll(@Request() req: any) {
        if (!req.user.orgId) throw new ForbiddenException('User is not in an organization');
        return this.usersService.findAllInOrg(req.user.orgId);
    }

    @ApiOperation({ summary: 'Update a user role' })
    @Roles(Role.ADMIN)
    @Patch(':id/role')
    async updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto, @Request() req: any) {
        return this.usersService.updateRole(id, dto, req.user.orgId);
    }

    @ApiOperation({ summary: 'Remove a user from the organization' })
    @Roles(Role.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {
        return this.usersService.remove(id, req.user.orgId);
    }
}
