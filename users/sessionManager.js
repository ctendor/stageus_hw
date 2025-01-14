const session = require("express-session");
const customError = require("../utils/customError");

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 1234,
  resave: false,
  saveUninitialized: false,
});

const createSession = (req, user) => {
  if (!user || !user.id) {
    throw customError("유효한 사용자 정보가 아닙니다.", 400);
  }

  req.session.user = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
};

const destroySession = (req) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(customError("세션 삭제에 실패했습니다.", 500));
      } else {
        resolve();
      }
    });
  });
};

const checkOwnership = (resourceIdField) => {
  return async (req, res, next) => {
    try {
      const { user } = req.session;
      const resourceId = req.params[resourceIdField];

      const resource = await findResourceById(resourceId);
      if (!resource) {
        throw customError("자원을 찾을 수 없습니다.", 404);
      }

      if (resource.authorId !== user.id) {
        throw customError("권한이 없습니다.", 403);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  sessionMiddleware,
  createSession,
  destroySession,
  checkOwnership,
};
