const db = require("../utils/dbConnect");
const customError = require("../utils/customError");

const addComment = async ({ articleIdx, content, authorIdx }) => {
  if (!articleIdx || !content || !authorIdx) {
    throw customError("필수 입력값이 누락되었습니다.", 400);
  }

  const result = await db.query(
    "INSERT INTO comments (articleIdx, content, authorIdx, createdAt, updatedAt, likes) VALUES ($1, $2, $3, NOW(), NOW(), 0) RETURNING idx",
    [articleIdx, content, authorIdx]
  );

  if (!result.rows[0]?.idx) {
    throw customError("댓글 생성에 실패했습니다.", 500);
  }

  return { commentIdx: result.rows[0].idx };
};

const getCommentsByArticle = async (articleIdx) => {
  if (!articleIdx) {
    throw customError("게시글 ID가 누락되었습니다.", 400);
  }

  const result = await db.query(
    "SELECT * FROM comments WHERE articleIdx = $1 ORDER BY createdAt DESC",
    [articleIdx]
  );

  return result.rows;
};

const getCommentById = async (commentIdx) => {
  if (!commentIdx) {
    throw customError("댓글 ID가 누락되었습니다.", 400);
  }

  const result = await db.query("SELECT * FROM comments WHERE idx = $1", [
    commentIdx,
  ]);

  if (result.rows.length === 0) {
    throw customError("해당 ID의 댓글을 찾을 수 없습니다.", 404);
  }

  return result.rows[0];
};

const updateComment = async (commentIdx, { content }) => {
  if (!commentIdx || !content) {
    throw customError("필수 입력값이 누락되었습니다.", 400);
  }

  const result = await db.query(
    "UPDATE comments SET content = $1, updatedAt = NOW() WHERE idx = $2 RETURNING idx",
    [content, commentIdx]
  );

  if (result.rows.length === 0) {
    throw customError("댓글 수정에 실패했습니다.", 404);
  }
};

const deleteComment = async (commentIdx) => {
  if (!commentIdx) {
    throw customError("댓글 ID가 누락되었습니다.", 400);
  }

  const result = await db.query(
    "DELETE FROM comments WHERE idx = $1 RETURNING idx",
    [commentIdx]
  );

  if (result.rows.length === 0) {
    throw customError("댓글 삭제에 실패했습니다.", 404);
  }
};

const likeComment = async (commentIdx, userId) => {
  if (!commentIdx || !userId) {
    throw customError("필수 입력값이 누락되었습니다.", 400);
  }

  const existingLike = await db.query(
    "SELECT * FROM comment_likes WHERE commentIdx = $1 AND userIdx = $2",
    [commentIdx, userId]
  );

  if (existingLike.rows.length > 0) {
    throw customError("이미 좋아요를 누른 상태입니다.", 409);
  }

  const result = await db.query(
    "INSERT INTO comment_likes (commentIdx, userIdx, createdAt) VALUES ($1, $2, NOW()) RETURNING idx",
    [commentIdx, userId]
  );

  if (!result.rows[0]?.idx) {
    throw customError("댓글 좋아요 처리에 실패했습니다.", 500);
  }

  return await getLikes(commentIdx);
};

const unlikeComment = async (commentIdx, userId) => {
  if (!commentIdx || !userId) {
    throw customError("필수 입력값이 누락되었습니다.", 400);
  }

  const existingLike = await db.query(
    "SELECT * FROM comment_likes WHERE commentIdx = $1 AND userIdx = $2",
    [commentIdx, userId]
  );

  if (existingLike.rows.length === 0) {
    throw customError("좋아요를 누르지 않은 상태입니다.", 409);
  }

  const result = await db.query(
    "DELETE FROM comment_likes WHERE commentIdx = $1 AND userIdx = $2 RETURNING idx",
    [commentIdx, userId]
  );

  if (result.rows.length === 0) {
    throw customError("댓글 좋아요 취소 처리에 실패했습니다.", 500);
  }

  return await getLikes(commentIdx);
};

const getLikes = async (commentIdx) => {
  if (!commentIdx) {
    throw customError("댓글 ID가 누락되었습니다.", 400);
  }

  const result = await db.query(
    "SELECT COUNT(*) as likeCount FROM comment_likes WHERE commentIdx = $1",
    [commentIdx]
  );

  if (result.rows.length === 0) {
    throw customError("좋아요 정보를 가져오는 데 실패했습니다.", 404);
  }

  return result.rows[0].likeCount;
};

module.exports = {
  addComment,
  getCommentsByArticle,
  getCommentById,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};
