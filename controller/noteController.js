const { validationResult } = require('express-validator');
const logger = require('../config/logger');
const noteService = require('../services/noteService');

module.exports.create_note = async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ message: 'Ошибка при создании заметки', errors })
      };

      const newNote = await noteService.createNote(req.body)
      res.status(200).json(newNote);
      return newNote;

   } catch (err) {
      res.status(400).json({ message: 'Error note create' });
      logger.error(err.stack);
   }
}

module.exports.get_notes = async (req, res) => {
   try {
      const notes = await noteService.getNotes({ ...req.user, ...req.query })
      res.status(200).json(notes);
      return notes;

   } catch (err) {
      res.status(400).json({ message: 'Error get note' })
      logger.error(err.stack);
   }
}

module.exports.update_note = async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ message: 'Ошибка при редактировании', errors });
      };

      const note = await noteService.updateNote({ ...req.params, ...req.body });
      res.status(200).json(note);
      return note;

   } catch (err) {
      res.status(400).json({ message: 'Error update note' })
      logger.error(err.stack);
   }
}

module.exports.delete_note = async (req, res) => {
   try {
      const note = await noteService.deleteNote(req.params);
      res.status(200).json({ message: 'Заметка успешно удалена' });
      return note;

   } catch (err) {
      res.status(400).json({ message: 'Error delete note' })
      logger.error(err.stack);
   }
}

module.exports.share_note = async (req, res) => {
   try {
      const { id: noteId } = req.params;
      const [sharedNote, link] = await noteService.shareNote({ ...req.user, noteId })

      res.status(200).json({ message: `Заметка доступна по ссылке http://localhost:5000/free/${link}` });
      return sharedNote;

   } catch (err) {
      res.status(400).json({ message: 'Error share note' })
      logger.error(err.stack);
   }
}

module.exports.get_shared_note = async (req, res) => {
   try {
      const note = await noteService.getShareNote(req.params);

      res.status(200).json(note);
      return note;

   } catch (err) {
      res.status(400).json({ message: 'Error get share note' })
      logger.error(err.stack);
   }
}
