const { saveLog } = require("./utils/logger"); // MongoDB 로그 유틸리티

const logMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - startTime;
    const logData = {
      userId: req.user?.id || null,
      date: new Date(),
      request: {
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        headers: req.headers,
      },
      response: {
        statusCode: res.statusCode,
        message: res.statusMessage,
      },
      ip: req.ip,
      duration,
    };

    try {
      await saveLog(logData);
      console.log(`로그 저장 성공: ${req.originalUrl}`);
    } catch (err) {
      console.error("로그 저장 실패:", err);
    }
  });

  next();
};

module.exports = logMiddleware;
