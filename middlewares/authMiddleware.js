const customError = require("../utils/customError");

const authMiddleware = (req, res, next) => {
  try {
    const sessionCookie = req.cookies["connect.sid"];
    console.log("요청받은 쿠키:", sessionCookie);
    console.log("세션 정보:", req.session);

    if (!req.session && !sessionCookie) {
      throw customError("세션이 존재하지 않습니다. 다시 로그인해주세요.", 401);
    }

    if (!req.session?.user) {
      throw customError("로그인이 필요합니다.", 401);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
