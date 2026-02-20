import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class CreateChatDto {
  @IsOptional()
  @MaxLength(50)
  title?: string;

  @IsNumber()
  chatId?: number;

  @IsNotEmpty()
  @IsNumber()
  max_members: number;
}
