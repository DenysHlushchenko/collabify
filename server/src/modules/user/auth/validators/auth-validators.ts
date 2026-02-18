/* https://dev.to/seenu-subhash/class-validator-cheatsheet-useful-decorators-and-nestjs-validation-patterns-2025-1c43#:~:text=Custom%20Validators */

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStrongPassword', async: false })
export class IsStrongPassword implements ValidatorConstraintInterface {
  validate(value: string): Promise<boolean> | boolean {
    return (
      typeof value === 'string' && value.length >= 8 && /[A-Z]/.test(value)
    );
  }

  defaultMessage(): string {
    return 'Password must be at least 8 characters long and include an uppercase letter.';
  }
}
