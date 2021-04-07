const {
   SECRET_KEY_RANDOM,
   DB_USER,
   DB_PASSWORD,
   DB_HOST,
   DB_PORT,
   DB_NAME
} = process.env

module.exports = {
   secret: SECRET_KEY_RANDOM,
   db: {
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME
   }
}
