const winston = require('winston');
const Transport = require('winston-transport');

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

class CustomTransport extends Transport {
  constructor(opts) {
    super(opts)
  }

  log(data, callback) {
    if (process.env.NODE_ENV !== 'production') return;
    winston.log(data);
    callback();
  }
};

const transport = new CustomTransport();

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  transports: [
    transport,
    new transports.Console({
      format: combine(timestamp(), colorize(), customFormat),
    }),
    new transports.File({
      format: combine(timestamp(), customFormat),
      filename: './.log/combined.log',
    }),
    new transports.File({
      format: combine(timestamp(), customFormat),
      filename: './.log/errors.log', level: 'error'
    })
  ]
});

module.exports = logger;
