import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PostTag } from 'src/modules/tag/entities/post_tag.entity';

export class CreatePostDto {
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @MaxLength(30)
  chatTitle?: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @Max(10)
  groupSize: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsArray()
  tags: PostTag[];

  chatId?: number;
}
