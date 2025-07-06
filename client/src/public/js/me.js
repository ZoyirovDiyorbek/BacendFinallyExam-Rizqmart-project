import customAxios from "../../config/axios.config.js";

const $ = (el) => document.querySelector(el);

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function displayProfile(userData) {
  const user = userData.data;

  $("#userName").textContent = user.name;
  $("#userRole").textContent = user.role;
  $("#userId").textContent = user.id;
  $("#userNameDetail").textContent = user.name;
  $("#userEmail").textContent = user.email;
  $("#userCreatedAt").textContent = formatDate(user.createdAt);
}

function showError(message) {
  $("#errorText").textContent = message;
  $("#errorMessage").style.display = "block";
}

async function fetchProfile() {
  try {
    $(".logout").style.display = "none";

    const response = await customAxios.get("/auth/me");

    if (response.data && response.data.message === "success") {
      displayProfile(response.data);
      $("#profileContent").style.display = "block";
    } else {
      showError("Incorrect profile info");
    }
  } catch (error) {
    console.error("Error while getting profile info", error);

    if (error.response && error.response.status === 401) {
      showError("Authorization error");
      setTimeout(() => {
        window.location.href = "./sign.html";
      }, 2000);
    } else {
      showError("Please login");
    }
  }
}

const logoutBtn = $(".logout");

logoutBtn.addEventListener("click", async () => {
  console.log("Logout bosildi");
  try {
    await customAxios.get("/auth/logout");
    window.location.href = "./sign.html";
  } catch (err) {
    showError("Logout failed");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  fetchProfile();
  logoutBtn.style.display = "";
});
