const express = require("express");
const articleController = require("./articleController");
const { checkOwnership } = require("../users/sessionManager");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, articleController.getArticle);
router.get("/:id", authMiddleware, articleController.getArticle);

router.post("/", authMiddleware, articleController.createArticle);
router.put(
  "/:id",
  authMiddleware,
  checkOwnership("params.id"),
  articleController.updateArticle
);
router.delete(
  "/:id",
  authMiddleware,
  checkOwnership("params.id"),
  articleController.deleteArticle
);

router.post("/:id/like", authMiddleware, articleController.likeArticle);
router.delete("/:id/like", authMiddleware, articleController.unlikeArticle);

module.exports = router;
