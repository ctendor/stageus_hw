const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");
const asyncWrapper = require("../utils/asyncWrapper");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw customError("토큰이 없습니다.", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw customError("잘못된 토큰 형식입니다.", 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    // JWT 검증 실패 시 직접 에러 메시지와 상태 코드를 설정
    throw customError("유효하지 않은 토큰입니다.", 401);
  }
});
