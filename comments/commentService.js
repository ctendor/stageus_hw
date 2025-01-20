const db = require("../utils/dbConnect");
const customError = require("../utils/customError");

const addComment = async ({ articleIdx, content, authorIdx }) => {
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
  const [comments] = await db.query(
    "SELECT * FROM comments WHERE articleIdx = ? ORDER BY createdAt DESC",
    [articleIdx]
  );

  return comments;
};

const getCommentById = async (commentIdx) => {
  const [comments] = await db.query("SELECT * FROM comments WHERE idx = ?", [
    commentIdx,
  ]);

  if (comments.length === 0) {
    throw customError("해당 ID의 댓글을 찾을 수 없습니다.", 404);
  }

  return comments[0];
};

const updateComment = async (commentIdx, { content }) => {
  const [result] = await db.query(
    "UPDATE comments SET content = ?, updatedAt = NOW() WHERE idx = ?",
    [content, commentIdx]
  );

  if (result.affectedRows === 0) {
    throw customError("댓글 수정에 실패했습니다.", 404);
  }
};

const deleteComment = async (commentIdx) => {
  const [result] = await db.query("DELETE FROM comments WHERE idx = ?", [
    commentIdx,
  ]);

  if (result.affectedRows === 0) {
    throw customError("댓글 삭제에 실패했습니다.", 404);
  }
};

const checkCommentExists = async (commentIdx) => {
  const [comments] = await db.query("SELECT * FROM comments WHERE idx = ?", [
    commentIdx,
  ]);
  return comments.length > 0;
};

const likeComment = async (commentIdx, userId) => {
  // 좋아요 상태 확인
  const [existingLike] = await db.query(
    "SELECT * FROM comment_likes WHERE commentIdx = ? AND userIdx = ?",
    [commentIdx, userId]
  );

  if (existingLike.length > 0) {
    throw customError("이미 좋아요를 누른 상태입니다.", 409);
  }

  // 좋아요 추가
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
  // 좋아요 상태 확인
  const [existingLike] = await db.query(
    "SELECT * FROM comment_likes WHERE commentIdx = ? AND userIdx = ?",
    [commentIdx, userId]
  );

  if (existingLike.length === 0) {
    throw customError("좋아요를 누르지 않은 상태입니다.", 409);
  }

  // 좋아요 삭제
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
