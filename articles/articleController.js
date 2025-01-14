const customError = require("../utils/customError");
const asyncWrapper = require("../utils/asyncWrapper");
const articleService = require("./articleService");
const { idxRegx, titleRegx, categoryRegx } = require("../constants/regx");

const createArticle = asyncWrapper(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    throw customError("제목, 내용, 카테고리를 모두 입력해주세요.", 400);
  }
  if (!titleRegx.test(title)) {
    throw customError("제목은 1~20자이어야 합니다.", 400);
  }
  if (!categoryRegx.test(String(category))) {
    throw customError("유효하지 않은 카테고리입니다.", 400);
  }

  const newArticle = await articleService.createArticle({
    title,
    content,
    category,
  });

  res.status(201).send({
    message: "게시글이 생성되었습니다.",
    articleIdx: newArticle,
  });
});

const getArticle = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!idxRegx.test(id)) {
    throw customError("유효하지 않은 IDX입니다.", 400);
  }

  const article = await articleService.getArticleById(id);
  if (!article) {
    throw customError("게시글을 찾을 수 없습니다.", 404);
  }

  res.status(200).send(article);
});

const updateArticle = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  if (!idxRegx.test(id)) {
    throw customError("유효하지 않은 IDX입니다.", 400);
  }
  if (title && !titleRegx.test(title)) {
    throw customError("제목은 1~20자이어야 합니다.", 400);
  }
  if (category && !categoryRegx.test(String(category))) {
    throw customError("유효하지 않은 카테고리입니다.", 400);
  }

  await articleService.updateArticle(id, { title, content, category });

  res.status(200).send({ message: "게시글이 수정되었습니다." });
});

const deleteArticle = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!idxRegx.test(id)) {
    throw customError("유효하지 않은 IDX입니다.", 400);
  }

  await articleService.deleteArticle(id);

  res.status(200).send({ message: "게시글이 삭제되었습니다." });
});

const likeArticle = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!idxRegx.test(id)) {
    throw customError("유효하지 않은 IDX입니다.", 400);
  }

  const likes = await articleService.likeArticle(id);
  res.status(200).send({ message: "게시글에 좋아요를 눌렀습니다.", likes });
});

const unlikeArticle = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!idxRegx.test(id)) {
    throw customError("유효하지 않은 IDX입니다.", 400);
  }

  const likes = await articleService.unlikeArticle(id);
  res.status(200).send({ message: "게시글 좋아요가 취소되었습니다.", likes });
});

module.exports = {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
};
