import winston from 'winston';

const { combine, timestamp, printf, json } = winston.format;

const customFormat = printf(({ level, message, timestamp, traceId, ...metadata }) => {
  let msg = `${timestamp} [${level}]`;
  if (traceId) {
    msg += ` [traceId: ${traceId}]`;
  }
  msg += `: ${message} `;
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    json() // Enforce structured JSON logging globally as requested
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        winston.format.colorize(),
        timestamp(),
        customFormat
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
