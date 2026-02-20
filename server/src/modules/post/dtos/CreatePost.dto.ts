import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @Max(10)
  groupSize: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
