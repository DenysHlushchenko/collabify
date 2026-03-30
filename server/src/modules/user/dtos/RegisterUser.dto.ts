import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'The username (2-30 characters)',
    example: 'johndoe',
  })
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @ApiProperty({
    description: 'The gender',
    enum: GenderType,
    example: 'Male',
  })
  @IsNotEmpty()
  @IsEnum(GenderType)
  gender: GenderType;

  @ApiProperty({
    description: 'The role',
    enum: RoleType,
    example: 'Student',
  })
  @IsNotEmpty()
  @IsEnum(RoleType)
  role: RoleType;

  @ApiProperty({
    description: 'The country',
    example: 'United States',
  })
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'The email address (2-50 characters)',
    example: 'john@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(2, 50)
  email: string;

  @ApiProperty({
    description: 'A strong password (min 8 characters with uppercase, lowercase, numbers, and special characters)',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  @MinLength(8)
  @Validate(IsStrongPassword)
  password: string;
}
