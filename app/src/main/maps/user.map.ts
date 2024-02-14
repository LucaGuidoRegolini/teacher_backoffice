import { UserModel, UserTokenModel } from '@modules/user/repositories/user.repository';
import { objectIdToString, stringToObjectId } from '@shared/utils/generate_id';
import { UserWebDTO, valid_tokens } from '@modules/user/dto/user.dto';
import { UserToken } from '@modules/user/domains/user_token.domain';
import { User } from '@modules/user/domains/user.domain';

export class UserMap {
  static domainToMongo(user: User): UserModel {
    return {
      _id: stringToObjectId(user.id),
      name: user.name,
      password: user.password,
      email: user.email,
      email_verified: user.email_verified,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static partialDomainToMongo(user: Partial<User>): Partial<UserModel> {
    return {
      _id: user.id ? stringToObjectId(user.id) : undefined,
      name: user.name,
      password: user.password || undefined,
      email: user.email,
      email_verified: user.email_verified,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  static mongoToDomain(user: UserModel): User {
    return new User({
      id: objectIdToString(user._id),
      name: user.name,
      password: user.password,
      email_verified: user.email_verified,
      email: user.email,
    });
  }

  static domainToWeb(user: User): UserWebDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export class UserTokenMap {
  static domainToMongo(user_token: UserToken): UserTokenModel {
    return {
      _id: stringToObjectId(user_token.id),
      token: user_token.token,
      userId: stringToObjectId(user_token.user_id),
      type: user_token.type,
      is_active: user_token.is_active,
      valid_till: user_token.valid_till,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static mongoToDomain(user_token: UserTokenModel): UserToken {
    return new UserToken({
      id: objectIdToString(user_token._id),
      token: user_token.token,
      user_id: objectIdToString(user_token.userId),
      type: user_token.type as valid_tokens,
      is_active: user_token.is_active,
      valid_till: user_token.valid_till,
      created_at: user_token.createdAt,
    });
  }
}
