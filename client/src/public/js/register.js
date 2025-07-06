import customAxios from "../../config/axios.config";

const $ = (el) => document.querySelector(el);

const form = $("#register");
const email = $("#Remail");
const name = $("#name");
const password = $("#Rpassword");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailValue = email.value;
  const passwordValue = password.value;
  const nameValue = name.value;
  try {
    await customAxios.post("/auth/register", {
      email: emailValue,
      password: passwordValue,
      name: nameValue,
    });

    window.location.href = "../../index.html";
  } catch (error) {
    console.error("Register error:", error);
    if (error.response) {
      const message = error.response.data.message || "Error while register!";
      alert(`Error: ${message}`);
    } else if (error.request) {
      alert("No response from server!");
    } else {
      alert("Request setup failed!");
    }
  }
});
