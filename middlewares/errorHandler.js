const errorHandler = (err, req, res, next) => {
  try {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Error:", {
      statusCode,
      message,
      stack: err.stack,
    });

    res.status(statusCode).send({
      error: true,
      message,
    });
  } catch (loggingError) {
    console.error("Error logging failed:", loggingError);
    res.status(500).send({
      error: true,
      message: "Critical server error.",
    });
  }
};

const notFoundMiddleware = (req, res, next) => {
  res.status(404).send({
    message: "요청하신 API를 찾을 수 없습니다.",
  });
};

module.exports = { errorHandler, notFoundMiddleware };
