const express = require("express");
const db = require("../utils/dbConnect");
const customError = require("../utils/customError");
const asyncWrapper = require("../utils/asyncWrapper");

const router = express.Router();

router.post(
  "/",
  asyncWrapper(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw customError("아이디와 비밀번호를 모두 입력해야 합니다.", 400);
    }

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

    req.session.user = {
      id: user.id,
      username: user.username,
      name: user.name,
    };

    res.status(200).send({
      message: "로그인 성공",
      user: req.session.user,
    });
  })
);

module.exports = router;
