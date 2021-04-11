process.env.NODE_ENV = 'test';

const request = require('supertest');
const server = require('../app');
const { pool } = require('../config/db');
const logger = require('../config/logger');

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

      it('регистрация пользователя, авторизация, разлогин', (done) => {

         request(server)
            .post('/auth/registration')
            .set('Content-Type', 'application/json')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200, '{"message":"Sebastian Вы успешно зарегистрированы"}')

            .end((err, res) => {
               logger.info(res.body);
               logger.info('логиниммся под ним');
               request(server)
                  .post('/auth/login')
                  .send({
                     'email': 'test@test.com',
                     'password': 'qwerty'
                  })
                  .expect('Content-Type', /json/)
                  .expect(200, '{"message":"Sebastian Вы успешно авторизовались"}')

                  .end((err, res) => {
                     logger.info(res.body);
                     logger.info('разлогин и удаление сессий пользователя');
                     request(server)
                        .get('/auth/logout')
                        .expect('Content-Type', /json/)
                        .expect(200, '{"message":"До новых встреч!"}')
                        .end((err, res) => {
                           logger.info(res.body);
                           done()
                        })
                  })
            })
      })
   })
})
