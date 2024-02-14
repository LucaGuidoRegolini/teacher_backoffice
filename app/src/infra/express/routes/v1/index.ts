import { userRoutes } from './user.routes';
import { Router } from 'express';

const v1Routes = Router();

v1Routes.use('/user', userRoutes);

export { v1Routes };
