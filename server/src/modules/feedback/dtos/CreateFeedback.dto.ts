import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;
}
