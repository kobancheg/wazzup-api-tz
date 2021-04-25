const Router = require('express');
const router = Router();
const { check } = require('express-validator');
const noteController = require('../controller/noteController');

router.post('/note/create', [
   check('title', 'Название заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть блоее 1000 символов').isLength({ min: 0, max: 1000 }),
], noteController.create_note);

router.get('/note/getall', noteController.get_notes);

router.put('/note/update/:id', [
   check('title', 'Название заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть блоее 1000 символов').isLength({ min: 0, max: 1000 }),
], noteController.update_note);

router.delete('/note/delete/:id', noteController.delete_note);
router.get('/note/share/:id', noteController.share_note);
router.get('/:link', noteController.get_shared_note);

module.exports = router;
