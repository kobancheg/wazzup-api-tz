const crypto = require('crypto');
const { pool } = require('../config/db');

const createNote = async ({ title, body, person_id }) => {
   try {
      const client = await pool.connect();
      const newNote = await client.query(
         `INSERT INTO Note (title, body, person_id) VALUES ($1, $2, $3) RETURNING *`, [title, body, person_id]
      );

      client.release();
      return newNote.rows[0];
   } catch (err) {
      throw err;
   }
}

const getNotes = async ({ id, count, offset = 0 }) => {
   try {
      const client = await pool.connect();
      const notes = await client.query(
         `SELECT id, title, body, created_at, person_id FROM note
               WHERE person_id = $1
               ORDER BY note.id
               ASC LIMIT $2 OFFSET $3`, [id, count, offset]
      );

      client.release();
      return notes.rows;
   } catch (err) {
      throw err;
   }
}

const updateNote = async ({ id, title, body }) => {
   try {
      const client = await pool.connect();
      const note = await pool.query(
         `UPDATE Note SET title = $1, body = $2, updated_at = NOW()
               WHERE id = $3 RETURNING *`, [title, body, id]
      );

      client.release();
      return note.rows;
   } catch (err) {
      throw err;
   }
}

const deleteNote = async ({ id }) => {
   try {
      const client = await pool.connect();
      const note = await pool.query(`DELETE FROM Note WHERE id = $1`, [id]);

      client.release();
      return note;
   } catch (err) {
      throw err;
   }
}

const shareNote = async ({ id, noteId }) => {
   try {
      const client = await pool.connect();
      const link = crypto.randomBytes(16).toString('hex');

      const sharedNote = await pool.query(
         `INSERT INTO Shared (link, person_id, note_id) VALUES ($1, $2, $3) RETURNING *`, [link, id, noteId]
      );

      client.release();
      return [sharedNote.rows, link];
   } catch (err) {
      throw err;
   }
}

const getShareNote = async ({ link }) => {
   try {
      const client = await pool.connect();
      const note = await pool.query(
         `SELECT n.title, n.body FROM Shared AS sh JOIN Note AS n ON sh.note_id = n.id
               WHERE sh.link = $1`, [link]
      );

      client.release();
      return note.rows;
   } catch (err) {
      throw err;
   }
}

module.exports = {
   createNote,
   getNotes,
   updateNote,
   deleteNote,
   shareNote,
   getShareNote
}
