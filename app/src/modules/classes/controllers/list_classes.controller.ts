import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { ListClassesService } from '../services/list_classes.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class ListClassesController implements WebControllerInterface {
  private _intance_service: ListClassesService;

  private constructor(intance_service: ListClassesService) {
    this._intance_service = intance_service;
  }

  public static getInstance(intance_service: ListClassesService): ListClassesController {
    return new ListClassesController(intance_service);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { limit, page } = request.query;
    const { user_id } = request.user;

    const userOrError = await this._intance_service.execute({
      limit,
      page,
      user_id,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const response = userOrError.map((user) => user);

    return right(HttpResponse.created(response));
  }
}
