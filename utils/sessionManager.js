const session = require("express-session");
const customError = require("./customError");
const { findResourceById } = require("./findResource");

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "1234",
  resave: false,
  saveUninitialized: false,
});

const createSessionMiddleware = (req, res, next) => {
  try {
    const { user } = req.body;

    if (!user || !user.id) {
      throw customError("유효한 사용자 정보가 아닙니다.", 400);
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (err) {
    next(err);
  }
};

const destroySessionMiddleware = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(customError("세션 삭제에 실패했습니다.", 500));
        } else {
          resolve();
        }
      });
    });

    res.status(200).send({ message: "세션이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sessionMiddleware,
  createSessionMiddleware,
  destroySessionMiddleware,
  checkOwnership,
};
