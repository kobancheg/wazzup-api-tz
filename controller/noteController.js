const { pool } = require('../config/db');
const logger = require('../config/logger');
const { validationResult } = require('express-validator');

class NoteController {
   async createNote(req, res) {
      try {
         const client = await pool.connect();
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Ошибка при создании заметки', errors })
         };

         const { title, body, userId } = req.body;
         const newNote = await client.query(
            `INSERT INTO Note (title, body, person_id) values ($1, $2, $3) RETURNING *`, [title, body, userId]
         );

         client.release();

         res.status(200).json(newNote.rows[0]);
         return newNote.rows[0];
      } catch (err) {
         res.status(400).json({ message: 'Error note create' })
         logger.error(err.stack);
      }
   }

   async getNotes(req, res) {
      try {
         const { count, offset = 0 } = req.query;
         const client = await pool.connect();
         const notes = await client.query(
            `SELECT id, title, body, created_at FROM note ORDER BY note.id ASC LIMIT $1 OFFSET $2`, [count, offset]
         );

         client.release();
         res.status(200).json(notes.rows);
         return notes.rows;
      } catch (err) {
         res.status(400).json({ message: 'Error get note' })
         logger.error(err.stack);
      }
   }

   async updateNote(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Ошибка при редактировании', errors })
         };

         const { id, title, body } = req.body;
         const client = await pool.connect();

         const note = await pool.query(
            `UPDATE Note SET title = $1, body = $2, updated_at = NOW() WHERE id = $3 RETURNING *`, [title, body, id]
         );

         client.release();
         res.status(200).json(note.rows);
         return note.rows;
      } catch (err) {
         res.status(400).json({ message: 'Error update note' })
         logger.error(err.stack);
      }
   }

   async deleteNote(req, res) {
      try {
         const { id } = req.query;
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
}

module.exports = new NoteController();
