const express = require("express");
const userController = require("./userController");
const { dbUtils } = require("../utils/dbConnect");
const authMiddleware = require("../middlewares/authMiddleware"); // JWT 검증 미들웨어

const router = express.Router();

router.use(dbUtils);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.get("/kakao", userController.kakaoLogin);
router.get("/kakao/callback", userController.kakaoCallback);

router.get("/me", authMiddleware, userController.getUserInfo);
router.get("/me/articles", authMiddleware, userController.getMyArticles);
router.get("/me/comments", authMiddleware, userController.getMyComments);

router.post("/refresh", userController.refreshToken);

module.exports = router;
