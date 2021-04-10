const config = require('../config/environment');
const logger = require('../config/logger');
const { Pool } = require('pg');
const redis = require('redis');

const pool = new Pool({
   user: config.db.user,
   password: config.db.password,
   host: config.db.host,
   port: config.db.port,
   database: config.db.database
});

(async () => {
   try {
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      logger.info('Database connect successful');
      client.release()
   } catch (err) {
      logger.error(err.stack);
   }
})()

const redisClient = redis.createClient({
   host: 'localhost',
   port: 6379
})

redisClient.on('error', (err) => {
   logger.error('Could not establish a connection with redis. ' + err);
});

redisClient.on('connect', (err) => {
   logger.info('Connected to redis successfully');
});

module.exports = { pool, redisClient };
