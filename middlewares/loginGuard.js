const asyncWrapper = require("../utils/asyncWrapper");
const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization; // 예: 'Bearer <token>'
  if (!authHeader) {
    throw customError("토큰이 없습니다.", 401);
  }

  // "Bearer " 분리
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw customError("유효하지 않은 토큰 형식입니다.", 401);
  }

  // JWT 검증
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role || "user",
    };
    next();
  } catch (err) {
    throw customError("인증 실패", 401);
  }
});
