module.exports = config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  postgres: {
    user: process.env.PGUSER,
    pass: process.env.PGPASSWORD,
    db: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
  },
  jwt: {
    token: {
      access: process.env.ACCESS_TOKEN_KEY,
      refresh: process.env.REFRESH_TOKEN_KEY,
    },
    age: process.env.ACCESS_TOKEN_AGE,
  },
  mq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    server: process.env.REDIS_SERVER,
  },
  aws: {
    key: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3: {
      bucketName: process.env.AWS_BUCKET_NAME,
    },
  },
};
