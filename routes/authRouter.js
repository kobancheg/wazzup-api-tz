const Router = require('express');
const router = Router();
const { check } = require('express-validator');
const {
   userRegistration,
   userLogin,
   userLogout
} = require('../controller/authController');

router.post('/registration', [
   check('name', 'Имя пользователя не может быть пустым').notEmpty(),
   check('email', 'Не корректный email').isEmail(),
   check('password', 'Пароль должен быть не меньше 6 и не больше 12 символов').isLength({ min: 6, max: 12 }),
], userRegistration);

router.post('/login', userLogin);
router.get('/logout', userLogout);

module.exports = router;
