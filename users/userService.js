const db = require("../utils/dbConnect");
const customError = require("../utils/customError");

const registerUser = async ({ username, password, name }) => {
  const [existingUser] = await db.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  if (existingUser.length > 0) {
    throw customError("이미 사용 중인 아이디입니다.", 409);
  }

  const [result] = await db.query(
    "INSERT INTO users (username, password, name, createdAt) VALUES (?, ?, ?, NOW())",
    [username, password, name]
  );

  if (!result.insertId) {
    throw customError("회원가입에 실패했습니다.", 500);
  }

  return { idx: result.insertId, username, name };
};

const authenticateUser = async ({ username, password }) => {
  const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  if (users.length === 0 || users[0].password !== password) {
    throw customError("아이디 또는 비밀번호가 올바르지 않습니다.", 401);
  }

  return users[0];
};

const getArticlesByUser = async (userId) => {
  const [articles] = await db.query(
    "SELECT * FROM articles WHERE authorIdx = ? ORDER BY createdAt DESC",
    [userId]
  );

  return articles;
};

const getCommentsByUser = async (userId) => {
  const [comments] = await db.query(
    "SELECT * FROM comments WHERE authorIdx = ? ORDER BY createdAt DESC",
    [userId]
  );

  return comments;
};

module.exports = {
  registerUser,
  authenticateUser,
  getArticlesByUser,
  getCommentsByUser,
};
