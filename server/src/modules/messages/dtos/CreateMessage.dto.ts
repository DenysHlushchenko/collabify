import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The message text',
    example: 'Hello everyone!',
  })
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'The ID of the chat',
    example: 1,
  })
  @IsNumber()
  chatId: number;

  @ApiProperty({
    description: 'Whether this is a join notification message',
    example: false,
    required: false,
  })
  isChatJoinMessage?: boolean;
}
