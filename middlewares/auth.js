const customError = require("../utils/customError");

const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return next(customError("로그인이 필요합니다.", 401));
  }
  if (req.session.user != req.user) {
    return next(customError("권한이 없습니다"), 403);
  }
  next();
};

module.exports = authMiddleware;
