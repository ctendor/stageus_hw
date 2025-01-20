const express = require("express");
const userController = require("./userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 회원가입
router.post("/register", userController.register);

// 로그인
router.post("/login", userController.login);

// 사용자 정보 조회
router.get("/me", authMiddleware, userController.getUserInfo);

// 내가 쓴 게시글 조회
router.get("/me/articles", authMiddleware, userController.getMyArticles);

// 내가 쓴 댓글 조회
router.get("/me/comments", authMiddleware, userController.getMyComments);

module.exports = router;
