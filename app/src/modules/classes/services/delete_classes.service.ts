import { ClasseRepositoryInterface } from '../repositories/classe.repository.interface';
import { Either, SuccessfulResponse, left, right } from '@infra/either';
import { BadRequestError } from '@infra/errors/http_errors';
import { AppError } from '@infra/errors';

interface RequestInterface {
  classes_id: string;
}

export class DeleteClassesService {
  private _classeRepository: ClasseRepositoryInterface;

  private constructor(classeRepository: ClasseRepositoryInterface) {
    this._classeRepository = classeRepository;
  }

  public static getInstance(
    classeRepository: ClasseRepositoryInterface,
  ): DeleteClassesService {
    return new DeleteClassesService(classeRepository);
  }

  async execute(
    data: RequestInterface,
  ): Promise<Either<BadRequestError | AppError, SuccessfulResponse<undefined>>> {
    const { classes_id } = data;

    const classe_resp = await this._classeRepository.delete(classes_id);

    if (classe_resp.isLeft()) {
      return left(classe_resp.value);
    }

    return right(new SuccessfulResponse(undefined));
  }
}
