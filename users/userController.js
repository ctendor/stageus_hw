// users/userController.js

const userService = require("./userService");
const asyncWrapper = require("../utils/asyncWrapper");
const customError = require("../utils/customError");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { usernameRegx, passwordRegx } = require("../constants/regx");
const axios = require("axios");

// 1) 회원가입
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

// 2) 로그인 → JWT 발급
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

    // JWT 발급
    const accessToken = userService.generateAccessToken(user);
    const refreshToken = userService.generateRefreshToken(user);

    // (예시) refresh token을 쿠키 대신 응답으로 보냄
    return res.status(200).json({
      message: "로그인 성공",
      accessToken,
      refreshToken,
    });
  }),
];

// 3) 로그아웃
const logout = asyncWrapper(async (req, res) => {
  res.status(200).send({ message: "로그아웃 되었습니다." });
});

// 4) 사용자 정보 조회
const getUserInfo = asyncWrapper(async (req, res) => {
  if (!req.user) {
    throw customError("인증이 필요합니다.", 401);
  }
  const userId = req.user.id;
  const rows = await userService.getArticlesByUser(userId);
  res.status(200).send({
    message: "유저 정보",
    userId,
    articlesCount: rows.length,
  });
});

// 5) 내 글 목록
const getMyArticles = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  const articles = await userService.getArticlesByUser(userId);
  res.status(200).send(articles);
});

// 6) 내 댓글 목록
const getMyComments = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  const comments = await userService.getCommentsByUser(userId);
  res.status(200).send(comments);
});

// 7) Refresh Token → 새 Access Token
const refreshToken = asyncWrapper(async (req, res) => {
  const { refreshToken } = req.cookies || req.body;
  if (!refreshToken) {
    throw customError("리프레시 토큰이 없습니다.", 400);
  }
  const newAccessToken = await userService.refreshAccessToken(refreshToken);
  res.status(200).json({
    message: "새 Access Token 발급",
    accessToken: newAccessToken,
  });
});

// 8) 카카오 OAuth 로그인: 카카오 인증 페이지로 리다이렉트
const kakaoLogin = asyncWrapper(async (req, res) => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_CALLBACK_URL}&response_type=code`;
  res.redirect(kakaoAuthUrl);
});

// 9) 카카오 OAuth 콜백 처리
const kakaoCallback = asyncWrapper(async (req, res) => {
  const { code } = req.query;
  if (!code) {
    throw customError("인증 코드가 없습니다.", 400);
  }
  // 카카오 토큰 교환
  const tokenResponse = await axios({
    method: "post",
    url: "https://kauth.kakao.com/oauth/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_CLIENT_ID,
      redirect_uri: process.env.KAKAO_CALLBACK_URL,
      code,
      client_secret: process.env.KAKAO_CLIENT_SECRET || "",
    }).toString(),
  });
  const kakaoAccessToken = tokenResponse.data.access_token;
  if (!kakaoAccessToken) {
    throw customError("카카오 액세스 토큰 발급에 실패했습니다.", 400);
  }
  // 카카오 사용자 정보 조회
  const userResponse = await axios({
    method: "get",
    url: "https://kapi.kakao.com/v2/user/me",
    headers: { Authorization: `Bearer ${kakaoAccessToken}` },
  });
  const kakaoUser = userResponse.data;
  // 카카오 사용자 정보로 기존 사용자 조회 또는 신규 가입 처리
  let user = await userService.findOrCreateKakaoUser(kakaoUser);
  // JWT 발급
  const accessToken = userService.generateAccessToken(user);
  const refreshToken = userService.generateRefreshToken(user);
  res.status(200).json({
    message: "카카오 로그인 성공",
    accessToken,
    refreshToken,
  });
  return res.redirect(
    "file:///Users/tk/Desktop/STUDY/stageus/homework/index.html"
  );
});

module.exports = {
  register,
  login,
  logout,
  getUserInfo,
  getMyArticles,
  getMyComments,
  refreshToken,
  kakaoLogin,
  kakaoCallback,
};
