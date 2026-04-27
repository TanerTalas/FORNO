gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
  duration: 0.4,
  ease: "power3.out",
});

ScrollTrigger.config({
  ignoreMobileResize: true,
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  gsap.globalTimeline.timeScale(100);
}
