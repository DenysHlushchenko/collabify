import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  message: string;

  @IsNumber()
  chatId: number;
}
