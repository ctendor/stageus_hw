const notFoundMiddleware = (req, res, next) => {
  res.status(404).send({ message: "API를 찾을 수 없습니다." });
};

module.exports = notFoundMiddleware;
