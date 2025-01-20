const userService = require("./userService");
const asyncWrapper = require("../utils/asyncWrapper");
const customError = require("../utils/customError");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "my-secret-key";

const register = asyncWrapper(async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    throw customError("모든 필드를 입력해주세요.", 400);
  }

  const newUser = await userService.registerUser({ username, password, name });

  res.status(201).send({
    message: "회원가입이 완료되었습니다.",
    user: newUser,
  });
});

const login = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw customError("아이디와 비밀번호를 입력해주세요.", 400);
  }

  const user = await userService.authenticateUser({ username, password });

  const token = jwt.sign(
    { id: user.idx, username: user.username, name: user.name },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.status(200).send({
    message: "로그인 성공",
    accessToken: token,
  });
});

const getUserInfo = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;

  const user = await userService.getUserById(userId);

  if (!user) {
    throw customError("사용자 정보를 찾을 수 없습니다.", 404);
  }

  res.status(200).send(user);
});

const getMyArticles = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;

  const articles = await userService.getArticlesByUser(userId);

  res.status(200).send(articles);
});

const getMyComments = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;

  const comments = await userService.getCommentsByUser(userId);

  res.status(200).send(comments);
});

module.exports = {
  register,
  login,
  getUserInfo,
  getMyArticles,
  getMyComments,
};
