const commentService = require("./commentService");
const asyncWrapper = require("../utils/asyncWrapper");
const customError = require("../utils/customError");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { idxRegx, contentRegx } = require("../constants/regx");

const createComment = [
  validateRequest({
    params: {
      articleIdx: { regex: idxRegx, required: true },
    },
    body: {
      content: { regex: contentRegx, required: true },
    },
  }),
  asyncWrapper(async (req, res) => {
    const { articleIdx } = req.params;
    const { content } = req.body;
    const { id: authorIdx } = req.user;

    const newComment = await commentService.addComment({
      articleIdx,
      content,
      authorIdx,
    });

    res.status(201).send({
      message: "댓글이 생성되었습니다.",
      commentIdx: newComment.commentIdx,
    });
  }),
];

const getCommentsByArticle = [
  validateRequest({
    params: {
      articleIdx: { regex: idxRegx, required: true },
    },
  }),
  asyncWrapper(async (req, res) => {
    const { articleIdx } = req.params;

    const comments = await commentService.getCommentsByArticle(articleIdx);

    res.status(200).send(comments);
  }),
];

const updateCommentController = [
  validateRequest({
    params: {
      articleIdx: { regex: idxRegx, required: true },
      commentIdx: { regex: idxRegx, required: true },
    },
    body: {
      content: { regex: contentRegx, required: true },
    },
  }),
  asyncWrapper(async (req, res) => {
    const { articleIdx, commentIdx } = req.params;
    const { content } = req.body;
    const { id: authorIdx } = req.user;

    const comment = await commentService.getCommentById(commentIdx);
    if (
      comment.articleIdx !== parseInt(articleIdx, 10) ||
      comment.authorIdx !== authorIdx
    ) {
      throw customError("댓글을 수정할 권한이 없습니다.", 403);
    }

    await commentService.updateComment(commentIdx, { content });

    res.status(200).send({ message: "댓글이 수정되었습니다." });
  }),
];

const deleteCommentController = [
  validateRequest({
    params: {
      articleIdx: { regex: idxRegx, required: true },
      commentIdx: { regex: idxRegx, required: true },
    },
  }),
  asyncWrapper(async (req, res) => {
    const { articleIdx, commentIdx } = req.params;
    const { id: authorIdx } = req.user;

    const comment = await commentService.getCommentById(commentIdx);
    if (
      comment.articleIdx !== parseInt(articleIdx, 10) ||
      comment.authorIdx !== authorIdx
    ) {
      throw customError("댓글을 삭제할 권한이 없습니다.", 403);
    } //중복 코드

    await commentService.deleteComment(commentIdx);

    res.status(200).send({ message: "댓글이 삭제되었습니다." });
  }),
];

const likeCommentController = [
  validateRequest({
    params: {
      commentIdx: { regex: idxRegx, required: true },
    },
  }),
  asyncWrapper(async (req, res) => {
    const { commentIdx } = req.params;
    const { id: userId } = req.user;

    const likes = await commentService.likeComment(commentIdx, userId);

    res.status(200).send({ message: "댓글에 좋아요를 눌렀습니다.", likes });
  }),
];

const unlikeCommentController = [
  validateRequest({
    params: {
      commentIdx: { regex: idxRegx, required: true },
    },
  }),
  asyncWrapper(async (req, res) => {
    const { commentIdx } = req.params;
    const { id: userId } = req.user;

    const likes = await commentService.unlikeComment(commentIdx, userId);

    res.status(200).send({ message: "댓글 좋아요가 취소되었습니다.", likes });
  }),
];

module.exports = {
  createComment,
  getCommentsByArticle,
  updateCommentController,
  deleteCommentController,
  likeCommentController,
  unlikeCommentController,
};
