import customAxios from "../../config/axios.config";
import { baseURL } from "../../config/baseUrl";

const list = document.getElementById("announcementList");

async function loadAnnouncements() {
  try {
    const [lastSeenRes, likedRes] = await Promise.all([
      customAxios.get("/last-seen"),
      customAxios.get("/liked/all"),
    ]);

    const announcements = lastSeenRes.data.data;
    const likedIds = likedRes.data.data.map((item) => item.announcementId);

    list.innerHTML = announcements.length
      ? ""
      : "<p>No announcements found.</p>";

    announcements.forEach((item) => {
      const announcement = item.announsement;
      const isLiked = likedIds.includes(announcement.id);

      const card = document.createElement("div");
      card.className = "announcement";
      card.setAttribute("data-id", announcement.id);

      const images = announcement.images.map(
        (img) => `${baseURL}/uploads/${img}`
      );
      let current = 0;

      card.innerHTML = `
        <div class="image-slider">
          <img src="${images[0]}" class="slider-img" />
          <button class="prev-btn">&#10094;</button>
          <button class="next-btn">&#10095;</button>
        </div>
        <div class="announcement-content">
          <div class="title">${announcement.name}</div>
          <div class="price">$${Number(
            announcement.price
          ).toLocaleString()}</div>
          <div class="info">📍 ${announcement.location}</div>
          <div class="desc">${announcement.description}</div>
          <div class="desc">${announcement.user.email}</div>
        </div>
        <div class="actions">
          <button class="like-btn ${isLiked ? "liked" : ""}">
            <i class="fa${isLiked ? "s" : "r"} fa-heart"></i>
          </button>
        </div>
      `;

      list.appendChild(card);

      const imgTag = card.querySelector(".slider-img");
      const prevBtn = card.querySelector(".prev-btn");
      const nextBtn = card.querySelector(".next-btn");

      prevBtn.onclick = () => {
        current = (current - 1 + images.length) % images.length;
        imgTag.src = images[current];
      };
      nextBtn.onclick = () => {
        current = (current + 1) % images.length;
        imgTag.src = images[current];
      };

      const likeBtn = card.querySelector(".like-btn");
      const heartIcon = likeBtn.querySelector("i");

      likeBtn.onclick = async () => {
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
          alert("❌ Error");
        }
      };
    });
  } catch (err) {
    console.error(err);
    list.innerHTML =
      "<p style='color:red;'>Error while connecting the server.</p>";
  }
}

loadAnnouncements();
