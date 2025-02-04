// main.js

// asyncWrapper 함수: 에러 발생 시 두 번째 인자로 전달한 결과 요소에 에러 메시지 출력
const asyncWrapper = (fn, errorDisplayId) => {
  return function (...args) {
    fn(...args).catch((err) => {
      if (errorDisplayId) {
        document.getElementById(errorDisplayId).innerText = err.message;
      } else {
        console.error(err);
      }
    });
  };
};

// 로컬 스토리지에 저장할 토큰 키
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// API 서버 기본 주소 (필요에 따라 포트 번호 포함)
const API_BASE = "http://localhost:8000";

// 헬퍼 함수: JSON 응답 처리
async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "에러 발생");
  }
  return data;
}

// 회원가입 폼 처리
document.getElementById("registerForm").addEventListener(
  "submit",
  asyncWrapper(async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      username: formData.get("username"),
      password: formData.get("password"),
      name: formData.get("name"),
    };

    const data = await request(API_BASE + "/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    document.getElementById("registerResult").innerText = JSON.stringify(data);
  }, "registerResult")
);

// 로그인 폼 처리
document.getElementById("loginForm").addEventListener(
  "submit",
  asyncWrapper(async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const data = await request(API_BASE + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // accessToken과 refreshToken 저장
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    document.getElementById("loginResult").innerText = JSON.stringify(data);
  }, "loginResult")
);

// 로그아웃 버튼 처리
document.getElementById("logoutBtn").addEventListener(
  "click",
  asyncWrapper(async () => {
    const data = await request(API_BASE + "/users/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    document.getElementById("logoutResult").innerText = JSON.stringify(data);
  }, "logoutResult")
);

// 액세스 토큰 재발급 버튼 처리
document.getElementById("refreshBtn").addEventListener(
  "click",
  asyncWrapper(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error("리프레시 토큰이 없습니다.");
    }
    const data = await request(API_BASE + "/users/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    document.getElementById("refreshResult").innerText = JSON.stringify(data);
  }, "refreshResult")
);

// 내 정보 조회 버튼 처리
document.getElementById("getUserInfoBtn").addEventListener(
  "click",
  asyncWrapper(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }
    const data = await request(API_BASE + "/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    document.getElementById("userInfoResult").innerText = JSON.stringify(data);
  }, "userInfoResult")
);

// 내 글 조회 버튼 처리
document.getElementById("getMyArticlesBtn").addEventListener(
  "click",
  asyncWrapper(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }
    const data = await request(API_BASE + "/users/me/articles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    document.getElementById("myArticlesResult").innerText =
      JSON.stringify(data);
  }, "myArticlesResult")
);

// 내 댓글 조회 버튼 처리
document.getElementById("getMyCommentsBtn").addEventListener(
  "click",
  asyncWrapper(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }
    const data = await request(API_BASE + "/users/me/comments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    document.getElementById("myCommentsResult").innerText =
      JSON.stringify(data);
  }, "myCommentsResult")
);
