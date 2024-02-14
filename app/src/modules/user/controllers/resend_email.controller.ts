import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { ResendEmailService } from '../services/resend_email.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class ResendEmailController implements WebControllerInterface {
  private _intance_service: ResendEmailService;

  private constructor(intance_service: ResendEmailService) {
    this._intance_service = intance_service;
  }

  public static getInstance(intance_service: ResendEmailService): ResendEmailController {
    return new ResendEmailController(intance_service);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { email } = request.body;

    const userOrError = await this._intance_service.execute({
      email,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const response = userOrError.map((user) => user);

    return right(HttpResponse.ok(response));
  }
}
