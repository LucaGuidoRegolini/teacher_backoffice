import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { ValidataEmailService } from '../services/valid_email.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class ValidataEmailController implements WebControllerInterface {
  private _intance_service: ValidataEmailService;

  private constructor(intance_service: ValidataEmailService) {
    this._intance_service = intance_service;
  }

  public static getInstance(
    intance_service: ValidataEmailService,
  ): ValidataEmailController {
    return new ValidataEmailController(intance_service);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { token } = request.params;

    const userOrError = await this._intance_service.execute({
      token,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const response = userOrError.map((user) => user);

    return right(HttpResponse.ok(response));
  }
}
