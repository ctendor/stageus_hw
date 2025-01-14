const express = require("express");
const db = require("../utils/dbConnect");
const customError = require("../utils/customError");
const asyncWrapper = require("../utils/asyncWrapper");
const { usernameRegx, passwordRegx } = require("../constants/regx");

const router = express.Router();

router.post(
  "/",
  asyncWrapper(async (req, res) => {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
      throw customError("모든 필드를 입력해야 합니다.", 400);
    }

    if (!usernameRegx.test(username)) {
      throw customError("유효하지 않은 사용자 이름 형식입니다.", 400);
    }

    if (!passwordRegx.test(password)) {
      throw customError(
        "비밀번호는 최소 6자 이상이어야 하며 대문자, 소문자, 특수문자를 포함해야 합니다.",
        400
      );
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      throw customError("이미 존재하는 사용자입니다.", 409);
    }

    const [result] = await db.query(
      "INSERT INTO users (username, password, name, createdAt) VALUES (?, ?, ?, NOW())",
      [username, password, name]
    );

    if (!result.insertId) {
      throw customError("회원가입에 실패했습니다.", 500);
    }

    res.status(201).send({ message: "회원가입이 완료되었습니다." });
  })
);

module.exports = router;
