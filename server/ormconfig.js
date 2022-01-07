/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
dotenv.config({
  path: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
});

module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity{.js,.ts}'],
  synchronize: process.env.NODE_ENV === 'true',
  migrationsRun: process.env.NODE_ENV === 'true',
  migrations: ['dist/app/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/app/database/migrations',
  },
};
