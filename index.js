const express = require("express");
const session = require("express-session");
const articlesRouter = require("./routes/articles");
const authMiddleware = require("./middlewares/auth");
const app = express();

const maria = require("./database/connect/maria");
maria.connect();

const PORT = process.env.PORT || 8000;

app.use(
  session({
    secret: "세션 키",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(express.json());

app.use("/articles", articlesRouter);

app.post("/login", (req, res) => {
  req.session.user = {
    userId: "test",
    name: "테스트",
  };
});
app.get("/", (req, res) => {
  res.send("Express.js 서버가 정상적으로 실행되고 있습니다!");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
