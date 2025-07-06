import customAxios from "../../config/axios.config";

const $ = (el) => document.querySelector(el);

const submit = $("#forgot-btn");
const email = $("#email");

const loginForm = $("#login");
const registerForm = $("#register");
const btnHighlightEl = document.querySelector(".container__btn-highlight");

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  const emailValue = email.value;

  try {
    await customAxios.post("/auth/forgot-password", {
      email: emailValue,
    });

    alert("OTP sent to your email");

    loginForm.style.transform = "translateX(100%)";
    registerForm.style.transform = "translateX(0%)";
    btnHighlightEl.style.left = "110px";
  } catch (error) {
    console.error("Error:", error);

    if (error.response) {
      alert(`Error: ${error.response.data.message || "Sending OTP failed"}`);
    } else if (error.request) {
      alert("No response from server!");
    } else {
      alert("Request setup failed!");
    }
  }
});
