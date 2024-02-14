import { classesRoutes } from './classes.routes';
import { userRoutes } from './user.routes';
import { Router } from 'express';

const v1Routes = Router();

v1Routes.use('/user', userRoutes);
v1Routes.use('/classes', classesRoutes);

export { v1Routes };
