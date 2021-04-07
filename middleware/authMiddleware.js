const jwt = require('jsonwebtoken');
const { secret } = require('../config/environment');

module.exports = (req, res, next) => {
   if (req.method === 'OPTIONS') return next();

   try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) return res.status(403).json({ message: 'Пользователь не авторизован' });

      const decodedData = jwt.verify(token, secret);
      req.user = decodedData;

      next();
   } catch (err) {
      return res.status(403).json({ message: 'Пользователь не авторизован' });
   }
}
