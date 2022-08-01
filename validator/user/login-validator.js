const Joi = require("joi");

function validateLogin(data) {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
}

module.exports = validateLogin;
