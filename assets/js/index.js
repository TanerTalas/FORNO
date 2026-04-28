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

document.addEventListener("DOMContentLoaded", () => {
  setupHeroVideo();
  setupHeroIntro();
  setupHeroScrollFade();
  setupPizzaCarousel();
});
