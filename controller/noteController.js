const { validationResult } = require('express-validator');
const crypto = require('crypto');

const { pool } = require('../config/db');
const logger = require('../config/logger');

const createNote = async (req, res) => {
   try {
      const client = await pool.connect();
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return res.status(400).json({ message: 'Ошибка при создании заметки', errors })
      };

      const { title, body, person_id } = req.body;
      const newNote = await client.query(
         `INSERT INTO Note (title, body, person_id) VALUES ($1, $2, $3) RETURNING *`, [title, body, person_id]
      );

      client.release();
      res.status(200).json(newNote.rows[0]);
      return newNote.rows[0];

   } catch (err) {
      res.status(400).json({ message: 'Error note create' });
      logger.error(err.stack);
   }
}

const getNotes = async (req, res) => {
   try {
      const { id } = req.user;
      const { count, offset = 0 } = req.query;
      const client = await pool.connect();

      const notes = await client.query(
         `SELECT id, title, body, created_at, person_id FROM note
               WHERE person_id = $1
               ORDER BY note.id
               ASC LIMIT $2 OFFSET $3`, [id, count, offset]
      );

      client.release();
      res.status(200).json(notes.rows);
      return notes.rows;

   } catch (err) {
      res.status(400).json({ message: 'Error get note' })
      logger.error(err.stack);
   }
}

const updateNote = async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ message: 'Ошибка при редактировании', errors })
      };

      const { id } = req.params;
      const { title, body } = req.body;
      const client = await pool.connect();

      const note = await pool.query(
         `UPDATE Note SET title = $1, body = $2, updated_at = NOW()
               WHERE id = $3 RETURNING *`, [title, body, id]
      );

      client.release();
      res.status(200).json(note.rows);
      return note.rows;

   } catch (err) {
      res.status(400).json({ message: 'Error update note' })
      logger.error(err.stack);
   }
}

const deleteNote = async (req, res) => {
   try {
      const { id } = req.params;
      const client = await pool.connect();

      const note = await pool.query(`DELETE FROM Note WHERE id = $1`, [id]);

      client.release();
      res.status(200).json({ message: 'Заметка успешно удалена' });
      return note.rows;

   } catch (err) {
      res.status(400).json({ message: 'Error delete note' })
      logger.error(err.stack);
   }
}

const shareNote = async (req, res) => {
   try {
      const { id } = req.user;
      const { id: noteId } = req.params;
      const client = await pool.connect();
      const link = crypto.randomBytes(16).toString('hex');

      const sharedNote = await pool.query(
         `INSERT INTO Shared (link, person_id, note_id) VALUES ($1, $2, $3) RETURNING *`, [link, id, noteId]
      );

      client.release();
      res.status(200).json({ message: `Заметка доступна по ссылке http://localhost:5000/free/${link}` });
      return sharedNote.rows;

   } catch (err) {
      res.status(400).json({ message: 'Error share note' })
      logger.error(err.stack);
   }
}

const getSharedNote = async (req, res) => {
   try {
      const { link } = req.params;
      const client = await pool.connect();

      const note = await pool.query(
         `SELECT n.title, n.body FROM Shared AS sh JOIN Note AS n ON sh.note_id = n.id
               WHERE sh.link = $1`, [link]
      );

      client.release();
      res.status(200).json(note.rows);
      return note.rows;

   } catch (err) {
      res.status(400).json({ message: 'Error get share note' })
      logger.error(err.stack);
   }
}

module.exports = {
   createNote,
   getNotes,
   updateNote,
   deleteNote,
   shareNote,
   getSharedNote
};
