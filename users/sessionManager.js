const session = require("express-session");
const customError = require("./customError");

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60,
  },
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

module.exports = {
  sessionMiddleware,
  createSession,
  destroySession,
};
