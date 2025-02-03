// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");

// 예: 실제 키는 .env에서 불러오기
const JWT_SECRET = process.env.JWT_SECRET || "YOUR_JWT_SECRET";

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // "Bearer <token>"
    if (!authHeader) {
      throw customError("토큰이 없습니다.", 401);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw customError("잘못된 토큰 형식입니다.", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    // req.user에 user id, role 등 정보 할당
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    // 유효하지 않은 토큰 → 401
    return res.status(err.statusCode || 401).json({ message: err.message });
  }
};
