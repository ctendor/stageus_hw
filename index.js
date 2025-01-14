const express = require("express");
const session = require("express-session");
const articlesRouter = require("./articles/articleRouter");
const db = require("./utils/dbConnect");
const registerRoutes = require("./users/register");
const loginRoutes = require("./users/login");
const cookieParser = require("cookie-parser");

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

app.get("/protected", (req, res) => {
  const sessionCookie = req.cookies["connect.sid"];
  console.log("요청받은 쿠키:", sessionCookie);
  console.log("세션 정보:", req.session);

  if (!req.session?.user && !sessionCookie) {
    return res.status(401).send({ message: "로그인이 필요합니다." });
  }

  res.status(200).send({
    message: "안녕하세요",
  });
});

app.use("/articles", articlesRouter);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
