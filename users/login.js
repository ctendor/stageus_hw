const express = require("express");
const db = require("../utils/dbConnect");
const customError = require("../utils/customError");
const asyncWrapper = require("../utils/asyncWrapper");
const jwt = require("jsonwebtoken");

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = "1h"; // 엑세스 토큰 만료 시간 (1시간)

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 사용자 확인
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (users.length === 0) {
      throw customError("존재하지 않는 사용자입니다.", 404);
    }

    const user = users[0];
    if (user.password !== password) {
      throw customError("비밀번호가 올바르지 않습니다.", 401);
    }

    // JWT 토큰 생성
    const accessToken = jwt.sign(
      { id: user.idx, username: user.username }, // 페이로드
      SECRET_KEY, // 비밀키
      { expiresIn: TOKEN_EXPIRATION } // 만료 시간
    );

    res.status(200).send({
      message: "로그인 성공",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
