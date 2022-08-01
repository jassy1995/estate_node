require("dotenv").config();
module.exports = function () {
  if (!process.env.OTP) {
    throw new Error("FATAL ERROR: OTP  is not defined .");
  }
};
