const db = require("../utils/dbConnect");
const customError = require("../utils/customError");

const addComment = async ({ articleIdx, content, authorIdx }) => {
  if (!articleIdx || !content || !authorIdx) {
    throw customError("필수 입력값이 누락되었습니다.", 400);
  }

  const [result] = await db.query(
    "INSERT INTO comments (articleIdx, content, authorIdx, createdAt, updatedAt, likes) VALUES (?, ?, ?, NOW(), NOW(), 0)",
    [articleIdx, content, authorIdx]
  );

  if (!result.insertId) {
    throw customError("댓글 생성에 실패했습니다.", 500);
  }

  return { commentIdx: result.insertId };
};

const getCommentsByArticle = async (articleIdx) => {
  if (!articleIdx) {
    throw customError("게시글 ID가 누락되었습니다.", 400);
  }

  const [comments] = await db.query(
    "SELECT * FROM comments WHERE articleIdx = ? ORDER BY createdAt DESC",
    [articleIdx]
  );

  return comments;
};

const getCommentById = async (commentIdx) => {
  if (!commentIdx) {
    throw customError("댓글 ID가 누락되었습니다.", 400);
  }

  const [comments] = await db.query("SELECT * FROM comments WHERE idx = ?", [
    commentIdx,
  ]);

  if (comments.length === 0) {
    throw customError("해당 ID의 댓글을 찾을 수 없습니다.", 404);
  }

  return comments[0];
};

const updateComment = async (commentIdx, { content }) => {
  if (!commentIdx || !content) {
    throw customError("필수 입력값이 누락되었습니다.", 400);
  }

  const [result] = await db.query(
    "UPDATE comments SET content = ?, updatedAt = NOW() WHERE idx = ?",
    [content, commentIdx]
  );

  if (result.affectedRows === 0) {
    throw customError("댓글 수정에 실패했습니다.", 404);
  }
};

const deleteComment = async (commentIdx) => {
  if (!commentIdx) {
    throw customError("댓글 ID가 누락되었습니다.", 400);
  }

  const [result] = await db.query("DELETE FROM comments WHERE idx = ?", [
    commentIdx,
  ]);

  if (result.affectedRows === 0) {
    throw customError("댓글 삭제에 실패했습니다.", 404);
  }
};

const likeComment = async (commentIdx, userId) => {
  if (!commentIdx || !userId) {
    throw customError("필수 입력값이 누락되었습니다.", 400);
  }

  const [existingLike] = await db.query(
    "SELECT * FROM comment_likes WHERE commentIdx = ? AND userIdx = ?",
    [commentIdx, userId]
  );

  if (existingLike.length > 0) {
    throw customError("이미 좋아요를 누른 상태입니다.", 409);
  }

  const [result] = await db.query(
    "INSERT INTO comment_likes (commentIdx, userIdx, createdAt) VALUES (?, ?, NOW())",
    [commentIdx, userId]
  );

  if (result.affectedRows === 0) {
    throw customError("댓글 좋아요 처리에 실패했습니다.", 500);
  }

  return await getLikes(commentIdx);
};

const unlikeComment = async (commentIdx, userId) => {
  if (!commentIdx || !userId) {
    throw customError("필수 입력값이 누락되었습니다.", 400);
  }

  const [existingLike] = await db.query(
    "SELECT * FROM comment_likes WHERE commentIdx = ? AND userIdx = ?",
    [commentIdx, userId]
  );

  if (existingLike.length === 0) {
    throw customError("좋아요를 누르지 않은 상태입니다.", 409);
  }

  const [result] = await db.query(
    "DELETE FROM comment_likes WHERE commentIdx = ? AND userIdx = ?",
    [commentIdx, userId]
  );

  if (result.affectedRows === 0) {
    throw customError("댓글 좋아요 취소 처리에 실패했습니다.", 500);
  }

  return await getLikes(commentIdx);
};

const getLikes = async (commentIdx) => {
  if (!commentIdx) {
    throw customError("댓글 ID가 누락되었습니다.", 400);
  }

  const [likes] = await db.query(
    "SELECT COUNT(*) as likeCount FROM comment_likes WHERE commentIdx = ?",
    [commentIdx]
  );

  if (likes.length === 0) {
    throw customError("좋아요 정보를 가져오는 데 실패했습니다.", 404);
  }

  return likes[0].likeCount;
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
