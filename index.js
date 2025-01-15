const express = require("express");
const session = require("express-session");
const articlesRouter = require("./articles/articleRouter");
const db = require("./utils/dbConnect");
const registerRoutes = require("./users/register");
const loginRoutes = require("./users/login");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: 1234,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: true,
    },
  })
);

const SECRET_KEY = process.env.JWT_SECRET || "my-secret-key";

app.get("/protected", (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // Authorization 헤더 확인
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw customError("인증 토큰이 필요합니다.", 401);
    }
    const token = authHeader.split(" ")[1];
    console.log("요청받은 토큰:", token);

    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("디코딩된 사용자 정보:", decoded);

    res.status(200).send({
      message: `안녕하세요, ${decoded.username}님!`,
    });
  } catch (err) {
    console.error("토큰 검증 실패:", err.message);
    res.status(403).send({ message: "유효하지 않은 토큰입니다." });
  }
});
app.use("/articles", articlesRouter);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
