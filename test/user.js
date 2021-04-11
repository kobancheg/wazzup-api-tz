process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../app');
const { pool } = require('../config/db');

chai.use(chaiHttp);

describe('User', () => {
   before(async () => {
      const db = await pool.connect();
      await db.query('DELETE FROM Person');
   });

   describe('POST /registration', () => {

      it('Регистрация пользователя', (done) => {
         chai.request(app)
            .post('/auth/registration')
            .send({
               name: 'Sebastian',
               email: 'test@test.com',
               password: 'qwerty'
            })
            .end((err, res) => {
               expect(res).to.have.status(200);
               expect(res).to.be.json;
               expect(res.body).to.deep.equal({ "message": "Sebastian Вы успешно зарегистрированы" });
               done();
            });
      });
   })

   describe('POST /login', () => {

      it('Не зарегистрированный пользвоатель не может войти в систему', (done) => {
         chai.request(app)
            .post('/auth/login', { email: 'test@test.com', password: 'qwerty' })
            .end((err, res) => {
               expect(res).to.have.status(401);
               done();
            });
      });

      it('Авторизация пользователя', (done) => {
         chai.request(app)
            .post('/auth/login')
            .send({
               email: "test@test.com",
               password: "qwerty"
            })
            .end((err, res) => {
               expect(res).to.have.status(200);
               expect(res).to.be.json;
               expect(res.body).to.deep.equal({ "message": "Sebastian Вы успешно авторизовались" });
               done();
            });
      });
   })
})
