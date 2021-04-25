const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/environment');

const generateAccessToken = (id, email) => {
   const payload = { id, email };
   return jwt.sign(payload, secret, { expiresIn: '24h' });
}

module.exports.createHash = async (password) => {
   try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword;
   } catch (err) {
      logger.error(err.stack);
   }
}

module.exports.compareHash = async ({ id, email, hash, password }) => {
   try {
      const match = await bcrypt.compare(password, hash);
      const token = generateAccessToken(id, email);
      return [match, token]
   } catch (err) {
      logger.error(err.stack);
   }
}
