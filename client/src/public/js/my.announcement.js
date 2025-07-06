import customAxios from "../../config/axios.config";
import { baseURL } from "../../config/baseUrl";

const list = document.getElementById("announcementList");

async function loadAnnouncements() {
  try {
    const [announcementRes, likedRes] = await Promise.all([
      customAxios.get("/announcement/my"),
      customAxios.get("/liked/all"),
    ]);

    const announcements = announcementRes.data.data;
    const likedIds = likedRes.data.data.map((item) => item.announcementId);
    console.log(likedIds);

    list.innerHTML = announcements.length
      ? ""
      : "<p>No announcements found.</p>";

    announcements.forEach((item, index) => {
      const isLiked = likedIds.includes(item.id);
      const card = document.createElement("div");
      card.className = "announcement";
      card.setAttribute("data-id", item.id);

      const images = item.images.map((img) => `${baseURL}/uploads/${img}`);
      let current = 0;

      card.innerHTML = `
        <div class="image-slider">
          <img src="${images[0]}" class="slider-img" />
          <button class="prev-btn">&#10094;</button>
          <button class="next-btn">&#10095;</button>
        </div>
        <div class="announcement-content">
          <div class="title">${item.name}</div>
          <div class="price">$${Number(item.price).toLocaleString()}</div>
          <div class="info">📍 ${item.location}</div>
          <div class="desc">${item.description}</div>
        </div>
        <div class="actions">
          <button class="like-btn ${isLiked ? "liked" : ""}">
            <i class="fa${isLiked ? "s" : "r"} fa-heart"></i>
          </button>
          <button class="delete-btn">
            <i class="fas fa-trash"></i> Delete
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
          alert("❌ Like Error");
        }
      };

      const deleteBtn = card.querySelector(".delete-btn");
      deleteBtn.onclick = async () => {
        const id = card.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this announcement?")) {
          try {
            await customAxios.delete(`/announcement/${id}`);
            card.remove();
          } catch (err) {
            alert("❌ Delete Error");
          }
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
