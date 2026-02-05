import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
    @ApiProperty({ example: 'Acme Corp' })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UpdateOrganizationDto {
    @ApiProperty({ example: 'Acme Corp UPDATED' })
    @IsString()
    @IsOptional()
    name?: string;
}
