import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { UpdateUserService } from '../services/update_user.service';
import { BadRequestError } from '@infra/errors/http_errors';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class UpdateUserController implements WebControllerInterface {
  private _intance_service: UpdateUserService;

  private constructor(intance_service: UpdateUserService) {
    this._intance_service = intance_service;
  }

  public static getInstance(intance_service: UpdateUserService): UpdateUserController {
    return new UpdateUserController(intance_service);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { name } = request.body;
    const { user_id } = request.params;
    const { user_id: id } = request.user;

    if (id !== user_id) {
      return left(new BadRequestError('User not found'));
    }

    const userOrError = await this._intance_service.execute({
      name,
      user_id,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const response = userOrError.map((user) => user);

    return right(HttpResponse.ok(response));
  }
}
