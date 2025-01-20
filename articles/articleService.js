const db = require("../utils/dbConnect");
const customError = require("../utils/customError");

const validateInputs = (inputs) => {
  for (const [key, value] of Object.entries(inputs)) {
    if (value === undefined || value === null) {
      throw customError(`${key} 값이 누락되었습니다.`, 400);
    }
  }
};

const createArticle = async ({ title, content, category, authorIdx }) => {
  validateInputs({ title, content, category, authorIdx });

  const [result] = await db.query(
    "INSERT INTO articles (title, content, category, authorIdx, likes, createdAt, updatedAt) VALUES (?, ?, ?, ?, 0, NOW(), NOW())",
    [title, content, category, authorIdx]
  );

  if (!result.insertId) {
    throw customError("게시글 생성에 실패했습니다.", 500);
  }

  return result.insertId;
};

const getArticles = async ({ search, category }) => {
  let query = "SELECT * FROM articles WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (title LIKE ? OR content LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  const [articles] = await db.query(query, params);
  return articles;
};

const getArticleById = async (articleId) => {
  validateInputs({ articleId });

  const [articles] = await db.query("SELECT * FROM articles WHERE idx = ?", [
    articleId,
  ]);

  if (articles.length === 0) {
    throw customError("해당 ID의 게시글을 찾을 수 없습니다.", 404);
  }

  return articles[0];
};

const updateArticle = async (articleId, { title, content, category }) => {
  validateInputs({ articleId });

  const [result] = await db.query(
    "UPDATE articles SET title = ?, content = ?, category = ?, updatedAt = NOW() WHERE idx = ?",
    [title, content, category, articleId]
  );

  if (result.affectedRows === 0) {
    throw customError("게시글 수정에 실패했습니다.", 404);
  }
};

const deleteArticle = async (articleId) => {
  validateInputs({ articleId });

  const [result] = await db.query("DELETE FROM articles WHERE idx = ?", [
    articleId,
  ]);

  if (result.affectedRows === 0) {
    throw customError("게시글 삭제에 실패했습니다.", 404);
  }
};

const likeArticle = async (articleId, userId) => {
  validateInputs({ articleId, userId });

  const [existingLike] = await db.query(
    "SELECT * FROM article_likes WHERE articleIdx = ? AND userIdx = ?",
    [articleId, userId]
  );

  if (existingLike.length > 0) {
    throw customError("이미 좋아요를 누른 상태입니다.", 409);
  }

  const [result] = await db.query(
    "INSERT INTO article_likes (articleIdx, userIdx, createdAt) VALUES (?, ?, NOW())",
    [articleId, userId]
  );

  if (result.affectedRows === 0) {
    throw customError("좋아요 처리에 실패했습니다.", 500);
  }

  return await getLikes(articleId);
};

const unlikeArticle = async (articleId, userId) => {
  validateInputs({ articleId, userId });

  const [existingLike] = await db.query(
    "SELECT * FROM article_likes WHERE articleIdx = ? AND userIdx = ?",
    [articleId, userId]
  );

  if (existingLike.length === 0) {
    throw customError("좋아요를 누른 적이 없습니다.", 409);
  }

  const [result] = await db.query(
    "DELETE FROM article_likes WHERE articleIdx = ? AND userIdx = ?",
    [articleId, userId]
  );

  if (result.affectedRows === 0) {
    throw customError("좋아요 취소 처리에 실패했습니다.", 500);
  }

  return await getLikes(articleId);
};

const getLikes = async (articleId) => {
  validateInputs({ articleId });

  const [likes] = await db.query(
    "SELECT COUNT(*) as likeCount FROM article_likes WHERE articleIdx = ?",
    [articleId]
  );

  if (likes.length === 0) {
    throw customError("좋아요 정보를 가져오는 데 실패했습니다.", 404);
  }

  return likes[0].likeCount;
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
};
