import customAxios from "../../config/axios.config";

const $ = (el) => document.querySelector(el);

const email = $("#email");
const password = $("#password");
const logInBtn = $("#login-btn");
const googleBtn = $(".google-btn");

logInBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const emailValue = email.value;
  const passwordValue = password.value;

  try {
    await customAxios.post("/auth/login", {
      email: emailValue,
      password: passwordValue,
    });

    window.location.href = "../../main.html";
  } catch (error) {
    console.error("Login error:", error);

    if (error.response) {
      alert(`Error: ${error.response.data.message || "Login failed"}`);
    } else if (error.request) {
      alert("No response from server!");
    } else {
      alert("Request setup failed!");
    }
  }
});
googleBtn.addEventListener("click", (e) => {
  e.preventDefault();

  try {
    const serverUrl = process.env.SERVER_BASE_URL;
    window.location.href = `${serverUrl}/auth/google`;
  } catch (error) {
    console.error("Google auth error:", error);
    alert("Error while login with google!");
  }
});
