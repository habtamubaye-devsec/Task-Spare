import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
    @ApiProperty({ example: 'Website Redesign' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Complete overhaul of the company website', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ enum: ProjectStatus, required: false, default: ProjectStatus.ACTIVE })
    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;

    @ApiProperty({ example: 'uuid', required: false })
    @IsUUID()
    @IsOptional()
    managerId?: string;

    @ApiProperty({ example: ['uuid1', 'uuid2'], required: false })
    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    memberIds?: string[];
}

export class UpdateProjectDto {
    @ApiProperty({ example: 'Website Redesign v2', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'Updated description', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ enum: ProjectStatus, required: false })
    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;

    @ApiProperty({ example: 'uuid', required: false })
    @IsUUID()
    @IsOptional()
    managerId?: string;

    @ApiProperty({ example: ['uuid1', 'uuid2'], required: false })
    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    memberIds?: string[];
}
