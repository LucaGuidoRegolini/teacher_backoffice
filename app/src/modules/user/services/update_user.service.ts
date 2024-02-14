import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { BadRequestError } from '@infra/errors/http_errors';
import { Either, left, right } from '@infra/either';
import { UserMap } from '@main/maps/user.map';
import { UserWebDTO } from '../dto/user.dto';
import { AppError } from '@infra/errors';

interface RequestInterface {
  name: string;
  user_id: string;
}

export class UpdateUserService {
  private _userRepository: UserRepositoryInterface;

  private constructor(userRepository: UserRepositoryInterface) {
    this._userRepository = userRepository;
  }

  public static getInstance(userRepository: UserRepositoryInterface): UpdateUserService {
    return new UpdateUserService(userRepository);
  }

  async execute(
    data: RequestInterface,
  ): Promise<Either<BadRequestError | AppError, UserWebDTO>> {
    const { name, user_id } = data;

    const user_resp = await this._userRepository.findOne({ id: user_id });

    const user = user_resp.isRight() ? user_resp.value.value : undefined;

    if (user_resp.isLeft() || !user) {
      return left(new BadRequestError('User not found'));
    }

    user.setName(name);

    const userUpdate = await this._userRepository.update(user_id, user);

    if (userUpdate.isLeft()) {
      return left(userUpdate.value);
    }

    return right(UserMap.domainToWeb(user));
  }
}
