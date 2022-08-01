const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, splat, json } = format;
const winstonTimestampColorize = require("winston-timestamp-colorize");

const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `{ time: ${timestamp} level: ${level} message: ${message} stack: ${stack} }`;
});

function developmentLogger() {
  const logger = createLogger({
    format: combine(
      splat(),
      timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
      colorize(),
      winstonTimestampColorize({ color: "blue" }),
      myFormat
    ),
    transports: [
      new transports.File({
        filename: "logs/error.log",
        level: "error",
      }),
      new transports.Console({}),
    ],
    exceptionHandlers: [
      new transports.File({ filename: "logs/exceptions.log", level: "error" }),
      new transports.Console(),
    ],
    rejectionHandlers: [
      new transports.File({ filename: "logs/rejections.log", level: "error" }),
      new transports.Console(),
    ],
    exitOnError: false,
  });

  return logger;
}

module.exports = developmentLogger;
