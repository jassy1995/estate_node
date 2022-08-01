const express = require("express");
const winston = require("./loggers");
const app = express();

require("dotenv").config();
require("./util/db")();
require("./util/middleware&route")(app);
require("./util/config")();


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  winston.info(`Server is running at port ${PORT}`);
});
