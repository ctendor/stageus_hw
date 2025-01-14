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

    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded;

    next();
  } catch (err) {
    next(customError("유효하지 않은 토큰입니다.", 403));
  }
};

module.exports = authMiddleware;
