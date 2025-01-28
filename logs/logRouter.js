const express = require("express");
const { getLogs } = require("./logController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).send({ message: "접근 권한이 없습니다." });
  }
  next();
};

router.get("/", authMiddleware, adminMiddleware, getLogs);

module.exports = router;