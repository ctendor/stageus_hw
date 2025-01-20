const express = require("express");
const commentController = require("./commentController");
const authMiddleware = require("../middlewares/authMiddleware");
const { checkOwnership } = require("../middlewares/sessionManager");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { idxRegx } = require("../constants/regx");

const router = express.Router();

router.get(
  "/:articleIdx/comments",
  validateRequest({
    params: {
      articleIdx: { regex: idxRegx, required: true },
    },
  }),
  commentController.getCommentsByArticle
);

router.post(
  "/:articleIdx/comments",
  authMiddleware,
  validateRequest({
    params: {
      articleIdx: { regex: idxRegx, required: true },
    },
    body: {
      content: { regex: /^.{1,}$/, required: true },
    },
  }),
  commentController.createComment
);

router.put(
  "/:articleIdx/comments/:commentIdx",
  authMiddleware,
  validateRequest({
    params: {
      articleIdx: { regex: idxRegx, required: true },
      commentIdx: { regex: idxRegx, required: true },
    },
    body: {
      content: { regex: /^.{1,}$/, required: true },
    },
  }),
  checkOwnership("comments", "commentIdx"),
  commentController.updateCommentController
);

router.delete(
  "/:articleIdx/comments/:commentIdx",
  authMiddleware,
  validateRequest({
    params: {
      articleIdx: { regex: idxRegx, required: true },
      commentIdx: { regex: idxRegx, required: true },
    },
  }),
  checkOwnership("comments", "commentIdx"),
  commentController.deleteCommentController
);

router.post(
  "/:articleIdx/comments/:commentIdx/like",
  authMiddleware,
  validateRequest({
    params: {
      articleIdx: { regex: idxRegx, required: true },
      commentIdx: { regex: idxRegx, required: true },
    },
  }),
  commentController.likeCommentController
);

router.delete(
  "/:articleIdx/comments/:commentIdx/like",
  authMiddleware,
  validateRequest({
    params: {
      articleIdx: { regex: idxRegx, required: true },
      commentIdx: { regex: idxRegx, required: true },
    },
  }),
  commentController.unlikeCommentController
);

module.exports = router;
