const express = require("express");
const session = require("express-session");
const articlesRouter = require("./articles/articleRouter"); // 라우터 경로 수정 필요
const db = require("./utils/dbConnect");

const app = express();
const PORT = process.env.PORT || 8000;

(async () => {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("MariaDB 연결 성공:", rows);
  } catch (err) {
    console.error("MariaDB 연결 실패:", err.message);
  }
})();

app.use(express.json());
app.use(
  session({
    secret: 1234,
    resave: false,
    saveUninitialized: false,
  })
);

const TEST_USER = {
  username: "test",
  password: "1234",
  name: "테스트 유저",
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === TEST_USER.username && password === TEST_USER.password) {
    req.session.user = {
      username: TEST_USER.username,
      name: TEST_USER.name,
    };
    res.status(200).send({
      message: "로그인 성공",
      user: req.session.user,
    });
  } else {
    res
      .status(401)
      .send({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
  }
});

app.get("/protected", (req, res) => {
  if (req.session && req.session.user) {
    res
      .status(200)
      .send({ message: `안녕하세요, ${req.session.user.name}님!` });
  } else {
    res.status(401).send({ message: "로그인이 필요합니다." });
  }
});

app.use("/articles", articlesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
