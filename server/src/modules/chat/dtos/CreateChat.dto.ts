import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateChatDto {
  @IsOptional()
  @MaxLength(50)
  title?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  postIds: number[];

  @IsNumber()
  chatId?: number;

  @IsNotEmpty()
  @IsNumber()
  max_members: number;
}
