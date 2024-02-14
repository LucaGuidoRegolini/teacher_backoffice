import { Collection, MongoClient } from 'mongodb';
import { Logger } from '@infra/logger';

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
    Logger.info(`📖 Connected to MongoDB: ${uri}`);
  },
  async disconnect(): Promise<void> {
    await this.client.close();
  },
  async getCollection(name: string): Promise<Collection> {
    return this.client.db().collection(name);
  },
  async clearCollection(name: string): Promise<void> {
    await this.client.db().collection(name).deleteMany({});
  },
};
