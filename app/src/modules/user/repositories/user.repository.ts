import {
  IndexRequestInterface,
  IndexResponseInterface,
  ListRequestInterface,
  ListResponseInterface,
} from '@shared/repository/repository.interface';
import {
  BadRequestError,
  ConcurrencyError,
  InternalServerError,
} from '@infra/errors/http_errors';
import { Either, SuccessfulResponse, left, right } from '@infra/either';
import { UserRepositoryInterface } from './user.repository.interface';
import { UserMap, UserTokenMap } from '@main/maps/user.map';
import { MongoHelper } from '@infra/database/mongo-helper';
import { UserToken } from '../domains/user_token.domain';
import { FindOptions, ObjectId } from 'mongodb';
import { User } from '../domains/user.domain';
import { AppError } from '@infra/errors';

export type UserModel = {
  [key: string]: any;
  _id: ObjectId;
  name: string;
  email: string;
  email_verified: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserTokenModel = {
  [key: string]: any;
  _id: ObjectId;
  userId: ObjectId;
  token: string;
  type: string;
  is_active: boolean;
  valid_till: Date;
  createdAt: Date;
  updatedAt: Date;
};

export class UserRepository implements UserRepositoryInterface {
  static instance: UserRepository;

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!this.instance) {
      this.instance = new UserRepository();
    }
    return this.instance;
  }

  async delete(id: string): Promise<Either<AppError, SuccessfulResponse<string>>> {
    try {
      const userCollection = await MongoHelper.getCollection('users');

      const resp = await userCollection.findOneAndDelete({ _id: new ObjectId(id) });
      if (!resp) {
        return left(new BadRequestError('user not found'));
      }
      resp;
      return right(SuccessfulResponse.success(resp.id));
    } catch (error) {
      return left(new InternalServerError('Error on delete user'));
    }
  }
  async findOne(
    filter: Partial<User>,
  ): Promise<Either<AppError, SuccessfulResponse<User | undefined>>> {
    try {
      const user = UserMap.partialDomainToMongo(filter);

      const userCollection = await MongoHelper.getCollection('users');

      const query: Partial<UserModel> = {};
      for (const key in user) {
        if (user[key] !== undefined) {
          query[key] = user[key];
        }
      }

      const resp = await userCollection.findOne<UserModel>(query);

      const output = resp ? UserMap.mongoToDomain(resp) : undefined;
      return right(SuccessfulResponse.success(output));
    } catch (error) {
      return left(new InternalServerError('Error on find user'));
    }
  }
  async index(
    data: IndexRequestInterface<User>,
  ): Promise<Either<AppError, IndexResponseInterface<User>>> {
    try {
      const { filter, order, orderBy } = data;

      const db_order = order === 'descending' ? -1 : 1;

      const user = UserMap.partialDomainToMongo(filter || {});

      const userCollection = await MongoHelper.getCollection('users');

      const options: FindOptions<UserModel> = {};

      if (orderBy) {
        options.sort = {
          [String(data.orderBy)]: db_order,
        };
      }

      const resp = await userCollection.find<UserModel>(user, options).toArray();

      const output = resp.map((item) => UserMap.mongoToDomain(item));

      return right({
        data: output,
        filter,
        order,
        orderBy,
      });
    } catch (error) {
      return left(new InternalServerError('Error on index user'));
    }
  }
  async list({
    page = 1,
    limit = 10,
    ...data
  }: ListRequestInterface<User>): Promise<Either<AppError, ListResponseInterface<User>>> {
    try {
      const { filter, order, orderBy } = data;

      const userCollection = await MongoHelper.getCollection('users');

      const db_order = order === 'descending' ? 'desc' : 'asc';

      const user = UserMap.partialDomainToMongo(filter || {});

      const options: FindOptions<UserModel> = {
        skip: (page - 1) * limit,
        limit,
      };

      if (orderBy) {
        options.sort = {
          [String(data.orderBy)]: db_order,
        };
      }

      const [resp, count] = await Promise.all([
        userCollection.find<UserModel>(user, options).toArray(),
        userCollection.countDocuments(user),
      ]);
      const output = resp.map((item) => UserMap.mongoToDomain(item));

      return right({
        data: output,
        page,
        limit,
        total: count,
      });
    } catch (error) {
      return left(new InternalServerError('Error on index user'));
    }
  }

  async create(item: User): Promise<Either<AppError, SuccessfulResponse<User>>> {
    try {
      const user = UserMap.domainToMongo(item);
      const userCollection = await MongoHelper.getCollection('users');

      await userCollection.insertOne(user);
      return right(SuccessfulResponse.success(item));
    } catch (error) {
      console.log(error);
      return left(new InternalServerError('Error on create user'));
    }
  }

  async update(
    id: string,
    item: Partial<User>,
    retry = 0,
  ): Promise<Either<AppError, SuccessfulResponse<Partial<User>>>> {
    try {
      const userCollection = await MongoHelper.getCollection('users');

      const resp = await userCollection.findOne<UserModel>({ _id: new ObjectId(id) });

      if (!resp) {
        return left(new BadRequestError('user not found'));
      }

      const mongo_obj = UserMap.partialDomainToMongo(item);

      const query: Partial<UserModel> = {};
      for (const key in mongo_obj) {
        if (mongo_obj[key] !== undefined) {
          query[key] = mongo_obj[key];
        }
      }

      const response = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id), updatedAt: resp.updatedAt },
        { $set: query },
      );

      if (!response) {
        if (retry >= 1) {
          return this.update(id, item, retry - 1);
        }

        return left(new ConcurrencyError('Concurrency Error'));
      }

      return right(new SuccessfulResponse(item));
    } catch (error) {
      return left(new InternalServerError('Error on update user'));
    }
  }

  async createToken(user_token: UserToken): Promise<Either<AppError, UserToken>> {
    try {
      const token = UserTokenMap.domainToMongo(user_token);
      const userCollection = await MongoHelper.getCollection('user_tokens');
      await userCollection.insertOne(token);
      return right(user_token);
    } catch (error) {
      return left(new InternalServerError('Error on create token'));
    }
  }

  async findToken(token: string, type: string): Promise<Either<AppError, UserToken>> {
    try {
      const userCollection = await MongoHelper.getCollection('user_tokens');

      const resp = await userCollection.findOne<UserTokenModel>(
        { token, type },
        { sort: { valid_till: -1 } },
      );

      if (!resp) {
        return left(new BadRequestError('Token not found'));
      }
      return right(UserTokenMap.mongoToDomain(resp));
    } catch (error) {
      return left(new InternalServerError('Error on find token'));
    }
  }

  async findTokenWithUserId(
    user_id: string,
    type: string,
  ): Promise<Either<AppError, UserToken>> {
    try {
      const userCollection = await MongoHelper.getCollection('user_tokens');

      const resp = await userCollection.findOne<UserTokenModel>(
        { userId: new ObjectId(user_id), type },
        { sort: { valid_till: -1 } },
      );

      if (!resp) {
        return left(new BadRequestError('Token not found'));
      }
      return right(UserTokenMap.mongoToDomain(resp));
    } catch (error) {
      return left(new InternalServerError('Error on find token'));
    }
  }

  async disableToken(
    user_token: UserToken,
  ): Promise<Either<AppError, SuccessfulResponse<boolean>>> {
    try {
      const userCollection = await MongoHelper.getCollection('user_tokens');

      const resp = await userCollection.findOneAndUpdate(
        {
          token: user_token.token,
          type: user_token.type,
          userId: new ObjectId(user_token.user_id),
        },
        {
          $set: {
            is_active: false,
          },
        },
      );

      if (!resp) {
        return left(new BadRequestError('Token not found'));
      }

      return right(SuccessfulResponse.success(true));
    } catch (error) {
      return left(new InternalServerError('Error on disable token'));
    }
  }
}
