require("dotenv").config();
const { mongoURI } = process.env;
const winston = require("../loggers");
const mongoose = require("mongoose");
module.exports = function () {
  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
    })
    .then(() => {
      winston.info("Connected successfully");
    })
    .catch((err) => {
      winston.info("unable to connect to the database");
      console.log(err.message);
    });
};
