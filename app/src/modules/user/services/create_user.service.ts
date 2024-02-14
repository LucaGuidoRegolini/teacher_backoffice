import { MailProviderAdapterInterface } from '@infra/lib/MailProviderAdapter/MailProviderAdapter.model';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { BadRequestError, InvalidTokenError } from '@infra/errors/http_errors';
import { JwtTokenObject } from '@main/interfaces/jwt_token.interface';
import { auth_config, refresh_token_config } from '@configs/auth';
import { UserToken } from '../domains/user_token.domain';
import { Either, left, right } from '@infra/either';
import { token_email_config } from '@configs/mail';
import { JSONWebToken } from '@shared/utils/jwt';
import { User } from '../domains/user.domain';
import { UserMap } from '@main/maps/user.map';
import { UserWebDTO } from '../dto/user.dto';
import { AppError } from '@infra/errors';
import path from 'path';

interface RequestInterface {
  name: string;
  email: string;
  password: string;
}

interface ResponseInterface {
  user: UserWebDTO;
  token: string;
  refresh_token: string;
}

export class CreateUserService {
  private _userRepository: UserRepositoryInterface;
  private _email_provider: MailProviderAdapterInterface;

  private constructor(
    userRepository: UserRepositoryInterface,
    email_provider: MailProviderAdapterInterface,
  ) {
    this._userRepository = userRepository;
    this._email_provider = email_provider;
  }

  public static getInstance(
    userRepository: UserRepositoryInterface,
    email_provider: MailProviderAdapterInterface,
  ): CreateUserService {
    return new CreateUserService(userRepository, email_provider);
  }

  async execute(
    data: RequestInterface,
  ): Promise<Either<BadRequestError | AppError, ResponseInterface>> {
    const { name, email, password } = data;

    const user = User.create({
      name,
      email,
      password,
    });

    const userExists_resp = await this._userRepository.findOne({ email });
    const userExists = userExists_resp.isRight()
      ? userExists_resp.value.value
      : undefined;

    if (userExists) {
      return left(new BadRequestError('User already exists'));
    }

    const userCreated = await this._userRepository.create(user);

    if (userCreated.isLeft()) {
      return left(userCreated.value);
    }

    const token_payload: JwtTokenObject = {
      user_id: user.id,
      user_name: user.name,
    };

    const token = JSONWebToken.sign(
      token_payload,
      auth_config.secreteKey,
      auth_config.expireIn,
    );

    const valid_token = UserToken.create({
      type: 'email_verification',
      user_id: user.id,
      token_length: token_email_config.length,
      valid_till: new Date(Date.now() + token_email_config.valid_till),
    });

    const refresh_token = UserToken.create({
      type: 'refresh_token',
      user_id: user.id,
      token_length: refresh_token_config.length,
      valid_till: new Date(Date.now() + refresh_token_config.valid_till),
    });

    if (UserToken.isUserToken(valid_token) === false) {
      return left(new InvalidTokenError('Invalid token'));
    }

    if (UserToken.isUserToken(refresh_token) === false) {
      return left(new InvalidTokenError('Invalid token'));
    }

    await this._userRepository.createToken(valid_token);

    await this._userRepository.createToken(refresh_token);

    const confirm_email_template_path = path.resolve(
      __dirname,
      '..',
      'views',
      'confirm_email.hbs',
    );

    await this._email_provider.sendMail({
      subject: 'Welcome to the app',
      to: {
        name: user.name,
        email: user.email,
      },
      templateData: {
        file: confirm_email_template_path,
        variables: {
          name: user.name,
          token: valid_token.token,
        },
      },
    });

    return right({
      user: UserMap.domainToWeb(user),
      token,
      refresh_token: refresh_token.token,
    });
  }
}
