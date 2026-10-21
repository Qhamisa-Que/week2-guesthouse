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

// ===== BOOKING FORM VALIDATION =====
(function () {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const nameField = form.querySelector("#name");
  const phoneField = form.querySelector("#phone");
  const dateField = form.querySelector("#checkin");
  const roomField = form.querySelector("#room");
  const messageField = form.querySelector("#message");
  const fields = [nameField, phoneField, dateField, roomField, messageField];

  if (fields.some(function (field) {
    return !field || !form.querySelector(`#${field.id}-error`);
  })) return;

  function todayInSouthAfrica() {
    const parts = new Intl.DateTimeFormat("en", {
      timeZone: "Africa/Johannesburg",
      year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());

    function part(type) {
      return parts.find(function (item) {
        return item.type === type;
      }).value;
    }

    return `${part("year")}-${part("month")}-${part("day")}`;
  }

  function phoneLooksValid(value) {
    const number = value.replace(/[\s()-]/g, "");

    if (/^\+?27/.test(number)) {
      return /^\+?27[1-9]\d{8}$/.test(number);
    }

    return /^0[1-9]\d{8}$/.test(number) ||
           /^\+[1-9]\d{6,14}$/.test(number);
  }

  function errorFor(field) {
    const value = field.value.trim();

    if (field === nameField) {
      if (value.length < 2) {
        return "Please enter your name (at least 2 characters).";
      }
      if (value.length > 80) {
        return "Please use no more than 80 characters for your name.";
      }
    }

    if (field === phoneField) {
      if (!value) {
        return "Please enter a phone or WhatsApp number.";
      }
      if (!phoneLooksValid(value)) {
        return "Use a 10-digit South African number, or + and an international country code.";
      }
    }

    if (field === dateField) {
      dateField.min = todayInSouthAfrica();

      if (!value) {
        return "Please choose your check-in date.";
      }
      if (value < dateField.min) {
        return "Choose today or a future check-in date.";
      }
    }

    if (field === roomField && !value) {
      return "Please choose a room.";
    }

    if (field === messageField && value.length > 1000) {
      return "Please keep your message to 1,000 characters or fewer.";
    }

    return "";
  }

  function validateField(field) {
    const error = errorFor(field);
    form.querySelector(`#${field.id}-error`).textContent = error;
    field.setAttribute("aria-invalid", String(Boolean(error)));
    return error === "";
  }

  fields.forEach(function (field) {
    field.addEventListener("blur", function () {
      validateField(field);
    });

    field.addEventListener("change", function () {
      validateField(field);
    });

    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", function (event) {
    const invalidFields = fields.filter(function (field) {
      return !validateField(field);
    });

    if (invalidFields.length > 0) {
      event.preventDefault();
      invalidFields[0].focus();
      return;
    }

    nameField.value = nameField.value.trim();
    phoneField.value = phoneField.value.trim();
    messageField.value = messageField.value.trim();
  });

  dateField.min = todayInSouthAfrica();
  form.noValidate = true;
})();