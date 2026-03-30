import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The title of the post', example: 'Looking for React developers' })
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @ApiProperty({
    description: 'Optional title for a new chat',
    example: 'React Dev Team',
    required: false,
  })
  @MaxLength(50)
  @IsOptional()
  chatTitle?: string;

  @ApiProperty({
    description: 'The description of the post',
    example: 'Need experienced React developers for a startup project',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The group size needed (2-10)',
    example: 3,
    minimum: 2,
    maximum: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @Max(10)
  groupSize: number;

  @ApiProperty({
    description: 'Array of tags (1-3 tags)',
    example: ['react', 'javascript', 'startup'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];

  @ApiProperty({ description: 'The ID of the user creating the post', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Optional existing chat ID', example: 1, required: false })
  chatId?: number;
}
