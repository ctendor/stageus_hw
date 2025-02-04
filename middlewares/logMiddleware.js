// middlewares/.js
const Log = require("../logs/logModel");

module.exports = function logMiddleware(req, res, next) {
  const originalSend = res.send;
  let responseBody;

  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  res.on("finish", async () => {
    const logData = {
      useridx: req.user ? String(req.user.id) : null,
      date: new Date(),
      method: req.method,
      originalUrl: req.originalUrl,
      statusCode: res.statusCode,
      requestBody: req.body,
      requestQuery: req.query,
      requestParams: req.params,
      responseBody,
      ip: req.ip,
    };
    try {
      await Log.create(logData);
    } catch (err) {
      console.error("로그 저장 실패:", err);
    }
  });

  next();
};
