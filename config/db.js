config = require('../config/environment');
const logger = require('../config/logger');
const { Pool } = require('pg');

const pool = new Pool({
   user: config.db.user,
   password: config.db.password,
   host: config.db.host,
   port: config.db.port,
   database: config.db.database
});

(async function () {
   try {
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      logger.info('Database connect successful');
      client.release()
   } catch (err) {
      logger.error(err.stack);
   }
})()

module.exports = pool;
