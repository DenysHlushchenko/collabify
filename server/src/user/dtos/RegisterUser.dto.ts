import {
  IsEmail,
  IsNotEmpty,
  Length,
  MinLength,
  Validate,
} from 'class-validator';
import { IsStrongPassword } from '../auth/validators/auth-validators';
import { GenderType } from 'src/shared/enums/gender-type';

export class RegisterUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsNotEmpty()
  gender: GenderType.MALE | GenderType.FEMALE | GenderType.OTHER;

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
