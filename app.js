require('dotenv').config();
const logger = require('./config/logger');
const session = require('express-session');
const middlewareSessions = require('./middleware/sessions');

const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(session(middlewareSessions));

const authRouter = require('./routes/authRouter');
const notesRouter = require('./routes/noteRouter');

app.use('/auth', authRouter);
app.use('/api', notesRouter);

app.get('/', (req, res) => {
   const resault = req.session;
   res.json({ resault })
})

const init = () => {
   try {
      app.listen(PORT, () => logger.info(`Server start at port ${PORT}`));
   } catch (err) {
      logger.error(err.stack);
   }
}

init();
