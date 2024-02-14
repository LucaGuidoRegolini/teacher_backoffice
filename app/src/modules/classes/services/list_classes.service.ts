import { ClasseRepositoryInterface } from '../repositories/classe.repository.interface';
import { BadRequestError } from '@infra/errors/http_errors';
import { Either, left, right } from '@infra/either';
import { ClasseMap } from '@main/maps/classe.map';
import { ClasseWebDTO } from '../dto/classe.dto';
import { AppError } from '@infra/errors';

interface RequestInterface {
  user_id: string;
  page?: number;
  limit?: number;
}

interface Response {
  data: ClasseWebDTO[];
  total: number;
  page: number;
  limit: number;
}

export class ListClassesService {
  private _classeRepository: ClasseRepositoryInterface;

  private constructor(classeRepository: ClasseRepositoryInterface) {
    this._classeRepository = classeRepository;
  }

  public static getInstance(
    classeRepository: ClasseRepositoryInterface,
  ): ListClassesService {
    return new ListClassesService(classeRepository);
  }

  async execute(
    data: RequestInterface,
  ): Promise<Either<BadRequestError | AppError, Response>> {
    const { limit, page, user_id } = data;

    const classe_resp = await this._classeRepository.list({
      limit,
      page,
      filter: {
        user_id,
      },
    });

    const resp = classe_resp.map((classe) => classe);

    if (classe_resp.isLeft()) {
      return left(classe_resp.value);
    }

    return right({
      data: resp.data.map((classe) => ClasseMap.domainToWeb(classe)),
      total: resp.total,
      page: resp.page,
      limit: resp.limit,
    });
  }
}
