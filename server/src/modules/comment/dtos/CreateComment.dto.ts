import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  senderId: number;
}
