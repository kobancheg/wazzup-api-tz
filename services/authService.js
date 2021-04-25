const { pool } = require('../config/db');
const crypto = require('../libs/crypto');

const createUser = async ({ name, email, password }) => {
   try {
      const client = await pool.connect();
      const candidate = await client.query(`SELECT * FROM person WHERE email = $1`, [email]);

      if (candidate.rows[0] !== undefined) {
         const { email: currentEmail } = candidate.rows[0];
         return { status: 400, message: `Пользователь с ${currentEmail} уже существует` }
      };

      const hash = await crypto.createHash(password);
      const newPerson = await client.query(
         `INSERT INTO person (name, email, hash) values ($1, $2, $3) RETURNING *`, [name, email, hash]
      );

      const { name: currentName } = newPerson.rows[0];
      client.release();
      return { status: 200, message: `${currentName} Вы успешно зарегистрированы` };
   } catch (err) {
      throw err;
   }
}

const loginUser = async ({ email, password }) => {
   try {
      const client = await pool.connect();
      const user = await client.query(`SELECT * FROM person WHERE email = '${email}'`);

      if (user.rows[0] === undefined) {
         return { status: 401, message: `Пользователь с ${email} не зарегистрирован` }
      };

      const [match, token] = await crypto.compareHash({ ...user.rows[0], password });

      if (!match) return { status: 400, message: 'Введен не верный пароль' };
      if (match) return { status: 200, message: `${user.rows[0].name} Вы успешно авторизовались`, token }
   } catch (err) {
      throw err;
   }
}

module.exports = {
   createUser,
   loginUser
}
