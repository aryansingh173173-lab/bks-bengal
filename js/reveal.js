/* Scroll reveals for secondary pages (the landing has its own fuller choreography). */
(function (BKS) {
  "use strict";
  if (!window.gsap || BKS.ui.reduced) return;
  gsap.registerPlugin(ScrollTrigger);
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  function split(el) {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w" style="display:inline-block">' + BKS.ui.esc(w) + "</span>"; }).join(" ");
  }
  $$("[data-split]").forEach(function (h) {
    split(h);
    gsap.from(h.querySelectorAll(".w"), { yPercent: 60, opacity: 0, duration: .8, stagger: .05, ease: "power3.out", scrollTrigger: { trigger: h, start: "top 88%", once: true } });
  });
  $$("[data-reveal]").forEach(function (el) {
    var k = el.dataset.reveal;
    var from = k === "scale" ? { scale: .92, opacity: 0, y: 24 } : k === "left" ? { x: -40, opacity: 0 } : { y: 28, opacity: 0 };
    gsap.from(el, Object.assign(from, { duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }));
  });
  ScrollTrigger.batch("[data-stagger] > *", {
    start: "top 92%", once: true,
    onEnter: function (b) { gsap.fromTo(b, { opacity: 0, y: 36, rotate: -1.5 }, { opacity: 1, y: 0, rotate: 0, duration: .7, stagger: .08, ease: "back.out(1.5)" }); }
  });
  gsap.set("[data-stagger] > *", { opacity: 0 });
  $$("[data-parallax]").forEach(function (img) {
    var f = +img.dataset.parallax || .06;
    gsap.set(img, { scale: 1 + f * 2.2 });
    gsap.fromTo(img, { yPercent: -f * 100 }, { yPercent: f * 100, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });
  document.addEventListener("bks:lang", function () {
    $$("[data-split]").forEach(split);
    gsap.set("[data-stagger] > *", { opacity: 1, y: 0, rotate: 0 });
    ScrollTrigger.refresh();
  });
})(window.BKS);
