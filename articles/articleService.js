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

  const result = await db.query(
    "INSERT INTO articles (title, content, category, authorIdx, likes, createdAt, updatedAt) VALUES ($1, $2, $3, $4, 0, NOW(), NOW()) RETURNING idx",
    [title, content, category, authorIdx]
  );

  if (!result.rows[0]?.idx) {
    throw customError("게시글 생성에 실패했습니다.", 500);
  }

  return result.rows[0].idx;
};

const getArticles = async ({ search, category }) => {
  let query = "SELECT * FROM articles WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (title ILIKE $1 OR content ILIKE $2)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += params.length > 0 ? " AND category = $3" : " AND category = $1";
    params.push(category);
  }

  query += " ORDER BY createdAt DESC";

  const result = await db.query(query, params);
  return result.rows;
};

const getArticleById = async (articleId) => {
  validateInputs({ articleId });

  const result = await db.query("SELECT * FROM articles WHERE idx = $1", [
    articleId,
  ]);

  if (result.rows.length === 0) {
    throw customError("해당 ID의 게시글을 찾을 수 없습니다.", 404);
  }

  return result.rows[0];
};

const updateArticle = async (articleId, { title, content, category }) => {
  validateInputs({ articleId });

  const result = await db.query(
    "UPDATE articles SET title = $1, content = $2, category = $3, updatedAt = NOW() WHERE idx = $4 RETURNING idx",
    [title, content, category, articleId]
  ); // sql에서 useridx 체크 해야함

  if (result.rows.length === 0) {
    throw customError("게시글 수정에 실패했습니다.", 404);
  }
};

const deleteArticle = async (articleId) => {
  validateInputs({ articleId });

  const result = await db.query(
    "DELETE FROM articles WHERE idx = $1 RETURNING idx", // 디버깅을 하려면 다른곳에서 진행. wrapper나 table에서 직접 보는것도...?
    [articleId]
  );

  if (result.rows.length === 0) {
    throw customError("게시글 삭제에 실패했습니다.", 404);
  }
};

const likeArticle = async (articleId, userId) => {
  validateInputs({ articleId, userId });

  const existingLike = await db.query(
    "SELECT * FROM article_likes WHERE articleIdx = $1 AND userIdx = $2",
    [articleId, userId]
  );

  if (existingLike.rows.length > 0) {
    throw customError("이미 좋아요를 누른 상태입니다.", 409);
  }

  const result = await db.query(
    "INSERT INTO article_likes (articleIdx, userIdx, createdAt) VALUES ($1, $2, NOW()) RETURNING idx",
    [articleId, userId]
  );

  if (!result.rows[0]?.idx) {
    throw customError("좋아요 처리에 실패했습니다.", 500);
  }

  return await getLikes(articleId);
};

const unlikeArticle = async (articleId, userId) => {
  validateInputs({ articleId, userId });

  const existingLike = await db.query(
    "SELECT * FROM article_likes WHERE articleIdx = $1 AND userIdx = $2",
    [articleId, userId]
  );

  if (existingLike.rows.length === 0) {
    throw customError("좋아요를 누른 적이 없습니다.", 409);
  }

  const result = await db.query(
    "DELETE FROM article_likes WHERE articleIdx = $1 AND userIdx = $2 RETURNING idx",
    [articleId, userId]
  );

  if (result.rows.length === 0) {
    throw customError("좋아요 취소 처리에 실패했습니다.", 500);
  }

  return await getLikes(articleId);
};

const getLikes = async (articleId) => {
  validateInputs({ articleId });

  const result = await db.query(
    "SELECT COUNT(*) as likeCount FROM article_likes WHERE articleIdx = $1",
    [articleId]
  );

  if (result.rows.length === 0) {
    throw customError("좋아요 정보를 가져오는 데 실패했습니다.", 404);
  }

  return result.rows[0].likeCount;
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
