const commentService = require("./commentService");
const customError = require("../utils/customError");
const asyncWrapper = require("../utils/asyncWrapper");

const createComment = asyncWrapper(async (req, res) => {
  const { articleIdx } = req.params;
  const { content } = req.body;
  const { id: authorIdx } = req.user; // 세션에서 사용자 정보 가져옴

  if (!content || typeof content !== "string") {
    throw customError("댓글 내용을 입력해주세요.", 400);
  }

  const newComment = await commentService.addComment({
    articleIdx,
    content,
    authorIdx,
  });

  res.status(201).send({
    message: "댓글이 생성되었습니다.",
    commentIdx: newComment.commentIdx,
  });
});

const getCommentsByArticle = asyncWrapper(async (req, res) => {
  const { articleIdx } = req.params;

  const comments = await commentService.getCommentsByArticle(articleIdx);

  res.status(200).send(comments);
});

const updateCommentController = asyncWrapper(async (req, res) => {
  const { articleIdx, commentIdx } = req.params;
  const { content } = req.body;
  const { id: authorIdx } = req.user; // 세션에서 사용자 정보 가져옴

  if (!content || typeof content !== "string") {
    throw customError("댓글 내용을 입력해주세요.", 400);
  }

  const comment = await commentService.getCommentById(commentIdx);
  if (
    comment.articleIdx !== parseInt(articleIdx, 10) ||
    comment.authorIdx !== authorIdx
  ) {
    throw customError("댓글을 수정할 권한이 없습니다.", 403);
  }

  await commentService.updateComment(commentIdx, { content });

  res.status(200).send({ message: "댓글이 수정되었습니다." });
});

const deleteCommentController = asyncWrapper(async (req, res) => {
  const { articleIdx, commentIdx } = req.params;
  const { id: authorIdx } = req.user; // 세션에서 사용자 정보 가져옴

  const comment = await commentService.getCommentById(commentIdx);
  if (
    comment.articleIdx !== parseInt(articleIdx, 10) ||
    comment.authorIdx !== authorIdx
  ) {
    throw customError("댓글을 삭제할 권한이 없습니다.", 403);
  }

  await commentService.deleteComment(commentIdx);

  res.status(200).send({ message: "댓글이 삭제되었습니다." });
});

const likeCommentController = asyncWrapper(async (req, res) => {
  const { commentIdx } = req.params;

  const likes = await commentService.likeComment(commentIdx);

  res.status(200).send({ message: "댓글에 좋아요를 눌렀습니다.", likes });
});

const unlikeCommentController = asyncWrapper(async (req, res) => {
  const { commentIdx } = req.params;

  const likes = await commentService.unlikeComment(commentIdx);

  res.status(200).send({ message: "댓글 좋아요가 취소되었습니다.", likes });
});

module.exports = {
  createComment,
  getCommentsByArticle,
  updateCommentController,
  deleteCommentController,
  likeCommentController,
  unlikeCommentController,
};
