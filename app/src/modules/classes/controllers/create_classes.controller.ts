import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { CreateClassesService } from '../services/create_classes.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class CreateClassesController implements WebControllerInterface {
  private _intance_service: CreateClassesService;

  private constructor(intance_service: CreateClassesService) {
    this._intance_service = intance_service;
  }

  public static getInstance(
    intance_service: CreateClassesService,
  ): CreateClassesController {
    return new CreateClassesController(intance_service);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { title, description, date } = request.body;
    const { user_id } = request.user;

    const userOrError = await this._intance_service.execute({
      title,
      description,
      date,
      user_id,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const response = userOrError.map((user) => user);

    return right(HttpResponse.created(response));
  }
}
