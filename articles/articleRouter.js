const express = require("express");
const articleController = require("./articleController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, articleController.createArticle);
router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticleById);
router.put("/:id", authMiddleware, articleController.updateArticle);
router.delete("/:id", authMiddleware, articleController.deleteArticle);

module.exports = router;
