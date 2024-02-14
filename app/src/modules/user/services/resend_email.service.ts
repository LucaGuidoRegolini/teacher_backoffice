import { MailProviderAdapterInterface } from '@infra/lib/MailProviderAdapter/MailProviderAdapter.model';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { BadRequestError, InvalidTokenError } from '@infra/errors/http_errors';
import { Either, SuccessfulResponse, left, right } from '@infra/either';
import { UserToken } from '../domains/user_token.domain';
import { token_email_config } from '@configs/mail';
import { AppError } from '@infra/errors';
import path from 'path';

interface RequestInterface {
  email: string;
}

export class ResendEmailService {
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
  ): ResendEmailService {
    return new ResendEmailService(userRepository, email_provider);
  }

  async execute(
    data: RequestInterface,
  ): Promise<Either<AppError, SuccessfulResponse<undefined>>> {
    const { email } = data;

    const userResp = await this._userRepository.findOne({
      email,
    });

    const user = userResp.map((user) => user).value;

    if (userResp.isLeft() || !user) {
      return left(new BadRequestError('Invalid User'));
    }

    const TokenResp = await this._userRepository.findTokenWithUserId(
      user.id,
      'email_verification',
    );

    const token = TokenResp.map((token) => token);

    const date = new Date(Date.now() - token_email_config.resend_time);

    if (TokenResp.isRight() || token) {
      if (token.created_at >= date) {
        return left(new InvalidTokenError('Token send recently'));
      }
    }

    await this._userRepository.disableToken(TokenResp.map((token) => token));

    const new_token = UserToken.create({
      user_id: user.id,
      type: 'email_verification',
      valid_till: new Date(Date.now() + token_email_config.valid_till),
      token_length: token_email_config.length,
    });

    if (UserToken.isUserToken(new_token) === false) {
      return left(new BadRequestError('Error creating token'));
    }

    await this._userRepository.createToken(new_token);

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
          token: new_token.token,
        },
      },
    });

    return right(new SuccessfulResponse(undefined));
  }
}
