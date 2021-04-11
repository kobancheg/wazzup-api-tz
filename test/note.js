process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../app');
const { pool } = require('../config/db');

chai.use(chaiHttp);

var agent = chai.request.agent(app)

describe('Note', () => {
   const note = {
      title: 'Тестовая заметка',
      body: `Многие думают, что Lorem Ipsum - взятый с потолка псевдо-латинский набор слов,
      но это не совсем так. Его корни уходят в один фрагмент классической латыни 45 года н.э.`,
      user_id: 1
   }

   beforeEach(async () => {
      const db = await pool.connect();
      await db.query('DELETE FROM Person');
      await db.query('DELETE FROM Note');
   });

   describe('/POST note', () => {

      it('Cоздаём заметку', () => {
         agent
            .post('/auth/registration')
            .send({
               name: 'Sebastian',
               email: 'test@test.com',
               password: 'qwerty'
            })
            .end((err, res) => {
               return agent
                  .post('/auth/login')
                  .send({
                     email: "test@test.com",
                     password: "qwerty"
                  })
                  .end((err, res) => {
                     return agent
                        .post('/api/note/create')
                        .send(note)
                        .end((err, res) => {
                           expect(res).to.have.status(200);
                           expect(res).to.be.json;
                        });
                  });
            });
      })
   })
})
