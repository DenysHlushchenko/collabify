import { IsNotEmpty } from 'class-validator';
import { GenderType, RoleType } from 'src/shared/enums/enums';

export class EditUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  gender: GenderType;

  @IsNotEmpty()
  role: RoleType;

  @IsNotEmpty()
  country: string;

  bio?: string;
}
