const Joi = require("joi");

function validateRegister(data) {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).max(80).required(),
  });
  return schema.validate(data);
}

module.exports = validateRegister;
