const userService = require("./userService");
const asyncWrapper = require("../utils/asyncWrapper");
const customError = require("../utils/customError");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { usernameRegx, passwordRegx } = require("../constants/regx");

const register = [
  validateRequest({
    body: {
      username: { regex: usernameRegx, required: true },
      password: { regex: passwordRegx, required: true },
      name: { regex: /^.{1,50}$/, required: true },
    },
  }),
  asyncWrapper(async (req, res) => {
    const { username, password, name } = req.body;

    const newUser = await userService.registerUser({
      username,
      password,
      name,
    });

    res.status(201).send({
      message: "회원가입이 완료되었습니다.",
      user: newUser,
    });
  }),
];

const login = [
  validateRequest({
    body: {
      username: { regex: usernameRegx, required: true },
      password: { regex: passwordRegx, required: true },
    },
  }),
  asyncWrapper(async (req, res) => {
    const { username, password } = req.body;

    const user = await userService.authenticateUser({ username, password });

    req.session.user = {
      id: user.idx,
      username: user.username,
      name: user.name,
    };

    res.status(200).send({
      message: "로그인 성공",
      user: req.session.user,
    });
  }),
];

const logout = asyncWrapper(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw customError("로그아웃 처리 중 오류가 발생했습니다.", 500);
    }
    res.status(200).send({ message: "로그아웃 되었습니다." });
  });
});

const getUserInfo = asyncWrapper(async (req, res) => {
  const user = req.session.user;

  if (!user) {
    throw customError("로그인이 필요합니다.", 401);
  }

  res.status(200).send(user);
});

const getMyArticles = asyncWrapper(async (req, res) => {
  const { id: userId } = req.session.user;

  const articles = await userService.getArticlesByUser(userId);

  res.status(200).send(articles);
});

const getMyComments = asyncWrapper(async (req, res) => {
  const { id: userId } = req.session.user;

  const comments = await userService.getCommentsByUser(userId);

  res.status(200).send(comments);
});

module.exports = {
  register,
  login,
  logout,
  getUserInfo,
  getMyArticles,
  getMyComments,
};
