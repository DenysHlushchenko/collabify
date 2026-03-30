import { ApiProperty } from '@nestjs/swagger';
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

export class UpdatePostDto {
  @ApiProperty({ description: 'The updated title of the post' })
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @ApiProperty({ description: 'The updated description of the post' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The updated group size (2-10)',
    minimum: 2,
    maximum: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @Max(10)
  groupSize: number;

  @ApiProperty({ description: 'Updated tags (1-3)' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];
}
