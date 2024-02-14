import {
  createClassesControllerFactory,
  deleteClassesControllerFactory,
  listClassesControllerFactory,
  updateClassesControllerFactory,
} from '@main/factories/classes_module.factory';
import {
  createClassesValidation,
  updateClassesValidation,
} from '@modules/classes/validations';
import { userEnsureAuthenticated } from '@infra/express/middleware/user_ensure_authenticated';
import { adapterMiddleware } from '@main/adapters/express-middleware-adapter';
import { adaptRoute } from '@main/adapters/express-routes-adapter';
import { Router } from 'express';

const classesRoutes = Router();

classesRoutes.use(adapterMiddleware(userEnsureAuthenticated));

classesRoutes.post(
  '/',
  createClassesValidation,
  adaptRoute(createClassesControllerFactory),
);

classesRoutes.put(
  '/:classes_id',
  updateClassesValidation,
  adaptRoute(updateClassesControllerFactory),
);

classesRoutes.delete('/:classes_id', adaptRoute(deleteClassesControllerFactory));

classesRoutes.get('/', adaptRoute(listClassesControllerFactory));

export { classesRoutes };
