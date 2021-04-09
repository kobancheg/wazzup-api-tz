const config = require('../config/environment');
const { redisClient } = require('../config/db');
const session = require('express-session');
const connectRedis = require('connect-redis');

const RedisStore = connectRedis(session);

module.exports = {
   store: new RedisStore({ client: redisClient }),
   secret: config.secret,
   resave: false,
   saveUninitialized: false,
   cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 10
   }
}
