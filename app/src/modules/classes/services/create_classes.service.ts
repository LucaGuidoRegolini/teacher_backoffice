import { ClasseRepositoryInterface } from '../repositories/classe.repository.interface';
import { BadRequestError } from '@infra/errors/http_errors';
import { Either, left, right } from '@infra/either';
import { Classe } from '../domains/classe.domain';
import { ClasseMap } from '@main/maps/classe.map';
import { ClasseWebDTO } from '../dto/classe.dto';
import { AppError } from '@infra/errors';

interface RequestInterface {
  title: string;
  description: string;
  date: Date;
  user_id: string;
}

export class CreateClassesService {
  private _classeRepository: ClasseRepositoryInterface;

  private constructor(classeRepository: ClasseRepositoryInterface) {
    this._classeRepository = classeRepository;
  }

  public static getInstance(
    classeRepository: ClasseRepositoryInterface,
  ): CreateClassesService {
    return new CreateClassesService(classeRepository);
  }

  async execute(
    data: RequestInterface,
  ): Promise<Either<BadRequestError | AppError, ClasseWebDTO>> {
    const { title, description, date, user_id } = data;

    const classe = new Classe({
      title,
      description,
      date,
      user_id,
    });

    const classeExists = await this._classeRepository.findOne({
      title: classe.title,
    });

    const classes_db = classeExists.map((classe) => classe).value;

    if (classes_db) {
      return left(new BadRequestError('Classe already exists'));
    }

    const createdClasse = await this._classeRepository.create(classe);

    if (createdClasse.isLeft()) {
      return left(createdClasse.value);
    }

    return right(ClasseMap.domainToWeb(classe));
  }
}
