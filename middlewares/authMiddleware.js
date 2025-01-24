const customError = require("../utils/customError");
const asyncWrapper = require("../utils/asyncWrapper");

const authMiddleware = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    throw customError("로그인이 필요합니다.", 401);
  }

  console.log("세션 사용자 정보:", req.session.user);
  req.user = req.session.user;

  next();
};

module.exports = asyncWrapper(authMiddleware);
