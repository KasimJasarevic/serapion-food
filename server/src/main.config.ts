export const MainConfig = () => ({
  port: Number(process.env.PORT) || 3000,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientExpiresIn: Number(process.env.GOOGLE_CLIENT_EXPIRES_IN),
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleClientCallback: process.env.GOOGLE_CALLBACK,
  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: Boolean(process.env.SYNCHRONIZE_DB) || false
  }
});
