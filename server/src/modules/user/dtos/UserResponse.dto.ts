import { Country } from 'src/modules/country/entities/country.entity';
import { GenderType } from 'src/shared/enums/enums';

export class UserResponseDto {
  id: number;
  username: string;
  gender: GenderType;
  reputation: number;
  country: Country;
  created_at: Date;
  updated_at: Date;
}
