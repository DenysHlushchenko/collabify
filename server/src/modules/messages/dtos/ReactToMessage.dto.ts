import { IsString } from 'class-validator';

export class ReactToMessageDto {
  @IsString()
  reaction: string;
}
