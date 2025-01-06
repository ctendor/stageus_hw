const router = require("express").Router();
const {
  createArticle,
  getArticle,
  updateArticleController,
  deleteArticleController,
  getArticlesList,
  likeArticleController,
  unlikeArticleController,
} = require("../controllers/articlesController");
const {
  createComment,
  getComment,
  updateCommentController,
  deleteCommentController,
  likeCommentController,
  unlikeCommentController,
} = require("../controllers/commentsController");

router.post("/", createArticle);
router.get("/:id", getArticle);
router.put("/:id", updateArticleController);
router.delete("/:id", deleteArticleController);
router.get("/", getArticlesList);
router.post("/:id/like", likeArticleController);
router.delete("/:id/like", unlikeArticleController);

router.post("/:articleIdx/comments", createComment);
router.get("/:articleIdx/comments/:commentIdx", getComment);
router.put("/:articleIdx/comments/:commentIdx", updateCommentController);
router.delete("/:articleIdx/comments/:commentIdx", deleteCommentController);
router.post("/:articleIdx/comments/:commentIdx/like", likeCommentController);
router.delete(
  "/:articleIdx/comments/:commentIdx/like",
  unlikeCommentController
);

module.exports = router;
