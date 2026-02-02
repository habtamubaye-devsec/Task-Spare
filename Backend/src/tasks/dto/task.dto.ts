import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
    @ApiProperty({ example: 'Implement login' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Use JWT for authentication', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'uuid-project-id' })
    @IsUUID()
    @IsNotEmpty()
    projectId: string;

    @ApiProperty({ example: 'uuid-assignee-id', required: false })
    @IsUUID()
    @IsOptional()
    assigneeId?: string;
}

export class UpdateTaskDto {
    @ApiProperty({ example: 'Implement login updated', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Updated description', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS, required: false })
    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @ApiProperty({ example: 'uuid-assignee-id', required: false })
    @IsUUID()
    @IsOptional()
    assigneeId?: string;
}
