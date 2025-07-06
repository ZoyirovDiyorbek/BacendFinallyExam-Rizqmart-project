import customAxios from "../../config/axios.config";

const $ = (el) => document.querySelector(el);

const submit = $("#reset-btn");
const email = $("#Remail");
const password = $("#Rpassword");
const otp = $("#otp");

submit.addEventListener("click", async (e) => {
  e.preventDefault();

  const emailValue = email.value;
  const passwordValue = password.value;
  const otpValue = otp.value;
  try {
    await customAxios.post("/auth/reset-password", {
      email: emailValue,
      newPassword: passwordValue,
      otp: otpValue,
    });

    alert("Your password successfully updated!");
    window.location.href = "../../pages/sign.html";
  } catch (error) {
    console.error("Error:", error);

    if (error.response) {
      alert(
        `Error: ${error.response.data.message || "Changing password failed!"}`
      );
    } else if (error.request) {
      alert("No response from server!");
    } else {
      alert("Request setup failed!");
    }
  }
});
