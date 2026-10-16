/* Gentle image parallax for secondary pages. Content never waits on an animation to appear. */
(function (BKS) {
  "use strict";
  if (!window.gsap || BKS.ui.reduced) return;
  gsap.registerPlugin(ScrollTrigger);
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  // No scroll-in reveals: content is visible from the first paint (see landing.js).
  $$("[data-parallax]").forEach(function (img) {
    var f = +img.dataset.parallax || .06;
    gsap.set(img, { scale: 1 + f * 2.2 });
    gsap.fromTo(img, { yPercent: -f * 100 }, { yPercent: f * 100, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });
  document.addEventListener("bks:lang", function () { ScrollTrigger.refresh(); });
})(window.BKS);
