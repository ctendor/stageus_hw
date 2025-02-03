const express = require("express");
const articlesRouter = require("./articles/articleRouter");
const commentRouter = require("./comments/commentRouter");
const userRouter = require("./users/userRouter");
const logRouter = require("./logs/logRouter");
const customError = require("./utils/customError");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const errorHandler = require("./middlewares/errorHandler");
const logMiddleware = require("./middlewares/logMiddleware");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// 모든 요청에 대해 로깅 수행
app.use(logMiddleware);

app.use("/articles", articlesRouter);
app.use("/comments", commentRouter);
app.use("/users", userRouter);
app.use("/log", logRouter);

app.use(notFoundMiddleware);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
