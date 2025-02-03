// middlewares/roleGuard.js
const customError = require("../utils/customError");

// requiredRole: 'admin', 'manager', 'user' 등
module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      // loginGuard를 안 거쳤거나, 토큰 검증 실패
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    if (req.user.role !== requiredRole) {
      // 권한 불충분
      throw customError("권한이 없습니다.", 403);
    }
    next();
  };
};
