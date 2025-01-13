const db = require("../utils/dbConnect");
const customError = require("../utils/customError");

const addArticle = async ({ title, content, category }) => {
  const [result] = await db.query(
    "INSERT INTO articles (title, content, category, createdAt, updatedAt, likes) VALUES (?, ?, ?, NOW(), NOW(), 0)",
    [title, content, category]
  );

  if (!result.insertId) {
    throw customError("게시글 생성에 실패했습니다.", 500);
  }

  return { articleIdx: result.insertId };
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
  if (articles.length === 0) {
    throw customError("게시글이 존재하지 않습니다.", 404);
  }

  return articles;
};

const getArticleById = async (id) => {
  const [articles] = await db.query("SELECT * FROM articles WHERE id = ?", [
    id,
  ]);
  if (articles.length === 0) {
    throw customError("해당 ID의 게시글을 찾을 수 없습니다.", 404);
  }
  return articles[0];
};

const updateArticle = async (id, { title, content, category }) => {
  const [result] = await db.query(
    "UPDATE articles SET title = ?, content = ?, category = ?, updatedAt = NOW() WHERE id = ?",
    [title, content, category, id]
  );

  if (result.affectedRows === 0) {
    throw customError("게시글 수정에 실패했습니다.", 404);
  }
};

const deleteArticle = async (id) => {
  const [result] = await db.query("DELETE FROM articles WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    throw customError("게시글 삭제에 실패했습니다.", 404);
  }
};

const likeArticle = async (id) => {
  const [result] = await db.query(
    "UPDATE articles SET likes = likes + 1 WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw customError("좋아요 처리에 실패했습니다.", 404);
  }

  const [article] = await db.query("SELECT likes FROM articles WHERE id = ?", [
    id,
  ]);
  return article[0].likes;
};

const unlikeArticle = async (id) => {
  const [result] = await db.query(
    "UPDATE articles SET likes = likes - 1 WHERE id = ? AND likes > 0",
    [id]
  );

  if (result.affectedRows === 0) {
    throw customError("좋아요 취소 처리에 실패했습니다.", 404);
  }

  const [article] = await db.query("SELECT likes FROM articles WHERE id = ?", [
    id,
  ]);
  return article[0].likes;
};

module.exports = {
  addArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
};
