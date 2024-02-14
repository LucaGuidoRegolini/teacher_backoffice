import { celebrate, Joi, Segments } from 'celebrate';

export const createClassesValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
  }),
});

export const updateClassesValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    date: Joi.date(),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    classes_id: Joi.string().required(),
  }),
});
