const {
  addArticle,
  findArticleByIdx,
  updateArticle,
  deleteArticle,
  getArticles,
  likeArticle,
  unlikeArticle,
} = require("../repositories/articlesRepository");
const customError = require("../utils/customError");
const { idxRegx, titleRegx, categoryRegx } = require("../constants/regx");

const validateArticleInput = ({ title, content, category }) => {
  if (!title || !content || !category)
    throw customError("제목, 내용, 카테고리를 모두 입력해주세요.", 400);
  if (!titleRegx.test(title))
    throw customError("제목은 1~20자이어야 합니다.", 400);
  if (!categoryRegx.test(String(category)))
    throw customError(
      "유효하지 않은 카테고리입니다. (1: 공지사항, 2: 자유게시판)",
      400
    );
};

const createArticle = (req, res) => {
  try {
    const { title, content, category } = req.body;
    validateArticleInput({ title, content, category });
    const newArticle = addArticle({
      title,
      content,
      category: parseInt(category),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
    });
    res.status(201).send({
      message: "게시글이 생성되었습니다.",
      articleIdx: newArticle.articleIdx,
    });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

const getArticle = (req, res) => {
  try {
    const { id } = req.params;
    if (!idxRegx.test(id)) throw customError("유효하지 않은 IDX입니다.", 400);
    const article = findArticleByIdx(parseInt(id));
    if (!article) throw customError("게시글을 찾을 수 없습니다.", 404);
    res.send(article);
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

const updateArticleController = (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    if (!idxRegx.test(id)) throw customError("유효하지 않은 IDX입니다.", 400);
    const article = findArticleByIdx(parseInt(id));
    if (!article) throw customError("게시글을 찾을 수 없습니다.", 404);
    if (title && !titleRegx.test(title))
      throw customError("제목은 1~20자이어야 합니다.", 400);
    if (category && !categoryRegx.test(String(category)))
      throw customError(
        "유효하지 않은 카테고리입니다. (1: 공지사항, 2: 자유게시판)",
        400
      );
    const updatedArticle = updateArticle(parseInt(id), {
      title: title || article.title,
      content: content || article.content,
      category: category ? parseInt(category) : article.category,
      updatedAt: new Date().toISOString(),
    });
    res.send({ message: "게시글이 수정되었습니다." });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

const deleteArticleController = (req, res) => {
  try {
    const { id } = req.params;
    if (!idxRegx.test(id)) throw customError("유효하지 않은 IDX입니다.", 400);
    const article = findArticleByIdx(parseInt(id));
    if (!article) throw customError("게시글을 찾을 수 없습니다.", 404);
    deleteArticle(parseInt(id));
    res.send({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

const getArticlesList = (req, res) => {
  try {
    const { search = "", category } = req.query;
    let filteredArticles = getArticles();

    if (search) {
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.includes(search) || article.content.includes(search)
      );
    }

    if (category) {
      if (!categoryRegx.test(String(category)))
        throw customError(
          "유효하지 않은 카테고리입니다. (1: 공지사항, 2: 자유게시판)",
          400
        );
      filteredArticles = filteredArticles.filter(
        (article) => article.category === parseInt(category)
      );
    }

    res.send({
      articles: filteredArticles.map((article) => ({
        articleIdx: article.articleIdx,
        title: article.title,
        category: article.category,
        createdAt: article.createdAt,
        likes: article.likes,
      })),
    });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

const likeArticleController = (req, res) => {
  try {
    const { id } = req.params;
    if (!idxRegx.test(id)) throw customError("유효하지 않은 IDX입니다.", 400);
    const likes = likeArticle(parseInt(id));
    res.send({ message: "게시글에 좋아요를 눌렀습니다.", likes });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

const unlikeArticleController = (req, res) => {
  try {
    const { id } = req.params;
    if (!idxRegx.test(id)) throw customError("유효하지 않은 IDX입니다.", 400);
    const likes = unlikeArticle(parseInt(id));
    res.send({ message: "게시글 좋아요가 취소되었습니다.", likes });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

module.exports = {
  createArticle,
  getArticle,
  updateArticleController,
  deleteArticleController,
  getArticlesList,
  likeArticleController,
  unlikeArticleController,
};
