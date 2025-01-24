const titleRegx = /^.{1,20}$/;
const passwordRegx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
const categoryRegx = /^(1|2)$/;
const usernameRegx = /^.{3,8}$/;
const commentRegx = /^.{1,}$/;
module.exports = {
  titleRegx,
  passwordRegx,
  categoryRegx,
  usernameRegx,
  commentRegx,
};
