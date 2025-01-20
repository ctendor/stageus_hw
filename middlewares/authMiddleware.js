const customError = require("../utils/customError");

const authMiddleware = (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      throw customError("로그인이 필요합니다.", 401);
    }

    console.log("세션 사용자 정보:", req.session.user);

    req.user = req.session.user;

    next();
  } catch (err) {
    console.error("세션 인증 실패:", err.message);
    next(customError("유효하지 않은 세션입니다.", 403));
  }
};

module.exports = authMiddleware;
