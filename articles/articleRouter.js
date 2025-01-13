const express = require("express");
const articleController = require("./articleController");
const { checkSession } = require("../users/sessionManager");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", checkSession, articleController.getArticles);
router.get("/:id", checkSession, articleController.getArticle);

router.post("/", authMiddleware, articleController.createArticle);
router.put("/:id", authMiddleware, articleController.updateArticle);
router.delete("/:id", authMiddleware, articleController.deleteArticle);

router.post("/:id/like", authMiddleware, articleController.likeArticle);
router.delete("/:id/like", authMiddleware, articleController.unlikeArticle);

module.exports = router;
