const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");

const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw customError("인증 토큰이 필요합니다.", 401);
    }

    const token = authHeader.split(" ")[1];
    console.log("요청된 토큰:", token);

    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("디코딩된 사용자 정보:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("토큰 검증 실패:", err.message);
    next(customError("유효하지 않은 토큰입니다.", 403));
  }
};

module.exports = authMiddleware;
