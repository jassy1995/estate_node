const Joi = require("joi");

function validateCreatePost(data) {
  const schema = Joi.object({
    userId: Joi.string().trim().required(),
  });
  return schema.validate(data);
}

module.exports = validateCreatePost;
