const notFoundMiddleware = (req, res, next) => {
  res.status(404).send({ message: "API를 찾을 수 없습니다." });
};

module.exports = notFoundMiddleware;

//해당 Router가 없을때 값을 주려고 만드는 middleware
