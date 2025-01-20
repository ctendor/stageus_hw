const db = require("../utils/dbConnect");
const customError = require("../utils/customError");

const registerUser = async ({ username, password, name }) => {
  const existingUser = await db.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (existingUser.rows.length > 0) {
    throw customError("이미 사용 중인 아이디입니다.", 409);
  }

  const result = await db.query(
    "INSERT INTO users (username, password, name, createdAt) VALUES ($1, $2, $3, NOW()) RETURNING idx",
    [username, password, name]
  );

  if (!result.rows[0]?.idx) {
    throw customError("회원가입에 실패했습니다.", 500);
  }

  return { idx: result.rows[0].idx, username, name };
};

const authenticateUser = async ({ username, password }) => {
  const users = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (users.rows.length === 0 || users.rows[0].password !== password) {
    throw customError("아이디 또는 비밀번호가 올바르지 않습니다.", 401);
  }

  return users.rows[0];
};

const getArticlesByUser = async (userId) => {
  const articles = await db.query(
    "SELECT * FROM articles WHERE authorIdx = $1 ORDER BY createdAt DESC",
    [userId]
  );

  return articles.rows;
};

const getCommentsByUser = async (userId) => {
  const comments = await db.query(
    "SELECT * FROM comments WHERE authorIdx = $1 ORDER BY createdAt DESC",
    [userId]
  );

  return comments.rows;
};

module.exports = {
  registerUser,
  authenticateUser,
  getArticlesByUser,
  getCommentsByUser,
};
