const Router = require('express');
const router = Router();
const { check } = require('express-validator');
const noteController = require('../controller/noteController');

router.post('/note/create', [
   check('title', 'Название заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть пустым').notEmpty(),
   check('body', 'Тело заметки не может быть блоее 1000 символов').isLength({ min: 0, max: 1000 }),
], noteController.createNote);

// router.post('/note/update', isAuth, async (req, res) => {
//    try {
//      const list = await SubscriptionService.getAllSubscriptions(req.uid);
//      return res.status(200).send(list);
//    } catch (err) {
//      return res.status(400).send({ error: true, message: err });
//    }
// });

router.get('/note/getall', noteController.getNotes);
// router.get('/note/delete', noteController.delete);

module.exports = router;
