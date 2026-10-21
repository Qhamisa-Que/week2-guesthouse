const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", function () {
  navLinks.classList.toggle("open");
  navToggle.classList.toggle("active");

  const isOpen = navLinks.classList.contains("open");
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", false);
    navToggle.setAttribute("aria-label", "Open menu");
  });
});

// ===== GALLERY LIGHTBOX =====
(function () {
  const photos = Array.from(document.querySelectorAll(".gallery img"));
  const lightbox = document.querySelector("#gallery-lightbox");

  if (!lightbox || photos.length === 0) return;

  const largePhoto = lightbox.querySelector("#lightbox-image");
  const caption = lightbox.querySelector("#lightbox-caption");
  let currentIndex = 0;
  let opener = null;

  function showPhoto(index) {
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];
    largePhoto.src = photo.currentSrc || photo.src;
    largePhoto.alt = photo.alt;
    caption.textContent = `${photo.alt} (${currentIndex + 1} of ${photos.length})`;
  }

  photos.forEach(function (photo, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-trigger";
    button.setAttribute("aria-label", `Enlarge photo: ${photo.alt}`);
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-controls", "gallery-lightbox");
    photo.before(button);
    button.append(photo);

    button.addEventListener("click", function () {
      opener = button;
      showPhoto(index);
      lightbox.showModal();
      document.body.classList.add("lightbox-open");
    });
  });

  lightbox.querySelector(".lightbox__close").addEventListener("click", function () {
    lightbox.close();
  });

  lightbox.querySelector(".lightbox__previous").addEventListener("click", function () {
    showPhoto(currentIndex - 1);
  });

  lightbox.querySelector(".lightbox__next").addEventListener("click", function () {
    showPhoto(currentIndex + 1);
  });

  lightbox.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPhoto(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(currentIndex + 1);
    }
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener("close", function () {
    document.body.classList.remove("lightbox-open");
    if (opener) opener.focus({ preventScroll: true });
  });
})();

// ===== FAQ ACCORDION =====
(function () {
  const faqItems = document.querySelectorAll("#faq .faq-item");

  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;

      faqItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });
})();