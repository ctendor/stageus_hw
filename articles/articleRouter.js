const express = require("express");
const articleController = require("./articleController");
const authMiddleware = require("../middlewares/authMiddleware");
const { checkOwnership } = require("../utils/sessionManager");
const dbMiddleware = require("../middlewares/dbMiddleware");

const router = express.Router();

router.use(dbMiddleware);

router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticle);
router.post("/", authMiddleware, articleController.createArticle);
router.put(
  "/:articleId",
  authMiddleware,
  checkOwnership("articles", "articleId"),
  articleController.updateArticle
);
router.delete(
  "/:articleId",
  authMiddleware,
  checkOwnership("articles", "articleId"),
  articleController.deleteArticle
);
router.post("/:id/like", authMiddleware, articleController.likeArticle);
router.delete("/:id/like", authMiddleware, articleController.unlikeArticle);

module.exports = router;
