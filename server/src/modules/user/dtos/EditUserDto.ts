import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { GenderType, RoleType } from 'src/shared/enums/enums';

export class EditUserDto {
  @ApiProperty({
    description: 'The username',
    example: 'johndoe',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The gender of the user',
    enum: GenderType,
    example: 'Male',
  })
  @IsNotEmpty()
  @IsEnum(GenderType)
  gender: GenderType;

  @ApiProperty({
    description: 'The role of the user',
    enum: RoleType,
    example: 'Student',
  })
  @IsNotEmpty()
  @IsEnum(RoleType)
  role: RoleType;

  @ApiProperty({
    description: 'The country of the user',
    example: 'United States',
  })
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'A bio about the user',
    example: 'Passionate about web development',
    required: false,
  })
  bio?: string;
}
