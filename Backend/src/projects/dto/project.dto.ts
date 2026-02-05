import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({ example: 'Website Redesign' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Complete overhaul of the company website', required: false })
    @IsString()
    @IsOptional()
    description?: string;
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
}
