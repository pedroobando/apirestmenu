import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  // MONGODB_URI: Joi.required(),

  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().default('developer'),
  // HOST_API: Joi.string().required(), //=http://localhost:3000/api/v1
  // DEFAULT_LIMIT: Joi.number().default(20),

  // DB_PASSWORD: Joi.required(),
  // DB_NAME: Joi.string().default('ruta21DB'),
  // DB_USERNAME: Joi.string().default('postgres'),
  // DB_HOST:Joi.string().default('localhost'),

  ADMIN_API_TOKEN: Joi.required(),
  JWT_SECRET: Joi.required(),
  JWT_EXPIRESIN: Joi.required(),

  DATABASE_URL: Joi.string().required(),
});
