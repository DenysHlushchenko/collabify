import { BadRequestException } from '@nestjs/common';

export class ChatWasNotSelectedException extends BadRequestException {
  constructor() {
    super(
      `Post creation failed: chat title or an existing chat was not selected. Try again!`,
    );
  }
}
