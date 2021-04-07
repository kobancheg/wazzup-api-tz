const { pool } = require('../config/db');
const logger = require('../config/logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('../config/environment');

const generateAccessToken = (id, email) => {
   const payload = { id, email };
   return jwt.sign(payload, secret, { expiresIn: '24h' });
}

class authController {
   async registration(req, res) {
      try {
         const client = await pool.connect();
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Ошибка при регистрации', errors })
         };

         const { name, email, password } = req.body;
         const candidate = await client.query(`SELECT * FROM person WHERE email = $1`, [email]);

         if (candidate.rows[0] !== undefined) {
            const { email: currentEmail } = candidate.rows[0];
            return res.status(400).json({ message: `Пользователь с ${currentEmail} уже существует` })
         };

         bcrypt.hash(password, 10, async (err, hash) => {
            const newPerson = await client.query(
               `INSERT INTO person (name, email, hash) values ($1, $2, $3) RETURNING *`, [name, email, hash]
            );
            const { name: currentName } = newPerson.rows[0];
            return res.status(200).json({ message: `${currentName} Вы успешно зарегистрированы` });
         });
         client.release();
      } catch (err) {
         res.status(400).json({ message: 'Registration error' })
         logger.error(err.stack);
      }
   }

   async login(req, res) {
      try {
         const client = await pool.connect();
         const { email, password } = req.body;

         const user = await client.query(`SELECT * FROM person WHERE email = '${email}'`);

         if (user.rows[0] === undefined) {
            return res.status(400).json({ message: `Пользователь с ${email} не зарегистрирован` })
         };

         const { id, email: trueEmail, hash } = user.rows[0];
         bcrypt.compare(password, hash, (err, result) => {
            if (!result) return res.status(400).json({ message: 'Введен не верный пароль' });

            const token = generateAccessToken(id, trueEmail);

            req.session.email = email;
            req.session.token = token;

            return res.end('Success')
         });

         client.release();
      } catch (err) {
         res.status(400).json({ message: 'Login error' })
         logger.error(err.stack);
      }
   }

   async logout(req, res) {
      try {
         req.session.destroy(err => {
            if (err) logger.error(err.stack);

            res.end('Logout successfuly');
        });
      } catch (err) {
         res.status(400).json({ message: 'Logout error' })
         logger.error(err.stack);
      }
   }
}

module.exports = new authController();
