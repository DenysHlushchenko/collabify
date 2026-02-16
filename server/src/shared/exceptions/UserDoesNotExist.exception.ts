import { BadRequestException } from '@nestjs/common';

export class UserDoesNotExistException extends BadRequestException {
  constructor() {
    super(`The account does not exist`);
  }
}
