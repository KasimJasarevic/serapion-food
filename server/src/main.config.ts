/* eslint-disable prettier/prettier */
export const MainConfig = () => ({
  port: Number(process.env.PORT) || 3000,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientExpiresIn: Number(process.env.GOOGLE_CLIENT_EXPIRES_IN),
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/**/*{.js,.ts}'],
    synchronize: process.env.NODE_ENV === 'true',
    migrationsRun: process.env.NODE_ENV === 'true',
    migrations: ['dist/app/database/migrations/*.js'],
    cli: {
      migrationsDir: 'src/app/database/migrations',
    },
  },
});
