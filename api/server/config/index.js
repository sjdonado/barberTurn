require('dotenv').config();

const config = {
  server: {
    hostname: process.env.SERVER_HOSTNAME,
    port: process.env.SERVER_PORT,
  },
  aws: {
    keyId: process.env.AWS_KEY_ID,
    secretKey: process.env.AWS_SECRET_KEY,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  pagination: {
    limit: 10,
    skip: 0,
    page: 1,
  },
  sort: {
    sortBy: {
      default: 'createdAt',
      fields: ['createdAt', 'updatedAt'],
    },
    direction: {
      default: 'desc',
      options: ['asc', 'desc'],
    },
  },
  populate: {
    virtuals: {
      limit: 10,
      sort: 'createdAt',
      direction: 'desc',
    },
  },
};

module.exports = config;
