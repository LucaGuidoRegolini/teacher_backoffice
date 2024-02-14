import { celebrate, Joi, Segments } from 'celebrate';

export const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const authenticate_user_validation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const updateUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    user_id: Joi.string().required(),
  }),
});
