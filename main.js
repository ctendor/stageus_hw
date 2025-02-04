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

const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const API_BASE = "http://localhost:8000";

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "에러 발생");
  }
  return data;
}

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
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    document.getElementById("loginResult").innerText = JSON.stringify(data);
  }, "loginResult")
);

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

document
  .getElementById("createArticleForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      document.getElementById("createArticleResult").innerText =
        "로그인이 필요합니다.";
      return;
    }

    const formData = new FormData(e.target);
    const payload = {
      title: formData.get("title"),
      content: formData.get("content"),
      category: formData.get("category"),
    };

    try {
      const data = await request(`${API_BASE}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      document.getElementById("createArticleResult").innerText =
        "게시글 작성 성공: " + JSON.stringify(data);
    } catch (err) {
      document.getElementById("createArticleResult").innerText = err.message;
    }
  });

document
  .getElementById("createCommentForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      document.getElementById("createCommentResult").innerText =
        "로그인이 필요합니다.";
      return;
    }

    const formData = new FormData(e.target);
    const articleIdx = formData.get("articleIdx");
    const payload = {
      content: formData.get("content"),
    };

    try {
      const data = await request(
        `${API_BASE}/comments/${articleIdx}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      document.getElementById("createCommentResult").innerText =
        "댓글 작성 성공: " + JSON.stringify(data);
    } catch (err) {
      document.getElementById("createCommentResult").innerText = err.message;
    }
  });
