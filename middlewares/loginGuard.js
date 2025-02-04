const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");
const asyncWrapper = require("../utils/asyncWrapper");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyJwt = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(customError("인증 실패", 401));
      resolve(decoded);
    });
  });
};

module.exports = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw customError("토큰이 없습니다.", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw customError("유효하지 않은 토큰 형식입니다.", 401);
  }

  const decoded = await verifyJwt(token, JWT_SECRET);
  req.user = {
    id: decoded.id,
    role: decoded.role || "user",
  };
  next();
});
