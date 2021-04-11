const jwt = require('jsonwebtoken');
const { promisify } = require("util");

const { secret } = require('../config/environment');
const { redisClient } = require('../config/db');

const asyncClient = promisify(redisClient.get).bind(redisClient);

module.exports = async (req, res, next) => {
   if (req.method === 'OPTIONS') return next();

   try {
      const cookies = req.cookies['connect.sid'];
      const sessId = cookies.split(':').pop().split('.')[0];
      const session = await asyncClient(`sess:${sessId}`);

      if (!session) return res.status(403).json({ message: 'Пользователь не авторизован' });

      const { token } = JSON.parse(session);
      const decodedData = jwt.verify(token, secret);
      req.user = decodedData;

      next();
   } catch (err) {
      return res.status(403).json({ message: 'Пользователь не авторизован' });
   }
}
