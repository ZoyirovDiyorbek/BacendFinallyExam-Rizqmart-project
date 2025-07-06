import customAxios from "../../config/axios.config";
import { baseURL } from "../../config/baseUrl";

const list = document.getElementById("announcementList");

async function loadLikedAnnouncements() {
  try {
    const likedRes = await customAxios.get("/liked/all");
    const likedData = likedRes.data.data;

    list.innerHTML = likedData.length
      ? ""
      : "<p>No liked announcements found.</p>";

    likedData.forEach((item) => {
      const announcement = item.announsement;

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
          <button class="like-btn liked">
            <i class="fas fa-heart"></i>
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
      likeBtn.onclick = async () => {
        const announcementId = Number(card.getAttribute("data-id"));

        try {
          await customAxios.delete("/liked", {
            data: { announcementId },
          });
          card.remove();
        } catch (err) {
          alert("❌ Error");
        }
      };
    });
  } catch (err) {
    console.error(err);
    list.innerHTML =
      "<p style='color:red;'>Error while connecting to the server.</p>";
  }
}

loadLikedAnnouncements();
