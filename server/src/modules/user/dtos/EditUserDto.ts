import { IsEnum, IsNotEmpty } from 'class-validator';
import { GenderType, RoleType } from 'src/shared/enums/enums';

export class EditUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEnum(GenderType)
  gender: GenderType;

  @IsNotEmpty()
  @IsEnum(RoleType)
  role: RoleType;

  @IsNotEmpty()
  country: string;

  bio?: string;
}
