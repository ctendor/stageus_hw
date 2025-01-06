const idxRegx = /^[0-9]+$/;
const titleRegx = /^.{1,20}$/;
const passwordRegx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
const categoryRegx = /^(1|2)$/;

module.exports = { idxRegx, titleRegx, passwordRegx, categoryRegx };
