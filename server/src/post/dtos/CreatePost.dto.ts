import { IsNotEmpty, IsNumber, Max, MaxLength, Min } from 'class-validator';

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

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
