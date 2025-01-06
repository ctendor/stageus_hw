const express = require("express");
const articlesRouter = require("./routes/articles");
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use("/articles", articlesRouter);

app.get("/", (req, res) => {
  res.send("Express.js 서버가 정상적으로 실행되고 있습니다!");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
