const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const authService = require("../users/authService");
const {
  KAKAO_CLIENT_ID,
  KAKAO_CALLBACK_URL,
} = require("../constants/constants"); // ← 경로 수정

passport.use(
  new KakaoStrategy(
    {
      clientID: KAKAO_CLIENT_ID,
      callbackURL: KAKAO_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await authService.findOrCreateKakaoUser(
          profile,
          accessToken
        );
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// 세션 사용 안 해도 내부적으로 serialize/deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await authService.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
