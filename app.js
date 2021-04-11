require('dotenv').config();
const logger = require('./config/logger');
const instanceSessions = require('./libs/sessions');
const isAuth = require('./middleware/authentication');

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.json());
app.use(cors());
app.use(session(instanceSessions));

const authRouter = require('./routes/authRouter');
const notesRouter = require('./routes/noteRouter');

app.use('/auth', authRouter);
app.use('/api', isAuth, notesRouter);
app.use('/free', notesRouter);

const init = () => {
   try {
      app.listen(PORT, () => logger.info(`Server start at port ${PORT}`));
   } catch (err) {
      logger.error(err.stack);
   }
}

init();

module.exports = app.listen(PORT, () => {
   console.log(`Server running at http://localhost:${PORT}`);
});
