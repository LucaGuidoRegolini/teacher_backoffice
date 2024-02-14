import { RepositoryInterface } from '@shared/repository/repository.interface';
import { Either, SuccessfulResponse } from '@infra/either';
import { UserToken } from '../domains/user_token.domain';
import { valid_tokens } from '../dto/user.dto';
import { User } from '../domains/user.domain';
import { AppError } from '@infra/errors';

export interface UserRepositoryInterface extends RepositoryInterface<User> {
  createToken(user_token: UserToken): Promise<Either<AppError, UserToken>>;
  findToken(token: string, type: valid_tokens): Promise<Either<AppError, UserToken>>;
  findTokenWithUserId(
    user_id: string,
    type: valid_tokens,
  ): Promise<Either<AppError, UserToken>>;
  disableToken(
    user_token: UserToken,
  ): Promise<Either<AppError, SuccessfulResponse<boolean>>>;
}
