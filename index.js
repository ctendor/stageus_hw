const express = require("express");
const session = require("express-session");
const articlesRouter = require("./articles/articleRouter");
const db = require("./utils/dbConnect");
const registerRoutes = require("./users/register");
const loginRoutes = require("./users/login");

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
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
