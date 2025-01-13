const express = require("express");
const session = require("express-session");
const articleRouter = require("./article/articleRouter");
const commentRouter = require("./comment/commentRouter");

const app = express();

app.use(express.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/articles", articleRouter);
app.use("/comments", commentRouter);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
