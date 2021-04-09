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
      const client = await pool.connect();
      const notes = await client.query(`SELECT * FROM Note`);

      client.release();
      res.status(200).json(notes.rows);
      return newNote.rows[0];
   }

   async getPostById(id) {

      const { rows } = await db.query(`SELECT * FROM post WHERE id = $1`, [id]);
      return rows
   }
}

module.exports = new NoteController();
