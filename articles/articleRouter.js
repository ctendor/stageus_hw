const express = require("express");
const articleController = require("./articleController");
const authMiddleware = require("../middlewares/authMiddleware");
const { checkOwnership } = require("../middlewares/checkOwnership");

const router = express.Router();

// 게시글 목록 조회
router.get("/", articleController.getArticles); // 인증 없이 조회 가능

// 특정 게시글 조회
router.get("/:id", articleController.getArticle); // 인증 없이 조회 가능

// 게시글 작성 (로그인 필요)
router.post("/", authMiddleware, articleController.createArticle);

// 게시글 수정 (로그인 및 작성자 권한 필요)
router.put(
  "/:articleId",
  authMiddleware,
  checkOwnership("articles", "articleId"), // 작성자 확인 미들웨어
  articleController.updateArticle
);

// 게시글 삭제 (로그인 및 작성자 권한 필요)
router.delete(
  "/:articleId",
  authMiddleware,
  checkOwnership("articles", "articleId"), // 작성자 확인 미들웨어
  articleController.deleteArticle
);

// 게시글 좋아요 (로그인 필요)
router.post("/:id/like", authMiddleware, articleController.likeArticle);

// 게시글 좋아요 취소 (로그인 필요)
router.delete("/:id/like", authMiddleware, articleController.unlikeArticle);

module.exports = router;
