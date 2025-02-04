const asyncWrapper = require("../utils/asyncWrapper");
const customError = require("../utils/customError");

const validateRequest = (rules) => {
  return asyncWrapper(async (req, res, next) => {
    const { body } = req;

    if (rules.body) {
      for (const [field, rule] of Object.entries(rules.body)) {
        const value = body[field];

        if (rule.required && (value === undefined || value === null)) {
          throw customError(`${field} 값이 누락되었습니다.`, 400);
        }

        if (
          value !== undefined &&
          rule.regex &&
          !rule.regex.test(String(value))
        ) {
          throw customError(`${field} 값이 유효하지 않습니다.`, 400);
        }
      }
    }

    next();
  });
};

module.exports = { validateRequest };
