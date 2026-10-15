/* Shared page chrome: language, help sheet, click-to-load media, top bar. */
(function (BKS) {
  "use strict";
  var t = function (k, v) { return BKS.i18n.t(k, v); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function icon(id, cls) {
    return '<svg class="' + (cls || "ico") + '" aria-hidden="true"><use href="/assets/icons.svg#' + id + '"/></svg>';
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ----- Sheet (modal) ----- */
  var lastFocus = null;
  function openSheet(html, opts) {
    opts = opts || {};
    closeSheet();
    lastFocus = document.activeElement;
    var el = document.createElement("div");
    el.className = "sheet is-open";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.innerHTML = '<div class="sheet-bg" data-close></div><div class="sheet-card' + (opts.wide ? " wide" : "") + '">' +
      '<button class="sheet-x" type="button" data-close aria-label="' + esc(t("media.close")) + '">' + icon("x") + "</button>" + html + "</div>";
    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
    el.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeSheet(); });
    var first = el.querySelector(".sheet-card a, .sheet-card button:not(.sheet-x)") || el.querySelector(".sheet-x");
    if (first) first.focus({ preventScroll: true });
    if (opts.onOpen) opts.onOpen(el);
    return el;
  }
  function closeSheet() {
    var el = document.querySelector(".sheet.is-open");
    if (!el) return;
    el.remove();
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });

  function helpSheet() {
    var tels = BKS.config.helpline.map(function (h) {
      return '<a class="btn btn-primary" href="tel:' + h.tel + '">' + icon("phone") + "<span>" + esc(t("help.call")) + " · " + esc(BKS.data.localDigits(h.display, BKS.i18n.lang === "hi" ? "en" : BKS.i18n.lang)) + "</span></a>";
    }).join("");
    openSheet("<h3>" + esc(t("help.title")) + "</h3><p>" + esc(t("help.body")) + '</p><div style="display:grid;gap:10px;margin:16px 0">' + tels + '</div><p class="free-note" style="border-color:var(--ink)">' + icon("check") + "<span>" + esc(t("help.free")) + "</span></p>");
  }

  /* ----- Click-to-load media (brief, section 11: nothing autoplays) ----- */
  function mediaSheet(kind) {
    var c = BKS.config.media;
    var src, shape, link, linkLabel, title;
    if (kind === "reel") { src = c.reelEmbed; shape = "portrait"; link = c.reel; linkLabel = t("media.insta"); title = t("why.reel"); }
    else if (kind === "anthem") { src = c.anthemEmbed; shape = "portrait"; link = c.anthem; linkLabel = t("media.insta"); title = t("anthem.title"); }
    else { src = "https://www.youtube-nocookie.com/embed/" + c.filmId + "?autoplay=1&rel=0&cc_load_policy=1&hl=bn"; shape = "land"; link = c.film; linkLabel = t("media.yt"); title = t("film.title"); }
    var frame = '<iframe class="media-frame" src="' + src + '" title="' + esc(title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>';
    if (kind === "anthem" && c.anthemAudio) {
      frame = '<audio controls autoplay src="' + esc(c.anthemAudio) + '" style="width:100%"></audio>';
      shape = "";
    }
    openSheet("<h3>" + esc(title) + '</h3><div class="sheet-media ' + shape + '">' + frame + '</div><p class="credit"><span>' + esc(c.channel) + '</span><a href="' + link + '" target="_blank" rel="noopener">' + esc(linkLabel) + " ↗</a></p>", { wide: shape === "land" });
  }

  function bind() {
    document.addEventListener("click", function (e) {
      var h = e.target.closest("[data-help]");
      if (h) { e.preventDefault(); helpSheet(); return; }
      var m = e.target.closest("[data-media]");
      if (m) { e.preventDefault(); mediaSheet(m.dataset.media); }
    });
  }

  /* ----- Top bar: solid after the hero, hides on fast scroll down ----- */
  function topbar() {
    var bar = document.querySelector(".topbar");
    if (!bar) return;
    var lastY = window.scrollY;
    var sticky = document.querySelector(".sticky-cta");
    var hero = document.querySelector("[data-hero]");
    function onScroll() {
      var y = window.scrollY;
      bar.classList.toggle("is-solid", y > 24);
      bar.classList.toggle("is-hidden", y > 400 && y > lastY + 4);
      if (y < lastY - 4) bar.classList.remove("is-hidden");
      if (sticky && hero) {
        var past = y > hero.offsetHeight * 0.75;
        var nearEnd = window.innerHeight + y > document.documentElement.scrollHeight - 240;
        sticky.classList.toggle("is-on", past && !nearEnd);
      }
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function init() {
    BKS.i18n.mountSwitch(document.querySelector("[data-lang-switch]"));
    BKS.i18n.apply();
    bind();
    topbar();
  }

  BKS.ui = { icon: icon, esc: esc, openSheet: openSheet, closeSheet: closeSheet, helpSheet: helpSheet, mediaSheet: mediaSheet, reduced: reduced, init: init };
  // Loaded at the end of <body>, so the DOM is ready; deferred page scripts run after this.
  init();
})(window.BKS = window.BKS || {});
