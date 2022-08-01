const productionLogger = require("./productionLogger");
const developmentLogger = require("./developmentLogger");
require("dotenv").config();

let logger = null;
const { NODE_ENV, mongoURI } = process.env;

if (NODE_ENV === "production") {
  logger = productionLogger(mongoURI);
} else {
  logger = developmentLogger();
}

module.exports = logger;
