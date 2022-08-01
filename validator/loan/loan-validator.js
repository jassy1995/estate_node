const Joi = require("joi");

function validateLoanDetail(loanObject) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    first_grantor: Joi.string().trim().email({ minDomainAtoms: 2 }).required(),
    second_grantor: Joi.string().trim().email({ minDomainAtoms: 2 }).required(),
    amount: Joi.number().required(),
  });
  return schema.validate(loanObject);
}

module.exports = validateLoanDetail;
