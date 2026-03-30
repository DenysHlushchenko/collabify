import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReactToMessageDto {
  @ApiProperty({
    description: 'The reaction emoji or text',
    example: '👍',
  })
  @IsString()
  reaction: string;
}
