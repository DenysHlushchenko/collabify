import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Length,
  MinLength,
  Validate,
} from 'class-validator';
import { IsStrongPassword } from '../auth/validators/auth-validators';
import { GenderType, RoleType } from 'src/shared/enums/enums';

export class RegisterUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsNotEmpty()
  @IsEnum(GenderType)
  gender: GenderType;

  @IsNotEmpty()
  @IsEnum(RoleType)
  role: RoleType;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(2, 50)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Validate(IsStrongPassword)
  password: string;
}
