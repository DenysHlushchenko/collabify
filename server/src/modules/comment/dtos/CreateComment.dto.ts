import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a great post!',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The ID of the user sending the comment',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  senderId: number;
}
