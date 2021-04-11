const Router = require('express');
const router = Router();
const { check } = require('express-validator');
const {
   createNote,
   getNotes,
   updateNote,
   deleteNote,
   shareNote,
   getSharedNote
} = require('../controller/noteController');

router.post('/note/create', [
   check('title', 'Название заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть блоее 1000 символов').isLength({ min: 0, max: 1000 }),
], createNote);

router.get('/note/getall', getNotes);

router.put('/note/update/:id', [
   check('title', 'Название заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть блоее 1000 символов').isLength({ min: 0, max: 1000 }),
], updateNote);

router.delete('/note/delete/:id', deleteNote);
router.get('/note/share/:id', shareNote);
router.get('/:link', getSharedNote);

module.exports = router;
