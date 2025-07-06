import customAxios from "../../config/axios.config";
import { baseURL } from "../../config/baseUrl";

const categorySelect = document.getElementById("categorySelect");
const locationSelect = document.getElementById("locationSelect");
const list = document.getElementById("announcementList");
const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector(".search-btn");

async function loadCategories() {
  try {
    const res = await customAxios.get("/category");
    const categories = res.data.data;

    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error while get categories", err);
  }
}

function getFilters() {
  const filters = {};

  const searchTerm = searchInput.value.trim();
  const selectedCategory = categorySelect.value;
  const selectedLocation = locationSelect.value;

  if (searchTerm) {
    filters.search = searchTerm;
  }

  if (selectedCategory) {
    filters.categoryId = selectedCategory;
  }

  if (selectedLocation) {
    filters.location = selectedLocation;
  }

  return filters;
}

async function loadAnnouncements(filters = {}) {
  try {
    let url = "/announcement";
    const params = new URLSearchParams();

    if (filters.search) {
      url = "/announcement/search";
      params.append("name", filters.search);
    }

    if (filters.categoryId) {
      params.append("categoryId", filters.categoryId);
    }

    if (filters.location) {
      params.append("location", filters.location);
    }

    const queryString = params.toString();
    const finalUrl = `${url}${queryString ? `?${queryString}` : ""}`;

    const [announcementRes, likedRes] = await Promise.all([
      customAxios.get(finalUrl),
      customAxios.get("/liked/all"),
    ]);

    const announcements =
      announcementRes?.data?.data || announcementRes?.data || [];
    const likedIds =
      likedRes?.data?.data?.map((item) => item.announcementId) || [];

    renderAnnouncements(announcements, likedIds);
  } catch (err) {
    console.error("Error while loading announcements:", err);
    list.innerHTML =
      "<p style='color:red;'>Error while connecting the server.</p>";
  }
}

async function search() {
  const filters = getFilters();
  await loadAnnouncements(filters);
}

function renderAnnouncements(announcements, likedIds) {
  if (!Array.isArray(announcements)) {
    list.innerHTML = "<p style='color:red;'>Error: Invalid data format.</p>";
    return;
  }

  if (!Array.isArray(likedIds)) {
    likedIds = [];
  }

  list.innerHTML = announcements.length ? "" : "<p>No announcements found.</p>";

  announcements.forEach((item) => {
    if (!item || !item.id) {
      return;
    }

    console.log(item.userid)
    const isLiked = likedIds.includes(item.id);
    const card = document.createElement("div");
    card.className = "announcement";
    card.setAttribute("data-id", item.id);

    const images =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images.map((img) => `${baseURL}/uploads/${img}`)
        : [`${baseURL}/uploads/default.jpg`];

    card.innerHTML = `
      <div class="image-slider">
        <img src="${images[0]}" class="slider-img" alt="${
      item.name || "Announcement"
    }" />
        ${
          images.length > 1
            ? `
          <button class="prev-btn">&#10094;</button>
          <button class="next-btn">&#10095;</button>
        `
            : ""
        }
      </div>
      <div class="announcement-content">
        <div class="title">${item.name || "No title"}</div>
        <div class="price">$${
          item.price ? Number(item.price).toLocaleString() : "0"
        }</div>
        <div class="info">📍 ${item.location || "No location"}</div>
        <div class="desc">${item.description || "No description"}</div>
        <div class="desc">${item.user.email || "No email"}</div>
      </div>
      <div class="actions">
        <button class="like-btn ${isLiked ? "liked" : ""}">
          <i class="fa${isLiked ? "s" : "r"} fa-heart"></i>
        </button>
      </div>
    `;

    list.appendChild(card);

    if (images.length > 1) {
      setupImageSlider(card, images);
    }

    setupLikeButton(card);
    setupCardClick(card, item);
  });
}

function setupImageSlider(card, images) {
  const imgTag = card.querySelector(".slider-img");
  const prevBtn = card.querySelector(".prev-btn");
  const nextBtn = card.querySelector(".next-btn");
  let current = 0;

  if (prevBtn && nextBtn) {
    prevBtn.onclick = (e) => {
      e.stopPropagation();
      current = (current - 1 + images.length) % images.length;
      imgTag.src = images[current];
    };

    nextBtn.onclick = (e) => {
      e.stopPropagation();
      current = (current + 1) % images.length;
      imgTag.src = images[current];
    };
  }
}

function setupLikeButton(card) {
  const likeBtn = card.querySelector(".like-btn");
  const heartIcon = likeBtn.querySelector("i");

  likeBtn.onclick = async (e) => {
    e.stopPropagation();

    const announcementId = Number(card.getAttribute("data-id"));
    const currentlyLiked = likeBtn.classList.contains("liked");

    if (currentlyLiked) {
      likeBtn.classList.remove("liked");
      heartIcon.className = "far fa-heart";
    } else {
      likeBtn.classList.add("liked");
      heartIcon.className = "fas fa-heart";
    }

    try {
      if (currentlyLiked) {
        await customAxios.delete("/liked", {
          data: { announcementId },
        });
      } else {
        await customAxios.post("/liked", { announcementId });
      }
    } catch (err) {
      if (currentlyLiked) {
        likeBtn.classList.add("liked");
        heartIcon.className = "fas fa-heart";
      } else {
        likeBtn.classList.remove("liked");
        heartIcon.className = "far fa-heart";
      }
      alert("Error updating like status");
    }
  };
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  search();
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    search();
  }
});

categorySelect.addEventListener("change", () => {
  search();
});

locationSelect.addEventListener("change", () => {
  search();
});

let searchTimeout;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    search();
  }, 500);
});
function setupCardClick(card, item) {
  const modal = document.getElementById("announcementModal");
  const modalImg = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalLocation = document.getElementById("modalLocation");
  const modalDescription = document.getElementById("modalDescription");

  card.addEventListener("click", async () => {
    modal.classList.remove("hidden");

    try {
      await customAxios.get(`/announcement/${item.id}`);
    } catch (err) {
      console.error("Error sending last seen via GET /announcement/:id", err);
    }

    modalImg.src = item.images?.length
      ? `${baseURL}/uploads/${item.images[0]}`
      : `${baseURL}/uploads/default.jpg`;
    modalTitle.textContent = item.name || "No title";
    modalPrice.textContent = `$${item.price || 0}`;
    modalLocation.textContent = `📍 ${item.location || "No location"}`;
    modalDescription.textContent = item.description || "No description";
  });

  document.querySelector(".close-btn").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadAnnouncements();
});
