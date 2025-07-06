import customAxios from "../../config/axios.config";

const $ = (el) => document.getElementById(el);

let selectedImages = [], categories = [];

const fileUpload = $("fileUpload"),
  fileInput = $("images"),
  imagePreview = $("imagePreview"),
  submitBtn = $("submitBtn"),
  successMessage = $("successMessage"),
  errorMessage = $("errorMessage");

window.addEventListener("load", async () => {
  try {
    const res = await customAxios.get("/category");
    categories = res.data.data;
    $("categoryId").innerHTML = '<option value="">Select Category</option>';
    categories.forEach(({ id, name }) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = name;
      $("categoryId").appendChild(opt);
    });
  } catch (err) {
    console.error("Category error:", err);
    showError("Failed to load categories");
  }
});

[fileUpload, fileInput].forEach((el) => {
  el.addEventListener("dragover", (e) => e.preventDefault());
  el.addEventListener("drop", (e) => {
    e.preventDefault();
    fileUpload.classList.remove("dragover");
    handleFiles([...e.dataTransfer.files]);
  });
});
fileInput.addEventListener("change", (e) => handleFiles([...e.target.files]));

fileUpload.addEventListener("dragover", (e) => {
  e.preventDefault();
  fileUpload.classList.add("dragover");
});
fileUpload.addEventListener("dragleave", () =>
  fileUpload.classList.remove("dragover")
);

function handleFiles(files) {
  const images = files.filter((f) => f.type.startsWith("image/"));
  if (selectedImages.length + images.length > 10) {
    return showError("Maximum 10 images can be uploaded!");
  }
  images.forEach((file) => {
    if (selectedImages.length < 10) {
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedImages.push({ file, url: e.target.result });
        displayImages();
      };
      reader.readAsDataURL(file);
    }
  });
}

function displayImages() {
  imagePreview.innerHTML = "";
  selectedImages.forEach((img, i) => {
    const div = document.createElement("div");
    div.className = "image-item";
    div.innerHTML = `
      <img src="${img.url}" alt="Image ${i + 1}">
      <button type="button" class="remove-image" onclick="removeImage(${i})">×</button>
    `;
    imagePreview.appendChild(div);
  });
}

window.removeImage = (i) => {
  selectedImages.splice(i, 1);
  displayImages();
};

$("announcementForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Publishing...";

  const fd = new FormData();
  ["name", "description", "price", "location", "categoryId"].forEach((id) =>
    fd.append(id, $(id).value)
  );
  selectedImages.forEach(({ file }) => fd.append("images", file));

  try {
    await customAxios.post("/announcement", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    showSuccess("Announcement successfully published!");
    $("announcementForm").reset();
    selectedImages = [];
    displayImages();
  } catch (err) {
    console.error("Announcement error:", err);
    showError("Failed to publish announcement. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Publish Announcement";
  }
});

const showSuccess = (msg) => {
  successMessage.textContent = `✅ ${msg}`;
  successMessage.style.display = "block";
  errorMessage.style.display = "none";
  setTimeout(() => (successMessage.style.display = "none"), 5000);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const showError = (msg) => {
  errorMessage.textContent = `❌ ${msg}`;
  errorMessage.style.display = "block";
  successMessage.style.display = "none";
  setTimeout(() => (errorMessage.style.display = "none"), 5000);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// $("price").addEventListener("input", (e) => {
//   let val = e.target.value.replace(/\D/g, "");
//   if (val) e.target.value = parseInt(val).toLocaleString("en-US");
// });
// $("price").addEventListener("blur", (e) => {
//   e.target.value = e.target.value.replace(/\D/g, "");
// });
