import { BadRequestException } from '@nestjs/common';

export class ChatWasNotSelected extends BadRequestException {
  constructor() {
    super(
      `Post creation failed: chat title or an existing chat was not selected. Try again!`,
    );
  }
}
