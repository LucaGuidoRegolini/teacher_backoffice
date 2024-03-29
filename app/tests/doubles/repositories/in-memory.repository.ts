import {
  IndexRequestInterface,
  IndexResponseInterface,
  ListRequestInterface,
  ListResponseInterface,
} from '@shared/repository/repository.interface';
import { ClasseRepositoryInterface } from '@modules/classes/repositories/classe.repository.interface';
import { UserRepositoryInterface } from '@modules/user/repositories/user.repository.interface';
import { Either, SuccessfulResponse, left, right } from '@infra/either';
import { UserToken } from '@modules/user/domains/user_token.domain';
import { Classe } from '@modules/classes/domains/classe.domain';
import { BadRequestError } from '@infra/errors/http_errors';
import { User } from '@modules/user/domains/user.domain';
import { AppError } from '@infra/errors';

class MockUserRepository implements UserRepositoryInterface {
  static userCollection: User[] = [];
  static UserTockenCollection: UserToken[] = [];
  private constructor() {}

  public static getInstance(): MockUserRepository {
    return new MockUserRepository();
  }

  async create(item: User): Promise<Either<AppError, SuccessfulResponse<User>>> {
    const user = new User(item);
    MockUserRepository.userCollection.push(user);
    return right(new SuccessfulResponse(user));
  }
  async update(
    id: string,
    item: Partial<User>,
    retry?: number | undefined,
  ): Promise<Either<AppError, SuccessfulResponse<Partial<User>>>> {
    const user = MockUserRepository.userCollection.find((user) => user.id === id);
    if (!user) {
      return left(new BadRequestError('User not found'));
    }
    Object.assign(user, item);
    MockUserRepository.userCollection.push(user);
    return right(new SuccessfulResponse(item));
  }
  async delete(id: string): Promise<Either<AppError, SuccessfulResponse<string>>> {
    const user = MockUserRepository.userCollection.find((user) => user.id === id);
    if (!user) {
      return left(new BadRequestError('User not found'));
    }
    MockUserRepository.userCollection = MockUserRepository.userCollection.filter(
      (user) => user.id !== id,
    );
    return right(new SuccessfulResponse(id));
  }
  async findOne(
    filter: Partial<User>,
  ): Promise<Either<AppError, SuccessfulResponse<User | undefined>>> {
    const user = MockUserRepository.userCollection.find(
      (user) => user.email === filter.email,
    );
    if (!user) {
      return left(new BadRequestError('User not found'));
    }
    return right(new SuccessfulResponse(user));
  }
  async index(
    data: IndexRequestInterface<User>,
  ): Promise<Either<AppError, IndexResponseInterface<User>>> {
    const users = MockUserRepository.userCollection;

    return right({
      data: users,
      total: users.length,
    });
  }
  async list(
    data: ListRequestInterface<User>,
  ): Promise<Either<AppError, ListResponseInterface<User>>> {
    const users = MockUserRepository.userCollection;

    return right({
      data: users,
      total: users.length,
      limit: data.limit || 10,
      page: data.page || 1,
      filter: data.filter,
      order: data.order,
      orderBy: data.orderBy,
    });
  }

  async createToken(user_token: UserToken): Promise<Either<AppError, UserToken>> {
    MockUserRepository.UserTockenCollection.push(user_token);
    return right(user_token);
  }
  async disableToken(
    user_token: UserToken,
  ): Promise<Either<AppError, SuccessfulResponse<boolean>>> {
    MockUserRepository.UserTockenCollection =
      MockUserRepository.UserTockenCollection.filter(
        (userToken) => userToken.token !== user_token.token,
      );
    return right(new SuccessfulResponse(true));
  }

  async findToken(
    token: string,
    type: 'email_verification' | 'password_reset' | 'refresh_token',
  ): Promise<Either<AppError, UserToken>> {
    const userToken = MockUserRepository.UserTockenCollection.find(
      (userToken) => userToken.token === token && userToken.type === type,
    );

    if (!userToken) {
      return left(new BadRequestError('Token not found'));
    }

    return right(userToken);
  }
  async findTokenWithUserId(
    user_id: string,
    type: 'email_verification' | 'password_reset' | 'refresh_token',
  ): Promise<Either<AppError, UserToken>> {
    const userToken = MockUserRepository.UserTockenCollection.find(
      (userToken) => userToken.user_id === user_id && userToken.type === type,
    );

    if (!userToken) {
      return left(new BadRequestError('Token not found'));
    }

    return right(userToken);
  }
}

class MockClasseRepository implements ClasseRepositoryInterface {
  static classeCollection: Classe[] = [];
  private constructor() {}

  public static getInstance(): MockClasseRepository {
    return new MockClasseRepository();
  }

  async create(item: Classe): Promise<Either<AppError, SuccessfulResponse<Classe>>> {
    const classe = new Classe(item);
    MockClasseRepository.classeCollection.push(classe);
    return right(new SuccessfulResponse(classe));
  }
  async update(
    id: string,
    item: Partial<Classe>,
    retry?: number | undefined,
  ): Promise<Either<AppError, SuccessfulResponse<Partial<Classe>>>> {
    const classe = MockClasseRepository.classeCollection.find(
      (classe) => classe.id === id,
    );
    if (!classe) {
      return left(new BadRequestError('Classe not found'));
    }
    Object.assign(classe, item);
    MockClasseRepository.classeCollection.push(classe);
    return right(new SuccessfulResponse(item));
  }
  async delete(id: string): Promise<Either<AppError, SuccessfulResponse<string>>> {
    const classe = MockClasseRepository.classeCollection.find(
      (classe) => classe.id === id,
    );
    if (!classe) {
      return left(new BadRequestError('Classe not found'));
    }
    MockClasseRepository.classeCollection = MockClasseRepository.classeCollection.filter(
      (user) => user.id !== id,
    );
    return right(new SuccessfulResponse(id));
  }
  async findOne(
    filter: Partial<Classe>,
  ): Promise<Either<AppError, SuccessfulResponse<Classe | undefined>>> {
    const classe = MockClasseRepository.classeCollection.find(
      (classe) => classe.title === classe.title,
    );
    if (!classe) {
      return left(new BadRequestError('Classe not found'));
    }
    return right(new SuccessfulResponse(classe));
  }
  async index(
    data: IndexRequestInterface<Classe>,
  ): Promise<Either<AppError, IndexResponseInterface<Classe>>> {
    const classe = MockClasseRepository.classeCollection;

    return right({
      data: classe,
      total: classe.length,
    });
  }
  async list(
    data: ListRequestInterface<Classe>,
  ): Promise<Either<AppError, ListResponseInterface<Classe>>> {
    const classe = MockClasseRepository.classeCollection;

    return right({
      data: classe,
      total: classe.length,
      limit: data.limit || 10,
      page: data.page || 1,
      filter: data.filter,
      order: data.order,
      orderBy: data.orderBy,
    });
  }
}

export { MockClasseRepository, MockUserRepository };
