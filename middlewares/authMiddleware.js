const customError = require("../utils/customError");

const authMiddleware = (req, res, next) => {
  try {
    // 세션 확인
    if (!req.session || !req.session.user) {
      throw customError("로그인이 필요합니다.", 401); // 401 Unauthorized
    }

    // 세션에서 사용자 정보 가져오기
    console.log("세션 사용자 정보:", req.session.user);

    // 사용자 정보를 요청 객체에 저장
    req.user = req.session.user;

    next(); // 다음 미들웨어로 이동
  } catch (err) {
    console.error("세션 인증 실패:", err.message);
    next(customError("유효하지 않은 세션입니다.", 403)); // 403 Forbidden
  }
};

module.exports = authMiddleware;
