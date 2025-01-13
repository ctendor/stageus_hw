// commentsService.js
const db = require("../utils/dbConnect");
const customError = require("../utils/customError");

const addComment = async ({ articleIdx, content }) => {
  const [result] = await db.query(
    "INSERT INTO comments (articleId, content, createdAt, updatedAt, likes) VALUES (?, ?, NOW(), NOW(), 0)",
    [articleIdx, content]
  );

  if (!result.insertId) {
    throw customError("댓글 생성에 실패했습니다.", 500);
  }

  return { commentIdx: result.insertId };
};

const getCommentsByArticle = async (articleIdx) => {
  const [comments] = await db.query(
    "SELECT * FROM comments WHERE articleId = ? ORDER BY createdAt DESC",
    [articleIdx]
  );

  if (comments.length === 0) {
    throw customError("댓글이 존재하지 않습니다.", 404);
  }

  return comments;
};

const getCommentById = async (commentIdx) => {
  const [comments] = await db.query("SELECT * FROM comments WHERE id = ?", [
    commentIdx,
  ]);

  if (comments.length === 0) {
    throw customError("해당 ID의 댓글을 찾을 수 없습니다.", 404);
  }

  return comments[0];
};

const updateComment = async (commentIdx, { content }) => {
  const [result] = await db.query(
    "UPDATE comments SET content = ?, updatedAt = NOW() WHERE id = ?",
    [content, commentIdx]
  );

  if (result.affectedRows === 0) {
    throw customError("댓글 수정에 실패했습니다.", 404);
  }
};

const deleteComment = async (commentIdx) => {
  const [result] = await db.query("DELETE FROM comments WHERE id = ?", [
    commentIdx,
  ]);

  if (result.affectedRows === 0) {
    throw customError("댓글 삭제에 실패했습니다.", 404);
  }
};

const likeComment = async (commentIdx) => {
  const [result] = await db.query(
    "UPDATE comments SET likes = likes + 1 WHERE id = ?",
    [commentIdx]
  );

  if (result.affectedRows === 0) {
    throw customError("댓글 좋아요 처리에 실패했습니다.", 404);
  }

  const [comment] = await db.query("SELECT likes FROM comments WHERE id = ?", [
    commentIdx,
  ]);
  return comment[0].likes;
};

const unlikeComment = async (commentIdx) => {
  const [result] = await db.query(
    "UPDATE comments SET likes = likes - 1 WHERE id = ? AND likes > 0",
    [commentIdx]
  );

  if (result.affectedRows === 0) {
    throw customError("댓글 좋아요 취소 처리에 실패했습니다.", 404);
  }

  const [comment] = await db.query("SELECT likes FROM comments WHERE id = ?", [
    commentIdx,
  ]);
  return comment[0].likes;
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
