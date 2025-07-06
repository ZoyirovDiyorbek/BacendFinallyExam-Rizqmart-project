const $ = (el) => document.querySelector(el);

const logInBtn = $(".container__toggle-btn--login");
const registerBtn = $(".container__toggle-btn--register");
const btnHighlightEl = $(".container__btn-highlight");
const loginForm = $("#login");
const registerForm = $("#register");
const withGoogle = $(".container__social-icons");

logInBtn.onclick = () => {
  loginForm.style.transform = "translateX(0%)";
  registerForm.style.transform = "translateX(100%)";
  btnHighlightEl.style.left = "0";
  withGoogle.style.display = "";
};

registerBtn.onclick = () => {
  loginForm.style.transform = "translateX(100%)";
  registerForm.style.transform = "translateX(0%)";
  btnHighlightEl.style.left = "110px";
  withGoogle.style.display = "none";
};
