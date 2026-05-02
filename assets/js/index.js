// Hero Video
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

// Hero Intro Animation
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

// Hero Scroll Fade
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

// Pizza Carousel
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

// Testimonials Marquee
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
  let lastDistance = 0;

  const build = () => {
    const distance = track.scrollWidth / 2;
    if (distance <= 0) return;

    const progress = tween ? tween.progress() : 0;
    if (tween) tween.kill();

    const duration = distance / config.speed;
    tween = gsap.to(track, {
      x: -distance,
      duration,
      ease: "none",
      repeat: -1,
    });
    tween.progress(progress);
    lastDistance = distance;
  };

  const rebuildIfWidthChanged = () => {
    const distance = track.scrollWidth / 2;
    if (Math.abs(distance - lastDistance) < 1) return;
    build();
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(build);
  } else {
    build();
  }

  let resizeId;
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeId);
    resizeId = setTimeout(rebuildIfWidthChanged, 200);
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
}

// Contact Form
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

// Chef Fire Canvas
const FIRE_CONFIG = {
  particleCount: 180,
  sparkCount: 50,
};

function setupChefFire(config = FIRE_CONFIG) {
  const canvas = document.querySelector(".chef-fire-canvas");
  if (!canvas) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const ctx = canvas.getContext("2d");

  const COLORS = [
    { r: 255, g: 80,  b: 20  },
    { r: 214, g: 58,  b: 31  },
    { r: 255, g: 140, b: 40  },
    { r: 232, g: 163, b: 61  },
    { r: 255, g: 220, b: 80  },
  ];

  let W, H, rafId;
  const particles = [];
  const sparks = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = rect.width;
    H = canvas.height = rect.height;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x  = W * (0.05 + Math.random() * 0.9);
      this.y  = initial ? H * (0.3 + Math.random() * 0.7) : H + 10;
      this.vy = -(0.9 + Math.random() * 2.0);
      this.vx = (Math.random() - 0.5) * 0.7;
      this.r  = 60 + Math.random() * 110;
      this.life = 0;
      this.maxLife = 90 + Math.random() * 90;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.02 + Math.random() * 0.03;
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble) * 0.6;
      this.y += this.vy;
      this.vy -= 0.008;
      this.life++;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      const t = this.life / this.maxLife;
      const alpha = t < 0.15
        ? t / 0.15 * 0.75
        : (1 - t) * 0.75;
      const { r, g, b } = this.color;
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${alpha})`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.5})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  class Spark {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x  = W * (0.15 + Math.random() * 0.7);
      this.y  = initial ? H * Math.random() : H * (0.7 + Math.random() * 0.3);
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = -(1.5 + Math.random() * 3);
      this.r  = 1 + Math.random() * 2;
      this.life = 0;
      this.maxLife = 40 + Math.random() * 60;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.04;
      this.vx *= 0.99;
      this.life++;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      const t = this.life / this.maxLife;
      const alpha = t < 0.1 ? t / 0.1 : 1 - t;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,181,71,${alpha})`;
      ctx.shadowColor = "rgba(255,181,71,0.9)";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function init() {
    for (let i = 0; i < config.particleCount; i++) particles.push(new Particle());
    for (let i = 0; i < config.sparkCount; i++) sparks.push(new Spark());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "screen";
    for (const p of particles) { p.update(); p.draw(); }
    ctx.globalCompositeOperation = "source-over";
    for (const s of sparks) { s.update(); s.draw(); }
    rafId = requestAnimationFrame(loop);
  }

  let resizeId;
  window.addEventListener("resize", () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(resize, 150);
  }, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        if (!rafId) loop();
      } else {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  }, { threshold: 0 });
  observer.observe(canvas.parentElement);

  resize();
  init();
  loop();
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  setupHeroVideo();
  setupHeroIntro();
  setupHeroScrollFade();
  setupPizzaCarousel();
  setupChefFire();
  setupTestimonialsMarquee();
  setupContactForm();
});
