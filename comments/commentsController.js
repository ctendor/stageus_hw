const {
  addComment,
  findCommentByIdx,
  updateComment,
  deleteComment,
  getCommentsByArticleIdx,
  likeComment,
  unlikeComment,
} = require("../repositories/commentsRepository");
const { findArticleByIdx } = require("../repositories/articlesRepository");
const customError = require("../utils/customError");
const { idxRegx } = require("../constants/regx");

const createComment = (req, res) => {
  try {
    const { articleIdx } = req.params;
    const { content } = req.body; 

    if (!idxRegx.test(articleIdx))
      throw customError("유효하지 않은 게시글 IDX입니다.", 400);
    if (!content) throw customError("댓글 내용을 입력해주세요.", 400);

    const article = findArticleByIdx(parseInt(articleIdx));
    if (!article) throw customError("게시글을 찾을 수 없습니다.", 404);

    const newComment = addComment({
      articleIdx: parseInt(articleIdx),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
    });

    res.status(201).send({
      message: "댓글이 생성되었습니다.",
      commentIdx: newComment.commentIdx,
    });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

const getComment = (req, res) => {
  try {
    const { articleIdx, commentIdx } = req.params;
    if (!idxRegx.test(articleIdx) || !idxRegx.test(commentIdx))
      throw customError("유효하지 않은 IDX입니다.", 400);
    const comment = findCommentByIdx(parseInt(commentIdx));
    if (!comment || comment.articleIdx !== parseInt(articleIdx))
      throw customError("댓글을 찾을 수 없습니다.", 404);
    res.send(comment);
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

const updateCommentController = (req, res) => {
  try {
    const { articleIdx, commentIdx } = req.params;
    const { content } = req.body;
    if (!idxRegx.test(articleIdx) || !idxRegx.test(commentIdx))
      throw customError("유효하지 않은 IDX입니다.", 400);
    const comment = findCommentByIdx(parseInt(commentIdx));
    if (!comment || comment.articleIdx !== parseInt(articleIdx))
      throw customError("댓글을 찾을 수 없습니다.", 404);
    if (!content) throw customError("댓글 내용을 입력해주세요.", 400);
    const updatedComment = updateComment(parseInt(commentIdx), {
      content,
      updatedAt: new Date().toISOString(),
    });
    res.send({ message: "댓글이 수정되었습니다." });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

const deleteCommentController = (req, res) => {
  try {
    const { articleIdx, commentIdx } = req.params;
    if (!idxRegx.test(articleIdx) || !idxRegx.test(commentIdx))
      throw customError("유효하지 않은 IDX입니다.", 400);
    const comment = findCommentByIdx(parseInt(commentIdx));
    if (!comment || comment.articleIdx !== parseInt(articleIdx))
      throw customError("댓글을 찾을 수 없습니다.", 404);
    deleteComment(parseInt(commentIdx));
    res.send({ message: "댓글이 삭제되었습니다." });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

const likeCommentController = (req, res) => {
  try {
    const { articleIdx, commentIdx } = req.params;
    if (!idxRegx.test(articleIdx) || !idxRegx.test(commentIdx))
      throw customError("유효하지 않은 IDX입니다.", 400);
    const likes = likeComment(parseInt(commentIdx));
    res.send({ message: "댓글에 좋아요를 눌렀습니다.", likes });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

const unlikeCommentController = (req, res) => {
  try {
    const { articleIdx, commentIdx } = req.params;
    if (!idxRegx.test(articleIdx) || !idxRegx.test(commentIdx))
      throw customError("유효하지 않은 IDX입니다.", 400);
    const likes = unlikeComment(parseInt(commentIdx));
    res.send({ message: "댓글 좋아요가 취소되었습니다.", likes });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
};

module.exports = {
  createComment,
  getComment,
  updateCommentController,
  deleteCommentController,
  likeCommentController,
  unlikeCommentController,
};
