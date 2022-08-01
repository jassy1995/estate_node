require("express-async-errors");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const propertyRoute = require("../routes/property.route");
const error = require("../middleware/error");


module.exports = function (app) {
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(helmet());
  app.use(
    fileUpload({
      useTempFiles: true,
    })
  );

  app.use("/api/properties", propertyRoute);
  app.use(error);
};
