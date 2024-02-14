import { objectIdToString, stringToObjectId } from '@shared/utils/generate_id';

import { ClasseModel } from '@modules/classes/repositories/classe.repository';
import { Classe } from '@modules/classes/domains/classe.domain';
import { ClasseWebDTO } from '@modules/classes/dto/classe.dto';

export class ClasseMap {
  static domainToMongo(user: Classe): ClasseModel {
    return {
      _id: stringToObjectId(user.id),
      title: user.title,
      description: user.description,
      date: user.date,
      user_id: stringToObjectId(user.user_id),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static partialDomainToMongo(user: Partial<Classe>): Partial<ClasseModel> {
    return {
      _id: user.id ? stringToObjectId(user.id) : undefined,
      title: user.title,
      description: user.description,
      date: user.date,
      user_id: user.user_id ? stringToObjectId(user.user_id) : undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  static mongoToDomain(user: ClasseModel): Classe {
    return new Classe({
      id: objectIdToString(user._id),
      title: user.title,
      description: user.description,
      date: user.date,
      user_id: objectIdToString(user.user_id),
    });
  }

  static domainToWeb(user: Classe): ClasseWebDTO {
    return {
      id: user.id,
      title: user.title,
      description: user.description,
      date: user.date,
    };
  }
}
