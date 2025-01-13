const customError = require("../utils/customError");

const validationMiddleware = (validationRules) => {
  return (req, res, next) => {
    try {
      validationRules.forEach((rule) => {
        const { field, validator, message } = rule;
        if (!validator(req[field])) {
          throw customError(message, 400);
        }
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = validationMiddleware;
