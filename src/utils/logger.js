import * as winston from 'winston';

const {createLogger, format, transports} = winston;
const {combine, splat, printf} = format;

const myFormat = printf(({level, message, timestamp, ...metadata}) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (metadata && Object.keys(metadata).length !== 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

const logger = createLogger({
  level: 'debug',
  format: combine(format.colorize(), splat(), format.timestamp(), myFormat),
  transports: [new transports.Console({level: 'info'})],
});

export default logger;
