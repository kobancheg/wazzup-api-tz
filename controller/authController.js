const logger = require('../config/logger');
const { validationResult } = require('express-validator');
const authService = require('../services/authService');

module.exports.registration = async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ message: 'Ошибка при регистрации', errors });
      };

      const { status, message } = await authService.createUser(req.body);
      return res.status(status).json({ message: message });
   } catch (err) {
      res.status(400).json({ message: 'Registration error' })
      logger.error(err.stack);
   }
}

module.exports.login = async (req, res) => {
   try {
      const { status, message, token } = await authService.loginUser(req.body);

      req.session.email = req.body.email;
      req.session.token = token;

      return res.status(status).json({ message: message })
   } catch (err) {
      res.status(400).json({ message: 'Login error' })
      logger.error(err.stack);
   }
}

module.exports.logout = async (req, res) => {
   try {
      req.session.destroy(err => {
         if (err) logger.error(err.stack);

         res.status(200).json({ message: 'До новых встреч!' });
      });
   } catch (err) {
      res.status(400).json({ message: 'Logout error' })
      logger.error(err.stack);
   }
}
