import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateChatDto {
  @MaxLength(20)
  title?: string;

  @IsNumber()
  chatId?: number;

  @IsNotEmpty()
  @IsNumber()
  max_members: number;
}
