require('dotenv').config();
const logger = require('./config/logger');

const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const init = () => {
   try {
      app.listen(PORT, () => logger.info(`Server start at port ${PORT}`));
   } catch (err) {
      logger.error(err.stack);
   }
}

init();
