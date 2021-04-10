process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const request = require('supertest');
const server = require('../app');
const { pool } = require('../config/db');

describe('Note', () => {
   beforeEach(async () => {
      const db = await pool.connect();
      await db.query('DELETE FROM Person');
      await db.query('DELETE FROM Note');
   });

   describe('/POST note', () => {
      const note = {
         title: 'Тестовая заметка',
         body: `Многие думают, что Lorem Ipsum - взятый с потолка псевдо-латинский набор слов,
         но это не совсем так. Его корни уходят в один фрагмент классической латыни 45 года н.э.`,
         user_id: 1
      }

      it('создаём заметку', (done) => {
         request(server)
            .post('/api/note/create')
            .send(note)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
      })
   })
})
