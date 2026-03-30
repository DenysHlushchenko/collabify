import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  password: string;
}
