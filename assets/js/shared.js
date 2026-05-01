/* === GSAP SETUP === */
gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
  duration: 0.4,
  ease: "power3.out",
});

ScrollTrigger.config({
  ignoreMobileResize: true,
});

/* === LENIS SMOOTH SCROLL === */
const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* === REDUCED MOTION === */
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  gsap.globalTimeline.timeScale(100);
  lenis.destroy();
}
