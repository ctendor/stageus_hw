const express = require("express");
const session = require("express-session");
const articlesRouter = require("./articles/articleRouter");
const commentRouter = require("./comments/commentRouter");
const userRouter = require("./users/userRouter");
const logRouter = require("./logs/logRouter");
const customError = require("./utils/customError");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 8000;
//app.use(dbMiddleware);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1시간
    },
  })
);

app.use("/articles", articlesRouter);
app.use("/comments", commentRouter);
app.use("/users", userRouter);
app.use("/log", logRouter);

app.use(notFoundMiddleware);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
