import { AppError, ErrorInterface } from '.';

export abstract class DomainError extends AppError {
  constructor(data: ErrorInterface) {
    super({
      name: data.name,
      message: data.message,
      type: data.type,
    });
  }
}

export class InvalidPasswordError extends DomainError {
  constructor() {
    super({
      name: 'Invalid password',
      message: 'Invalid password',
      type: 'INVALID_PASSWORD',
    });
  }
}

export class InvalidTokenErrorDomain extends DomainError {
  constructor() {
    super({
      name: 'Invalid token',
      message: 'Invalid token',
      type: 'INVALID_TOKEN',
    });
  }
}
