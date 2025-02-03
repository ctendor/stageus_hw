// logs/logRouter.js
const express = require("express");
const logController = require("./logController");
const { dbUtils } = require("../utils/dbConnect");
const authMiddleware = require("../middlewares/authMiddleware");
const roleGuard = require("../middlewares/roleGuard");

const router = express.Router();

router.use(dbUtils);

// 관리자(admin) 권한이 필요한 경우: JWT 인증 후 roleGuard로 관리자 여부를 확인합니다.
router.get(
  "/",
  authMiddleware,
  roleGuard("admin"),
  logController.getLogsController
);

module.exports = router;
