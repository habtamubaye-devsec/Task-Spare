import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ example: 'This is a comment' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: 'uuid-task-id' })
    @IsUUID()
    @IsNotEmpty()
    taskId: string;
}
