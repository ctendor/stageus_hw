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

app.use("/articles", articlesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
