const express = require("express");
const commentController = require("./commentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/:articleIdx/comments",
  authMiddleware,
  commentController.getCommentsByArticle
);

router.post(
  "/:articleIdx/comments",
  authMiddleware,
  commentController.createComment
);

router.put(
  "/:articleIdx/comments/:commentIdx",
  authMiddleware,
  commentController.updateCommentController
);

router.delete(
  "/:articleIdx/comments/:commentIdx",
  authMiddleware,
  commentController.deleteCommentController
);

router.post(
  "/:articleIdx/comments/:commentIdx/like",
  authMiddleware,
  commentController.likeCommentController
);

router.delete(
  "/:articleIdx/comments/:commentIdx/like",
  authMiddleware,
  commentController.unlikeCommentController
);

module.exports = router;
