// users/userService.js

const db = require("../utils/dbConnect");
const customError = require("../utils/customError");
const jwt = require("jsonwebtoken");

// 실제 앱에서는 .env에서 불러오기
const JWT_SECRET = process.env.JWT_SECRET || "YOUR_JWT_SECRET";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "YOUR_REFRESH_SECRET";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

// 회원가입
const registerUser = async ({ username, password, name }) => {
  const existing = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (existing.rows.length > 0) {
    throw customError("이미 사용 중인 아이디입니다.", 409);
  }
  const result = await db.query(
    "INSERT INTO users (username, password, name, createdAt) VALUES ($1, $2, $3, NOW()) RETURNING idx, username, name",
    [username, password, name]
  );
  if (!result.rows[0]?.idx) {
    throw customError("회원가입에 실패했습니다.", 500);
  }
  return result.rows[0];
};

// 아이디/비번 확인
const authenticateUser = async ({ username, password }) => {
  const query = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (query.rows.length === 0) {
    throw customError("아이디 또는 비밀번호가 올바르지 않습니다.", 401);
  }
  const user = query.rows[0];
  if (user.password !== password) {
    throw customError("아이디 또는 비밀번호가 올바르지 않습니다.", 401);
  }
  return user;
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

/** Access Token 생성 (유효기간 짧게) */
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.idx, role: user.role || "user" }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/** Refresh Token 생성 (유효기간 길게) */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.idx, role: user.role || "user" },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    }
  );
};

/**
 * Refresh Token 검증 후 새 Access Token 발급
 */
const refreshAccessToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    const found = await db.query("SELECT * FROM users WHERE idx = $1", [
      decoded.id,
    ]);
    if (found.rows.length === 0) {
      throw customError("사용자를 찾을 수 없습니다.", 404);
    }
    const user = found.rows[0];
    return generateAccessToken(user);
  } catch (err) {
    throw customError("유효하지 않은 리프레시 토큰이거나 만료되었습니다.", 401);
  }
};

/**
 * 카카오 사용자 정보로 기존 사용자 조회 또는 신규 가입 처리
 * kakaoUser: 카카오 API 응답 데이터
 */
const findOrCreateKakaoUser = async (kakaoUser) => {
  // 카카오 API 응답 구조에 따라 적절한 값을 추출합니다.
  const kakaoId = kakaoUser.id;
  const username = `kakao_${kakaoId}`;
  // 이미 가입된 사용자 조회
  const query = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (query.rows.length > 0) {
    return query.rows[0];
  } else {
    // 신규 사용자 가입 (필요한 경우 추가 정보를 저장)
    const result = await db.query(
      "INSERT INTO users (username, name, createdAt) VALUES ($1, $2, NOW()) RETURNING *",
      [username, kakaoUser.properties?.nickname || "Kakao User"]
    );
    if (!result.rows[0]) {
      throw customError("카카오 사용자 등록에 실패했습니다.", 500);
    }
    return result.rows[0];
  }
};

module.exports = {
  registerUser,
  authenticateUser,
  getArticlesByUser,
  getCommentsByUser,
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
  findOrCreateKakaoUser, // 추가
};
