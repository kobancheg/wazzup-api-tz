require('dotenv').config();
const logger = require('./config/logger');
const config = require('./config/environment');
const { redisClient } = require('./config/db');
const authRouter = require('./routes/authRouter');

const express = require('express');
const session = require('express-session');
const connectRedis = require('connect-redis');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const RedisStore = connectRedis(session);

app.use(session({
   store: new RedisStore({ client: redisClient }),
   secret: config.secret,
   resave: false,
   saveUninitialized: false,
   cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 10
   }
}));

app.use('/auth', authRouter);

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
