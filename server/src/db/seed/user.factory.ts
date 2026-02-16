import { Faker } from '@faker-js/faker';
import { GenderType } from '../../shared/enums/gender-type';
import { User } from '../../user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import bcrypt from 'bcrypt';

const USER_PASSWORD = 'password';

export const UserFactory = setSeederFactory(User, async (faker: Faker) => {
  const user = new User();
  const hashedPassword = await bcrypt.hash(USER_PASSWORD, 10);
  user.username = faker.person.fullName();
  user.country = faker.location.country();
  user.gender = GenderType.FEMALE;
  user.reputation = 0;
  user.email = faker.internet.email();
  user.password = hashedPassword;

  return user;
});
