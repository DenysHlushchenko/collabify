import { Faker } from '@faker-js/faker';
import { GenderType } from '../../shared/enums/gender-type';
import { User } from '../../user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export const UserFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.username = faker.person.fullName();
  user.country = faker.location.country();
  user.gender = GenderType.FEMALE;
  user.reputation = 0;
  user.email = faker.internet.email();
  user.password = faker.internet.password();

  return user;
});
