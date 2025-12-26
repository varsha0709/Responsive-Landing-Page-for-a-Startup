/* =========================================
   Nimbus Startup Landing — script.js
   Interactions: sticky navbar, smooth scroll,
   mobile menu, reveal animations, carousel,
   form validation, footer year.
   ========================================= */

// Utility: select helpers
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

// Footer year
(() => {
  const yearEl = $("#year");
  yearEl?.textContent = new Date().getFullYear(); // ✅ optional chaining
})();

// Mobile hamburger menu
(() => {
  const toggle = $(".nav-toggle");
  const menu = $("#nav-menu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    toggle.classList.toggle("active");
    menu.classList.toggle("open");
  });

  $$(".nav-link", menu).forEach((link) =>
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
    })
  );
})();

// Smooth scrolling enhancement
(() => {
  const links = $$(".nav-link");
  const headerHeight = $(".nav")?.offsetHeight || 0;

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      // ✅ clearer positive condition
      if (href === null || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const rectTop = target.getBoundingClientRect().top + window.scrollY;
      const offsetTop = Math.max(rectTop - headerHeight + 4, 0);

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  });
})();

// Hero animation
(() => {
  const onLoadEls = $$(".animate-in");
  window.addEventListener("load", () => {
    onLoadEls.forEach((el) => el.classList.add("show"));
  });
})();

// Reveal animations
(() => {
  const reveals = $$(".reveal");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.18 }
  );

  reveals.forEach((el) => io.observe(el));
})();

// Testimonials carousel
(() => {
  const track = $(".testimonial-track");
  const prev = $(".carousel-btn.prev");
  const next = $(".carousel-btn.next");
  const dotsContainer = $(".carousel-dots");

  if (!track || !prev || !next || !dotsContainer) return;

  const slides = $$(".testimonial-card", track);
  const total = slides.length;
  let index = 0;
  let autoTimer;

  // Create dots dynamically
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  const dots = $$(".carousel-dot", dotsContainer);

  function updateUI() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function goTo(i) {
    index = (i + total) % total;
    updateUI();
    restartAuto();
  }

  function nextSlide() {
    goTo(index + 1);
  }

  function prevSlide() {
    goTo(index - 1);
  }

  prev.addEventListener("click", prevSlide);
  next.addEventListener("click", nextSlide);

  function startAuto() {
    autoTimer = setInterval(nextSlide, 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  const carousel = $(".testimonial-carousel");
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  updateUI();
  startAuto();
})();

// Contact form validation
(() => {
  const form = $("#contact-form");
  if (!form) return;

  const name = $("#name");
  const email = $("#email");
  const message = $("#message");
  const successEl = $(".form-success");

  function setError(field, message) {
    const errEl = field.parentElement.querySelector(".field-error");
    if (errEl) errEl.textContent = message || "";
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successEl.textContent = "";

    let valid = true;

    if (name.value.trim() === "") {
      setError(name, "Please enter your name.");
      valid = false;
    } else {
      setError(name, "");
    }

    if (email.value.trim() === "") {
      setError(email, "Please enter your email.");
      valid = false;
    } else if (validateEmail(email.value.trim()) === false) {
        setError(email, "Please enter a valid email address.");
        valid = false;
    }   else {
      setError(email, "");
    }

    if (message.value.trim() === "") {
      setError(message, "Please enter a message.");
      valid = false;
    } else if (message.value.trim().length < 10) {
      setError(message, "Please provide a bit more detail (10+ characters).");
      valid = false;
    } else {
      setError(message, "");
    }

    // ✅ Positive condition
    if (valid) {
      successEl.textContent =
        "Thanks! Your message has been received. We’ll be in touch shortly.";
      form.reset();

      successEl.style.opacity = "0";
      requestAnimationFrame(() => {
        successEl.style.transition = "opacity 300ms ease";
        successEl.style.opacity = "1";
      });
    }
  });

  [name, email, message].forEach((field) => {
    field.addEventListener("input", () => {
      if (field.value.trim() !== "") {
        setError(field, "");
      }
    });
  });
})();
