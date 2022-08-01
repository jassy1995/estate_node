const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, splat, json } = format;
const winstonTimestampColorize = require("winston-timestamp-colorize");
require("winston-mongodb");

const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `{ time: ${timestamp} level: ${level} message: ${message} stack: ${stack} }`;
});

function productionLogger(db) {
  const logger = createLogger({
    level: "debug",
    format: combine(
      timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
      winstonTimestampColorize({ color: "blue" }),
      myFormat
    ),
    transports: [
      new transports.File({
        filename: "logs/errors.log",
        level: "error",
      }),
      new transports.MongoDB({
        db,
        level: "error",
        options: { useUnifiedTopology: true },
      }),
      new transports.Console(),
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
module.exports = productionLogger;
