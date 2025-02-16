const express = require("express");
const logController = require("./logController");
const { dbUtils } = require("../utils/dbConnect");
const authMiddleware = require("../middlewares/authMiddleware");
const roleGuard = require("../middlewares/roleGuard");

const router = express.Router();

router.use(dbUtils);

router.get(
  "/",
  authMiddleware,
  roleGuard("admin"),
  logController.getLogsController
);

module.exports = router;
