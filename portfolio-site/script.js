console.log("SCRIPT SAFE START");

/* =======================
   ELEMENTS
======================= */
let messageInput;
let messages;
let chatBox;
let lightbox;
let lightboxImg;
let closeBtn;
let galleryImages;
let galleryBoxes;
let sendBtn;
let prevBtn;
let nextBtn;

let projectModal;
let projectTitle;
let projectDesc;
let projectCloseBtn;

let projectGithub;
let projectLive;
let projectImage;

let currentIndex = 0;

/* =======================
   DATA
======================= */
const responses = {
  hello: ["Heyo! 👋", "Hello there! 😁", "Hi! ☺️"],
  bye: ["See ya! 👋", "Goodbye! 🤗"],
  price: ["Prices are on the page 💰"],
  contact: ["Email us 📬"],
  gallery: ["Check gallery 📸"],
  thanks: ["You're welcome! ☺️"],
  hours: ["We're open 24/7 👌"]
};

const keywords = {
  hello: ["hello", "hi", "hey"],
  bye: ["bye", "goodbye"],
  price: ["price", "pricing"],
  contact: ["contact", "email"],
  gallery: ["gallery", "images"],
  thanks: ["thanks", "thank you"],
  hours: ["open", "hours"]
};

/* =======================
   INIT
======================= */
window.addEventListener("DOMContentLoaded", () => {
  messageInput = document.getElementById("messageInput");
  messages = document.getElementById("messages");
  chatBox = document.getElementById("chatBox");

  lightbox = document.getElementById("lightbox");
  lightboxImg = document.getElementById("lightboxImg");
  closeBtn = document.getElementById("closeBtn");
  prevBtn = document.querySelector(".prev");
  nextBtn = document.querySelector(".next");

  galleryBoxes = Array.from(document.querySelectorAll(".img-box"));
  galleryImages = Array.from(document.querySelectorAll(".img-box img"));

  sendBtn = document.querySelector(".chat-input button");

projectModal = document.getElementById("projectModal");
projectTitle = document.getElementById("projectTitle");
projectDesc = document.getElementById("projectDesc");
projectCloseBtn = document.getElementById("projectCloseBtn");
projectGithub = document.getElementById("projectGithub");
projectLive = document.getElementById("projectLive");
projectImage = document.getElementById("projectImage");

  if (!messageInput || !messages || !sendBtn) {
    console.error("Missing chat elements!");
    return;
  }

  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  sendBtn.addEventListener("click", sendMessage);

  /* klik na project box = project modal */
 galleryBoxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    currentIndex = index;

    const img = box.querySelector("img");

    openProjectModal(
      box.dataset.title,
      box.dataset.desc,
      box.dataset.github,
      box.dataset.live,
      img ? img.src : ""
    );
  });
});

  /* lightbox close */
  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => showImage(currentIndex + 1));
  }

  /* modal close */
  if (projectCloseBtn) {
    projectCloseBtn.addEventListener("click", closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  /* PRIKAZI GALERIJU */
  document.querySelectorAll(".img-box").forEach((box, index) => {
    setTimeout(() => {
      box.classList.add("show");
    }, index * 120);
  });

  showVisibleSections();

  console.log("DOM READY OK");
});

/* =======================
   CHAT LOGIC
======================= */
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  createMessage(text, "user");
  messageInput.value = "";

  const bot = document.createElement("div");
  bot.className = "message bot";
  messages.appendChild(bot);

  showTyping();

  const reply = findReply(text.toLowerCase());

  setTimeout(() => {
    removeTyping();

    if (reply) {
      typeMessage(bot, reply);
    } else {
      fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${encodeURIComponent(text)}`)
        .then((r) => r.json())
        .then((d) => {
          typeMessage(bot, d.message || "Sorry, no reply right now.");
        })
        .catch(() => {
          typeMessage(bot, "Oops, something went wrong.");
        });
    }

    scrollToBottom();
  }, 600);
}

/* =======================
   HELPERS
======================= */
function createMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.textContent = text;
  messages.appendChild(msg);
  scrollToBottom();
}

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  removeTyping();

  const t = document.createElement("div");
  t.id = "typing";
  t.className = "message bot";
  t.textContent = "...";
  messages.appendChild(t);
  scrollToBottom();
}

function removeTyping() {
  const el = document.getElementById("typing");
  if (el) el.remove();
}

function typeMessage(el, text, speed = 15) {
  let i = 0;
  el.textContent = "";

  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      scrollToBottom();
      setTimeout(type, speed);
    }
  }

  type();
}

/* =======================
   BOT MATCH
======================= */
function findReply(text) {
  for (const key in keywords) {
    if (keywords[key].some((w) => text.includes(w))) {
      const arr = responses[key];
      return arr[Math.floor(Math.random() * arr.length)];
    }
  }
  return null;
}

/* =======================
   CHAT TOGGLE
======================= */
function toggleChat() {
  if (!chatBox) return;

  chatBox.style.display =
    chatBox.style.display === "block" ? "none" : "block";
}

function clearChat() {
  if (messages) {
    messages.innerHTML = "";
  }
}

/* =======================
   LIGHTBOX
======================= */
function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;

  lightbox.style.display = "flex";
  lightboxImg.src = src;

  setTimeout(() => {
    lightbox.classList.add("show");
  }, 10);
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("show");

  setTimeout(() => {
    lightbox.style.display = "none";
  }, 200);
}

function showImage(index) {
  if (!galleryImages.length || !lightboxImg) return;

  if (index < 0) index = galleryImages.length - 1;
  if (index >= galleryImages.length) index = 0;

  currentIndex = index;
  lightboxImg.src = galleryImages[currentIndex].src;
}

/* =======================
   PROJECT MODAL
======================= */
function openProjectModal(title, desc, github, live, imageSrc) {
  if (!projectModal || !projectTitle || !projectDesc) return;

  projectTitle.textContent = title || "Project";
  projectDesc.textContent = desc || "Project description coming soon.";

  if (projectImage) {
    projectImage.src = imageSrc || "";
    projectImage.alt = title || "Project preview";
  }

  if (projectGithub) {
    projectGithub.href = github || "#";

    if (!github || github === "#") {
      projectGithub.classList.add("disabled");
    } else {
      projectGithub.classList.remove("disabled");
    }
  }

  if (projectLive) {
    projectLive.href = live || "#";

    if (!live || live === "#") {
      projectLive.classList.add("disabled");
    } else {
      projectLive.classList.remove("disabled");
    }
  }

  projectModal.style.display = "flex";

  setTimeout(() => {
    projectModal.classList.add("show");
  }, 10);
}

function closeProjectModal() {
  if (!projectModal) return;

  projectModal.classList.remove("show");

  setTimeout(() => {
    projectModal.style.display = "none";
  }, 200);
}

/* =======================
   KEYBOARD CONTROLS
======================= */
document.addEventListener("keydown", (e) => {
  if (projectModal && projectModal.classList.contains("show")) {
    if (e.key === "Escape") closeProjectModal();
    return;
  }

  if (!lightbox || !lightbox.classList.contains("show")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showImage(currentIndex + 1);
  if (e.key === "ArrowLeft") showImage(currentIndex - 1);
});

/* =======================
   PAGE LOAD / SCROLL
======================= */
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  showVisibleSections();
});

window.addEventListener("scroll", showVisibleSections);

function showVisibleSections() {
  document.querySelectorAll(".hidden").forEach((sec) => {
    const rect = sec.getBoundingClientRect();

    if (rect.top < window.innerHeight - 100) {
      sec.classList.remove("hidden");
      sec.classList.add("show");
    }
  });
}