// middlewares/loginGuard.js
const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");

// 예시: .env나 constants.js에서 불러옴
const JWT_SECRET = process.env.JWT_SECRET || "YOUR_JWT_SECRET";

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // 예: 'Bearer <token>'
    if (!authHeader) {
      throw customError("토큰이 없습니다.", 401);
    }

    // "Bearer " 제거
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw customError("유효하지 않은 토큰 형식입니다.", 401);
    }

    // JWT 검증
    const decoded = jwt.verify(token, JWT_SECRET);
    // 예: { id: 123, role: 'admin', iat: 1660000000, exp: 1660003600 }

    // req.user에 주입
    req.user = {
      id: decoded.id,
      role: decoded.role || "user",
    };

    next();
  } catch (err) {
    // jwt.verify 실패 or 토큰이 없으면 401
    return res.status(err.statusCode || 401).json({
      message: err.message || "인증 실패",
    });
  }
};
