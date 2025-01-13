const db = require("../utils/dbConnect");

const createArticle = async ({ title, content, category }) => {
  const result = await db.query(
    "INSERT INTO articles (title, content, category, createdAt) VALUES (?, ?, ?, NOW())",
    [title, content, category]
  );
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
  return articles;
};

const getArticleById = async (id) => {
  const [articles] = await db.query("SELECT * FROM articles WHERE id = ?", [
    id,
  ]);
  if (articles.length === 0) throw new Error("게시글을 찾을 수 없습니다.");
  return articles[0];
};

const updateArticle = async (id, { title, content, category }) => {
  await db.query(
    "UPDATE articles SET title = ?, content = ?, category = ?, updatedAt = NOW() WHERE id = ?",
    [title, content, category, id]
  );
};

const deleteArticle = async (id) => {
  await db.query("DELETE FROM articles WHERE id = ?", [id]);
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
