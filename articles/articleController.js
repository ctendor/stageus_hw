const asyncWrapper = require("../utils/asyncWrapper");
const articleService = require("./articleService");

const createArticle = asyncWrapper(async (req, res) => {
  const { title, content, category } = req.body;
  const newArticle = await articleService.createArticle({
    title,
    content,
    category,
  });
  res.status(201).send({
    message: "게시글이 생성되었습니다.",
    articleIdx: newArticle.articleIdx,
  });
});

const getArticles = asyncWrapper(async (req, res) => {
  const articles = await articleService.getArticles(req.query);
  res.status(200).send({ articles });
});

const getArticleById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const article = await articleService.getArticleById(id);
  res.status(200).send({ article });
});

const updateArticle = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;
  await articleService.updateArticle(id, { title, content, category });
  res.status(200).send({ message: "게시글이 수정되었습니다." });
});

const deleteArticle = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await articleService.deleteArticle(id);
  res.status(200).send({ message: "게시글이 삭제되었습니다." });
});

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
