import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { BadRequestError, InvalidTokenError } from '@infra/errors/http_errors';
import { JwtTokenObject } from '@main/interfaces/jwt_token.interface';
import { auth_config, refresh_token_config } from '@configs/auth';
import { UserToken } from '../domains/user_token.domain';
import { Either, left, right } from '@infra/either';
import { JSONWebToken } from '@shared/utils/jwt';
import { UserMap } from '@main/maps/user.map';
import { UserWebDTO } from '../dto/user.dto';
import { AppError } from '@infra/errors';

interface RequestInterface {
  refresh_token: string;
  user_id: string;
}

interface ResponseInterface {
  user: UserWebDTO;
  token: string;
  refresh_token: string;
}

export class RefreshTokenService {
  private _userRepository: UserRepositoryInterface;

  private constructor(userRepository: UserRepositoryInterface) {
    this._userRepository = userRepository;
  }

  public static getInstance(
    userRepository: UserRepositoryInterface,
  ): RefreshTokenService {
    return new RefreshTokenService(userRepository);
  }

  async execute(data: RequestInterface): Promise<Either<AppError, ResponseInterface>> {
    const { user_id, refresh_token } = data;

    const userResp = await this._userRepository.findOne({ id: user_id });

    const refresh_token_exist = await this._userRepository.findToken(
      refresh_token,
      'refresh_token',
    );

    const user = userResp.map((user) => user).value;

    if (userResp.isLeft() || !user) {
      return left(new BadRequestError('User not found'));
    }

    if (refresh_token_exist.isLeft() || !refresh_token_exist) {
      return left(new InvalidTokenError('Invalid token'));
    }

    if (!user.email_verified) {
      return left(new BadRequestError('Email not verified'));
    }

    const token_payload: JwtTokenObject = {
      user_id: user.id,
      user_name: user.name,
    };

    await this._userRepository.disableToken(refresh_token_exist.map((token) => token));

    const new_refresh_token = UserToken.create({
      type: 'refresh_token',
      user_id: user.id,
      token_length: refresh_token_config.length,
      valid_till: new Date(Date.now() + refresh_token_config.valid_till),
    });

    if (UserToken.isUserToken(new_refresh_token) === false) {
      return left(new InvalidTokenError('Invalid token'));
    }

    await this._userRepository.createToken(new_refresh_token);

    const token = JSONWebToken.sign(
      token_payload,
      auth_config.secreteKey,
      auth_config.expireIn,
    );

    return right({
      user: UserMap.domainToWeb(user),
      token,
      refresh_token: new_refresh_token.token,
    });
  }
}
