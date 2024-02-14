import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { UpdateClassesService } from '../services/update_classes.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class UpdateClassesController implements WebControllerInterface {
  private _intance_service: UpdateClassesService;

  private constructor(intance_service: UpdateClassesService) {
    this._intance_service = intance_service;
  }

  public static getInstance(
    intance_service: UpdateClassesService,
  ): UpdateClassesController {
    return new UpdateClassesController(intance_service);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { title, description, date } = request.body;
    const { classes_id } = request.params;
    const { user_id } = request.user;

    const userOrError = await this._intance_service.execute({
      title,
      description,
      date,
      classes_id,
      user_id,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const response = userOrError.map((user) => user);

    return right(HttpResponse.created(response));
  }
}
