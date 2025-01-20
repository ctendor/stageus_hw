const userService = require("./userService");
const asyncWrapper = require("../utils/asyncWrapper");
const customError = require("../utils/customError");

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

  req.session.user = {
    id: user.idx,
    username: user.username,
    name: user.name,
  };

  res.status(200).send({
    message: "로그인 성공",
    user: req.session.user,
  });
});

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

module.exports = {
  register,
  login,
  logout,
  getUserInfo,
};
