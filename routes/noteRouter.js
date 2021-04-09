const Router = require('express');
const router = Router();
const { check } = require('express-validator');
const noteController = require('../controller/noteController');

router.post('/note/create', [
   check('title', 'Название заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть блоее 1000 символов').isLength({ min: 0, max: 1000 }),
], noteController.createNote);

router.get('/note/getall', noteController.getNotes);

router.put('/note/update', [
   check('title', 'Название заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть блоее 1000 символов').isLength({ min: 0, max: 1000 }),
], noteController.updateNote);

router.delete('/note/delete', noteController.deleteNote);

module.exports = router;
