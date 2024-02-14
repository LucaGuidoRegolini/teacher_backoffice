import { ClasseRepositoryInterface } from '../repositories/classe.repository.interface';
import { BadRequestError } from '@infra/errors/http_errors';
import { Either, left, right } from '@infra/either';
import { ClasseMap } from '@main/maps/classe.map';
import { ClasseWebDTO } from '../dto/classe.dto';
import { AppError } from '@infra/errors';

interface RequestInterface {
  title?: string;
  description?: string;
  date?: Date;
  classes_id: string;
  user_id: string;
}

export class UpdateClassesService {
  private _classeRepository: ClasseRepositoryInterface;

  private constructor(classeRepository: ClasseRepositoryInterface) {
    this._classeRepository = classeRepository;
  }

  public static getInstance(
    classeRepository: ClasseRepositoryInterface,
  ): UpdateClassesService {
    return new UpdateClassesService(classeRepository);
  }

  async execute(
    data: RequestInterface,
  ): Promise<Either<BadRequestError | AppError, ClasseWebDTO>> {
    const { title, description, date, classes_id, user_id } = data;

    const classe_resp = await this._classeRepository.findOne({
      id: classes_id,
      user_id,
    });

    const classe = classe_resp.map((classe) => classe).value;

    if (classe_resp.isLeft() || !classe) {
      return left(new BadRequestError('Classe not found'));
    }

    if (title) {
      classe.setTitle(title);
    }

    if (description) {
      classe.setDescription(description);
    }

    if (date) {
      classe.setDate(date);
    }

    const updatedClasse = await this._classeRepository.update(classes_id, classe);

    if (updatedClasse.isLeft()) {
      return left(updatedClasse.value);
    }

    return right(ClasseMap.domainToWeb(classe));
  }
}
