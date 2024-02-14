import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { BadRequestError, InvalidTokenError } from '@infra/errors/http_errors';
import { Either, left, right } from '@infra/either';
import { UserMap } from '@main/maps/user.map';
import { UserWebDTO } from '../dto/user.dto';
import { AppError } from '@infra/errors';

interface RequestInterface {
  token: string;
}

interface ResponseInterface {
  user: UserWebDTO;
}

export class ValidataEmailService {
  private _userRepository: UserRepositoryInterface;

  private constructor(userRepository: UserRepositoryInterface) {
    this._userRepository = userRepository;
  }

  public static getInstance(
    userRepository: UserRepositoryInterface,
  ): ValidataEmailService {
    return new ValidataEmailService(userRepository);
  }

  async execute(data: RequestInterface): Promise<Either<AppError, ResponseInterface>> {
    const { token } = data;

    const TokenResp = await this._userRepository.findToken(token, 'email_verification');

    const token_db = TokenResp.map((token) => token);

    if (TokenResp.isLeft() || !token_db) {
      return left(new InvalidTokenError('Invalid token'));
    }

    const userResp = await this._userRepository.findOne({
      id: TokenResp.map((token) => token).user_id,
    });

    const user = userResp.map((user) => user).value;

    if (userResp.isLeft() || !user) {
      return left(new BadRequestError('User not found'));
    }

    if (user.email_verified) {
      return left(new BadRequestError('Email already verified'));
    }

    if (!token_db.is_valid()) {
      return left(new InvalidTokenError('Invalid token'));
    }
    user.setEmailVerified(true);

    await this._userRepository.disableToken(TokenResp.map((token) => token));

    await this._userRepository.update(user.id, user);

    const output = {
      user: UserMap.domainToWeb(user),
    };

    return right(output);
  }
}
