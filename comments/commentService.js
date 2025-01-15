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

const likeComment = async (commentIdx) => {
  const [result] = await db.query(
    "UPDATE comments SET likes = likes + 1 WHERE idx = ?",
    [commentIdx]
  );

  if (result.affectedRows === 0) {
    throw customError("댓글 좋아요 처리에 실패했습니다.", 404);
  }

  const [comment] = await db.query("SELECT likes FROM comments WHERE idx = ?", [
    commentIdx,
  ]);
  return comment[0].likes;
};

const unlikeComment = async (commentIdx) => {
  const [result] = await db.query(
    "UPDATE comments SET likes = likes - 1 WHERE idx = ? AND likes > 0",
    [commentIdx]
  );

  if (result.affectedRows === 0) {
    throw customError("댓글 좋아요 취소 처리에 실패했습니다.", 404);
  }

  const [comment] = await db.query("SELECT likes FROM comments WHERE idx = ?", [
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
