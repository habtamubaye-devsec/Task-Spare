import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class InviteUserDto {
    @ApiProperty({ example: 'bob@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ enum: Role, example: Role.MANAGER })
    @IsEnum(Role)
    role: Role;
}

export class UpdateUserRoleDto {
    @ApiProperty({ enum: Role, example: Role.ADMIN })
    @IsEnum(Role)
    role: Role;
}
