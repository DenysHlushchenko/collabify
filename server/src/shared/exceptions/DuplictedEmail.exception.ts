import { ConflictException } from '@nestjs/common';

export class DuplicatedEmailException extends ConflictException {
  constructor(email: string) {
    super(`The account ${email} is already registered`);
  }
}
