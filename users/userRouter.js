// users/userRouter.js
const express = require("express");
const userController = require("./userController");
const { dbUtils } = require("../utils/dbConnect");
const authMiddleware = require("../middlewares/authMiddleware"); // JWT 검증 미들웨어

const router = express.Router();

router.use(dbUtils);

// 회원가입, 로그인, 로그아웃
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// 카카오 OAuth 로그인 관련 엔드포인트
router.get("/kakao", userController.kakaoLogin);
router.get("/kakao/callback", userController.kakaoCallback);

// 내 정보/글/댓글 (JWT 인증 필요)
router.get("/me", authMiddleware, userController.getUserInfo);
router.get("/me/articles", authMiddleware, userController.getMyArticles);
router.get("/me/comments", authMiddleware, userController.getMyComments);

// 새 액세스 토큰 발급
router.post("/refresh", userController.refreshToken);

module.exports = router;
