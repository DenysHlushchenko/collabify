import { IsNotEmpty } from 'class-validator';
import { GenderType } from 'src/shared/enums/enums';

export class EditUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  gender: GenderType;

  @IsNotEmpty()
  country: string;
}
