const notFoundMiddleware = (req, res, next) => {
  res.status(404).send({
    message: "요청하신 API를 찾을 수 없습니다.",
  });
};

module.exports = { notFoundMiddleware };
