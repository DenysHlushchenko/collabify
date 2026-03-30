import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'The ID of the user sending the feedback',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @ApiProperty({
    description: 'The ID of the user receiving the feedback',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @ApiProperty({
    description: 'The feedback message',
    example: 'Great collaboration skills!',
  })
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'The rating for the user (1-5)',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  rating: number;
}
