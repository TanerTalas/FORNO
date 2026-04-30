const HERO_VIDEO_CONFIG = {
  playbackRate: 1.0,
  trim: { start: 0, end: null },
};

function setupHeroVideo(config = HERO_VIDEO_CONFIG) {
  const video = document.querySelector("[data-hero-video]");
  if (!video) return;

  const { playbackRate, trim } = config;

  const apply = () => {
    video.playbackRate = playbackRate;
    if (trim.start > 0) {
      try { video.currentTime = trim.start; } catch (_) {}
    }
  };

  if (video.readyState >= 1) {
    apply();
  } else {
    video.addEventListener("loadedmetadata", apply, { once: true });
  }

  if (trim.end != null) {
    video.addEventListener("timeupdate", () => {
      if (video.currentTime >= trim.end) {
        video.currentTime = trim.start;
      }
    });
  }

  const tryPlay = () => video.play().catch(() => {});
  tryPlay();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") tryPlay();
  });
}

function setupHeroIntro() {
  const hero = document.getElementById("hero");
  if (!hero || typeof gsap === "undefined") return;

  const accent = hero.querySelector(".font-accent");
  const title = hero.querySelector("h1");
  const blurb = hero.querySelector("p.font-body");
  if (!accent || !title || !blurb) return;

  gsap.from([accent, title, blurb], {
    y: 24,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.08,
  });
}

function setupHeroScrollFade() {
  const hero = document.getElementById("hero");
  if (!hero || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const content = hero.querySelector(".relative.z-10");
  const media = hero.querySelector("[data-hero-video], picture");
  if (!content) return;

  gsap.to(content, {
    opacity: 0,
    y: -40,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  if (media) {
    gsap.to(media, {
      opacity: 0.35,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }
}

const PIZZA_CONFIG = {
  hold: 3.0,
  fadeIn: 0.4,
  fadeOut: 0.4,
  spinDuration: 18,
};

function setupPizzaCarousel(config = PIZZA_CONFIG) {
  const stage = document.querySelector("[data-pizza-stage]");
  const label = document.querySelector("[data-pizza-label]");
  if (!stage || !label || typeof gsap === "undefined") return;

  const pizzas = Array.from(stage.querySelectorAll("[data-pizza]"));
  if (pizzas.length === 0) return;

  const { hold, fadeIn, fadeOut, spinDuration } = config;

  pizzas.forEach((pizza) => {
    gsap.set(pizza, { opacity: 0, scale: 0.92, rotation: 0 });
    gsap.to(pizza, {
      rotation: 360,
      duration: spinDuration,
      ease: "none",
      repeat: -1,
    });
  });

  if (pizzas.length === 1) {
    gsap.set(pizzas[0], { opacity: 1, scale: 1 });
    label.textContent = pizzas[0].dataset.pizzaName || "";
    return;
  }

  const tl = gsap.timeline({ repeat: -1 });

  pizzas.forEach((pizza, i) => {
    const name = pizza.dataset.pizzaName || "";
    tl.to(pizza, {
      opacity: 1,
      scale: 1,
      duration: fadeIn,
      ease: "power3.out",
      onStart: () => { label.textContent = name; },
    })
      .to({}, { duration: hold })
      .to(pizza, {
        opacity: 0,
        scale: 0.92,
        duration: fadeOut,
        ease: "power3.in",
      });
  });
}

const TESTIMONIALS_CONFIG = {
  speed: 60,
};

function setupTestimonialsMarquee(config = TESTIMONIALS_CONFIG) {
  const track = document.querySelector("[data-testimonials-track]");
  if (!track || typeof gsap === "undefined") return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const originals = Array.from(track.children);
  if (originals.length === 0) return;

  originals.forEach((node) => {
    const clone = node.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  let tween;

  const start = () => {
    if (tween) tween.kill();
    gsap.set(track, { x: 0 });

    const distance = track.scrollWidth / 2;
    if (distance <= 0) return;

    const duration = distance / config.speed;
    tween = gsap.to(track, {
      x: -distance,
      duration,
      ease: "none",
      repeat: -1,
    });
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    start();
  }

  let resizeId;
  window.addEventListener("resize", () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(start, 200);
  }, { passive: true });

  const focus = (card) => {
    tween?.pause();
    track.classList.add("has-focus");
    card.classList.add("is-focused");
  };

  const blur = (card) => {
    tween?.resume();
    track.classList.remove("has-focus");
    card.classList.remove("is-focused");
  };

  track.addEventListener("mouseover", (e) => {
    const card = e.target.closest("forno-testimonial");
    if (card) focus(card);
  });

  track.addEventListener("mouseout", (e) => {
    const card = e.target.closest("forno-testimonial");
    if (card && !card.contains(e.relatedTarget)) blur(card);
  });

  let touchCard = null;
  track.addEventListener("touchstart", (e) => {
    const card = e.target.closest("forno-testimonial");
    if (!card) return;
    if (touchCard && touchCard !== card) blur(touchCard);
    touchCard = card;
    focus(card);
  }, { passive: true });

  document.addEventListener("touchstart", (e) => {
    if (touchCard && !touchCard.contains(e.target)) {
      blur(touchCard);
      touchCard = null;
    }
  }, { passive: true });
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-contact-status]");
  const submitLabel = form.querySelector("[data-contact-submit-label]");
  const submitButton = form.querySelector("button[type='submit']");

  const setStatus = (message, tone = "muted") => {
    if (!status) return;
    status.textContent = message;
    status.classList.remove("text-cream-muted", "text-success", "text-error");
    if (tone === "success") status.classList.add("text-success");
    else if (tone === "error") status.classList.add("text-error");
    else status.classList.add("text-cream-muted");
  };

  const fields = Array.from(form.querySelectorAll(".contact-input"));

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true" && field.checkValidity()) {
        field.removeAttribute("aria-invalid");
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;
    fields.forEach((field) => {
      if (!field.checkValidity()) {
        field.setAttribute("aria-invalid", "true");
        if (!firstInvalid) firstInvalid = field;
      } else {
        field.removeAttribute("aria-invalid");
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      setStatus("Check the highlighted fields and try again.", "error");
      return;
    }

    if (submitButton) submitButton.disabled = true;
    if (submitLabel) submitLabel.textContent = "Sending";
    setStatus("");

    setTimeout(() => {
      if (submitButton) submitButton.disabled = false;
      if (submitLabel) submitLabel.textContent = "Send";
      setStatus("Thanks — we'll get back to you soon.", "success");
      form.reset();
    }, 600);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupHeroVideo();
  setupHeroIntro();
  setupHeroScrollFade();
  setupPizzaCarousel();
  setupTestimonialsMarquee();
  setupContactForm();
});
