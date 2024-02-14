import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { DeleteClassesService } from '../services/delete_classes.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class DeleteClassesController implements WebControllerInterface {
  private _intance_service: DeleteClassesService;

  private constructor(intance_service: DeleteClassesService) {
    this._intance_service = intance_service;
  }

  public static getInstance(
    intance_service: DeleteClassesService,
  ): DeleteClassesController {
    return new DeleteClassesController(intance_service);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { classes_id } = request.params;

    const userOrError = await this._intance_service.execute({
      classes_id,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const response = userOrError.map((user) => user);

    return right(HttpResponse.created(response));
  }
}
