import { MongoHelper } from '@infra/database/mongo-helper';
import { express_port_http } from '@configs/express';
import { mongo_url } from '@configs/global_env';
import { Logger } from '@infra/logger';
import 'dotenv/config';

(async () => {
  const logger = Logger.init();
  Logger.info('✅ Server starting');

  MongoHelper.connect(mongo_url).then(() => {
    import('@infra/express').then(async ({ ExpressServer }) => {
      const httpPort = express_port_http;
      const httpServer = new ExpressServer(httpPort, logger);

      httpServer.start();
    });
  });
})();
