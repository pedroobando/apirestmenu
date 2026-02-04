export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV,
  hostapi: process.env.HOST_API,
  defaultLimit: +process.env.DEFAULT_LIMIT! || 5,

  JWT_EXPIRESIN: process.env.JWT_EXPIRESIN || '5h',

  S3_ENDPOIN: process.env.S3_ENDPOINT,
  S3_PORT: +process.env.S3_PORT! || 9000,
  S3_ACCESS_KEY: process.env.S3_ACCESSKEY,
  S3_SECRET_KEY: process.env.S3_SECRETKEY,
  S3_BUCKET_NAME: process.env.S3_BUCKETNAME || 'user-people',
  S3_USE_SSL: process.env.S3_USE_SSL || false,
});
