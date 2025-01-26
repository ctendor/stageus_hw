const express = require("express");
const userController = require("./userController");
const authMiddleware = require("../middlewares/authMiddleware");
const dbMiddleware = require("../utils/dbConnect");

const router = express.Router();
router.use(dbMiddleware);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", authMiddleware, userController.logout);
router.get("/me", authMiddleware, userController.getUserInfo);
router.get("/me/articles", authMiddleware, userController.getMyArticles);
router.get("/me/comments", authMiddleware, userController.getMyComments);

module.exports = router;
