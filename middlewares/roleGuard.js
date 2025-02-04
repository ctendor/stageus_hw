const asyncWrapper = require("../utils/asyncWrapper");
const customError = require("../utils/customError");

module.exports = (requiredRole) => {
  return asyncWrapper(async (req, res, next) => {
    if (!req.user) {
      throw customError("로그인이 필요합니다.", 401);
    }
    if (req.user.role !== requiredRole) {
      throw customError("권한이 없습니다.", 403);
    }
    next();
  });
};
