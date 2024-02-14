import {
  authenticateUserControllerFactory,
  createUserControllerFactory,
  getUserControllerFactory,
  refreshTokenControllerFactory,
  resendEmailControllerFactory,
  validataEmailControllerFactory,
} from '@main/factories/user_module.factory';
import { userEnsureAuthenticated } from '@infra/express/middleware/user_ensure_authenticated';
import { adapterMiddleware } from '@main/adapters/express-middleware-adapter';
import { adaptRoute } from '@main/adapters/express-routes-adapter';
import { createUserValidation } from '@modules/user/validations';
import { Router } from 'express';

const userRoutes = Router();

userRoutes.post('/', createUserValidation, adaptRoute(createUserControllerFactory));
userRoutes.post('/authenticate', adaptRoute(authenticateUserControllerFactory));
userRoutes.patch(
  '/authenticate/email/:token',
  adaptRoute(validataEmailControllerFactory),
);
userRoutes.post('/authenticate/email', adaptRoute(resendEmailControllerFactory));

userRoutes.use(adapterMiddleware(userEnsureAuthenticated));

userRoutes.get('/', adaptRoute(getUserControllerFactory));
userRoutes.post('/authenticate/refresh', adaptRoute(refreshTokenControllerFactory));

export { userRoutes };
