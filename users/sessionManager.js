const session = require("express-session");
const customError = require("../utils/customError");
const { findResourceById } = require("../utils/findResource");

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

const checkOwnership = (resourceTable, resourceIdField) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdField];

      if (!resourceId) {
        throw customError("자원 ID가 제공되지 않았습니다.", 400);
      }

      const resource = await findResourceById(resourceTable, resourceId);

      if (!resource) {
        throw customError("자원을 찾을 수 없습니다.", 404);
      }

      const { id: userId } = req.user;

      if (resource.authorIdx !== userId) {
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
