const articleService = require("./articleService");
const asyncWrapper = require("../utils/asyncWrapper");
const customError = require("../utils/customError");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { titleRegx, categoryRegx, contentRegx } = require("../constants/regx");

const createArticle = [
  validateRequest({
    body: {
      title: { regex: titleRegx, required: true },
      content: { regex: contentRegx, required: true },
      category: { regex: categoryRegx, required: true },
    },
  }),
  asyncWrapper(async (req, res) => {
    const { title, content, category } = req.body;
    const { id: authorIdx } = req.user;

    const newArticle = await articleService.createArticle({
      title,
      content,
      category,
      authorIdx,
    });

    res.status(201).send({
      message: "게시글이 생성되었습니다.",
      articleIdx: newArticle,
    });
  }),
];

const getArticle = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const article = await articleService.getArticleById(id);
  if (!article) {
    throw customError("게시글을 찾을 수 없습니다.", 404);
  }

  res.status(200).send(article);
});

const getArticles = asyncWrapper(async (req, res) => {
  const articles = await articleService.getArticles();
  res.status(200).send(articles);
});

const updateArticle = [
  validateRequest({
    body: {
      title: { regex: titleRegx, required: false },
      content: { regex: contentRegx, required: false },
      category: { regex: categoryRegx, required: false },
    },
  }),
  asyncWrapper(async (req, res) => {
    const { articleId } = req.params;
    const { title, content, category } = req.body;
    const { id: authorIdx } = req.user;

    const article = await articleService.getArticleById(articleId);

    if (article.authorIdx !== authorIdx) {
      throw customError("게시글 수정 권한이 없습니다.", 403);
    }

    await articleService.updateArticle(articleId, { title, content, category });

    res.status(200).send({ message: "게시글이 수정되었습니다." });
  }),
];

const deleteArticle = asyncWrapper(async (req, res) => {
  const { articleId } = req.params;
  const { id: authorIdx } = req.user;

  const article = await articleService.getArticleById(articleId);

  if (article.authorIdx !== authorIdx) {
    throw customError("게시글 삭제 권한이 없습니다.", 403);
  }

  await articleService.deleteArticle(articleId);

  res.status(200).send({ message: "게시글이 삭제되었습니다." });
});

const likeArticle = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const likes = await articleService.likeArticle(id, userId);
  res.status(200).send({ message: "게시글에 좋아요를 눌렀습니다.", likes });
});

const unlikeArticle = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const likes = await articleService.unlikeArticle(id, userId);
  res.status(200).send({ message: "게시글 좋아요가 취소되었습니다.", likes });
});

module.exports = {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
};
