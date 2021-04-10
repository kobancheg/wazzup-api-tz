process.env.NODE_ENV = 'test';

const request = require('supertest');
const server = require('../app');
const { pool } = require('../config/db');

describe('User', () => {
   beforeEach(async () => {
      const db = await pool.connect();
      await db.query('DELETE FROM Person');
   });

   describe('/POST user', () => {
      const user = {
         name: 'Sebastian',
         email: 'test@test.com',
         password: 'qwerty'
      }

      it('создаём пользователя', (done) => {
         request(server)
            .post('/auth/registration')
            .set('Content-Type', 'application/json')
            .send(user)
            .expect(200, '{"message":"Sebastian Вы успешно зарегистрированы"}', done)
      })
   })
})
