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
import { ClasseRepositoryInterface } from './classe.repository.interface';
import { Either, SuccessfulResponse, left, right } from '@infra/either';
import { MongoHelper } from '@infra/database/mongo-helper';
import { FindOptions, ObjectId } from 'mongodb';

import { Classe } from '../domains/classe.domain';
import { ClasseMap } from '@main/maps/classe.map';
import { AppError } from '@infra/errors';

export type ClasseModel = {
  [key: string]: any;
  _id: ObjectId;
  title: string;
  description: string;
  date: Date;
  user_id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export class ClasseRepository implements ClasseRepositoryInterface {
  static instance: ClasseRepository;

  private constructor() {}

  public static getInstance(): ClasseRepository {
    if (!this.instance) {
      this.instance = new ClasseRepository();
    }
    return this.instance;
  }

  async delete(id: string): Promise<Either<AppError, SuccessfulResponse<string>>> {
    try {
      const userCollection = await MongoHelper.getCollection('class');

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
    filter: Partial<Classe>,
  ): Promise<Either<AppError, SuccessfulResponse<Classe | undefined>>> {
    try {
      const user = ClasseMap.partialDomainToMongo(filter);

      const userCollection = await MongoHelper.getCollection('class');

      const query: Partial<ClasseModel> = {};
      for (const key in user) {
        if (user[key] !== undefined) {
          query[key] = user[key];
        }
      }

      const resp = await userCollection.findOne<ClasseModel>(query);

      const output = resp ? ClasseMap.mongoToDomain(resp) : undefined;
      return right(SuccessfulResponse.success(output));
    } catch (error) {
      return left(new InternalServerError('Error on find user'));
    }
  }
  async index(
    data: IndexRequestInterface<Classe>,
  ): Promise<Either<AppError, IndexResponseInterface<Classe>>> {
    try {
      const { filter, order, orderBy } = data;

      const db_order = order === 'descending' ? -1 : 1;

      const user = ClasseMap.partialDomainToMongo(filter || {});

      const userCollection = await MongoHelper.getCollection('class');

      const options: FindOptions<ClasseModel> = {};

      if (orderBy) {
        options.sort = {
          [String(data.orderBy)]: db_order,
        };
      }

      const resp = await userCollection.find<ClasseModel>(user, options).toArray();

      const output = resp.map((item) => ClasseMap.mongoToDomain(item));

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
  }: ListRequestInterface<Classe>): Promise<
    Either<AppError, ListResponseInterface<Classe>>
  > {
    try {
      const { filter, order, orderBy } = data;

      const userCollection = await MongoHelper.getCollection('class');

      const db_order = order === 'descending' ? 'desc' : 'asc';

      const user = ClasseMap.partialDomainToMongo(filter || {});

      const options: FindOptions<ClasseModel> = {
        skip: (page - 1) * limit,
        limit,
      };

      if (orderBy) {
        options.sort = {
          [String(data.orderBy)]: db_order,
        };
      }

      const query: Partial<ClasseModel> = {};
      for (const key in user) {
        if (user[key] !== undefined) {
          query[key] = user[key];
        }
      }

      const [resp, count] = await Promise.all([
        userCollection.find<ClasseModel>(query, options).toArray(),
        userCollection.countDocuments(query),
      ]);
      const output = resp.map((item) => ClasseMap.mongoToDomain(item));

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

  async create(item: Classe): Promise<Either<AppError, SuccessfulResponse<Classe>>> {
    try {
      const user = ClasseMap.domainToMongo(item);
      const userCollection = await MongoHelper.getCollection('class');

      await userCollection.insertOne(user);
      return right(SuccessfulResponse.success(item));
    } catch (error) {
      console.log(error);
      return left(new InternalServerError('Error on create user'));
    }
  }

  async update(
    id: string,
    item: Partial<Classe>,
    retry = 0,
  ): Promise<Either<AppError, SuccessfulResponse<Partial<Classe>>>> {
    try {
      const userCollection = await MongoHelper.getCollection('class');

      const resp = await userCollection.findOne<ClasseModel>({ _id: new ObjectId(id) });

      if (!resp) {
        return left(new BadRequestError('user not found'));
      }

      const mongo_obj = ClasseMap.partialDomainToMongo(item);

      const query: Partial<ClasseModel> = {};
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
}
