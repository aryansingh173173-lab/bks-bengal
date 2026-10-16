/* Landing page motion. Gentle by default; everything is skipped for reduced motion
   and the page reads fine if GSAP never loads. */
(function (BKS) {
  "use strict";
  var t = BKS.i18n.t;
  var D = BKS.data;
  var reduced = BKS.ui.reduced;
  var hasGsap = typeof window.gsap !== "undefined";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var lang = function () { return BKS.i18n.lang; };

  /* ---------- Static renders (re-run on language change) ---------- */
  function renderTrades() {
    var box = $("[data-trades]");
    if (!box) return;
    var i = BKS.i18n.idx();
    var esc = BKS.ui.esc;
    // Photo of the job, its name, one line on what the job is, and the name in the other language.
    box.innerHTML = D.TRADES.map(function (tr) {
      var other = i === 0 ? tr.label[1] : tr.label[0];
      return '<a class="trade" href="/register/?mode=voice&amp;trade=' + tr.id + '">' +
        '<span class="ph">' + D.photo(tr.id) + '<span class="go">' + BKS.ui.icon("arrow") + "</span></span>" +
        '<span class="body"><b>' + esc(tr.label[i]) + "</b><p>" + esc(tr.desc[i]) + "</p><small>" + esc(other) + "</small></span></a>";
    }).join("");
  }

  function renderBand() {
    var el = $("[data-band]");
    if (!el) return;
    var i = BKS.i18n.idx();
    var words = D.TRADES.slice(0, 15).map(function (tr) { return tr.short[i]; });
    words.unshift(t("tagline"));
    var html = words.map(function (w) { return "<span>" + BKS.ui.esc(w) + "</span>"; }).join("");
    el.innerHTML = html + html;
  }

  function renderTels() {
    var box = $("[data-tels]");
    if (!box) return;
    box.innerHTML = BKS.config.helpline.map(function (h) {
      return '<a class="tel" href="tel:' + h.tel + '">' + BKS.ui.icon("phone") + "<span>" + D.localDigits(h.display, lang() === "bn" ? "bn" : "en") + "</span></a>";
    }).join("");
  }

  function renderSteps() {
    $$(".steps .n").forEach(function (n, k) { n.textContent = D.localDigits(String(k + 1), lang()); });
    $$("[data-count]").forEach(function (el) { el.textContent = D.localDigits(el.dataset.count, lang()); });
  }

  function mandala() {
    var box = $("[data-mandala]");
    if (!box) return;
    var petals = "";
    for (var k = 0; k < 36; k += 1) {
      petals += '<path transform="rotate(' + k * 10 + ' 200 200)" d="M200 18c9 34 9 62 0 92-9-30-9-58 0-92z" fill="none" stroke="currentColor" stroke-width=".8"/>';
    }
    var rings = [150, 120, 96, 60].map(function (r, j) {
      return '<circle cx="200" cy="200" r="' + r + '" fill="none" stroke="currentColor" stroke-width="' + (j === 0 ? 1.2 : .6) + '" ' + (j === 1 ? 'stroke-dasharray="2 5"' : "") + "/>";
    }).join("");
    box.innerHTML = '<svg viewBox="0 0 400 400">' + petals + rings + "</svg>";
  }

  function splitWords(el) {
    if (!el || el.dataset.splitDone === el.textContent) return;
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w" style="display:inline-block">' + BKS.ui.esc(w) + "</span>"; }).join(" ");
    el.dataset.splitDone = el.textContent;
  }

  /* ---------- Countdown ---------- */
  function countdown() {
    var box = $("[data-countdown]");
    if (!box) return;
    var target = new Date(BKS.config.event.isoDate).getTime();
    function tick() {
      var ms = Math.max(0, target - Date.now());
      var d = Math.floor(ms / 864e5);
      var h = Math.floor(ms / 36e5) % 24;
      var m = Math.floor(ms / 6e4) % 60;
      $("[data-cd=d]", box).textContent = D.localDigits(String(d), lang());
      $("[data-cd=h]", box).textContent = D.localDigits(String(h), lang());
      $("[data-cd=m]", box).textContent = D.localDigits(String(m), lang());
    }
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- Marigold and hibiscus petals ---------- */
  function petals() {
    var cv = $("#petals");
    if (!cv || reduced) return;
    var ctx = cv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, list = [], running = false, raf = 0;
    // Soft petals over the cherry hero: white, pale cherry and cotton cloud.
    var colors = [["#FFFFFF", "#FFE4EF"], ["#FFC2DA", "#FF8FBB"], ["#FFFFFF", "#EAF8FF"], ["#B8E9FF", "#94DEFF"]];
    function size() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(initial) {
      var c = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * W, y: initial ? Math.random() * H : -20 - Math.random() * 60,
        r: 5 + Math.random() * 7, vy: .35 + Math.random() * .6, sway: Math.random() * Math.PI * 2,
        sw: .6 + Math.random() * 1.1, rot: Math.random() * Math.PI, vr: (Math.random() - .5) * .03, c: c,
        flip: Math.random() * Math.PI
      };
    }
    function draw(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.abs(Math.cos(p.flip)) * .7 + .3);
      var g = ctx.createLinearGradient(-p.r, 0, p.r, 0);
      g.addColorStop(0, p.c[0]); g.addColorStop(1, p.c[1]);
      ctx.fillStyle = g;
      ctx.globalAlpha = .9;
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.bezierCurveTo(p.r, -p.r * .6, p.r * .8, p.r * .7, 0, p.r);
      ctx.bezierCurveTo(-p.r * .8, p.r * .7, -p.r, -p.r * .6, 0, -p.r);
      ctx.fill();
      ctx.restore();
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      list.forEach(function (p, i) {
        p.y += p.vy; p.sway += .012; p.x += Math.sin(p.sway) * p.sw * .5; p.rot += p.vr; p.flip += .02;
        if (p.y > H + 20) list[i] = make(false);
        draw(p);
      });
      if (running) raf = requestAnimationFrame(frame);
    }
    function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
    function stop() { running = false; cancelAnimationFrame(raf); }
    size();
    var n = W < 600 ? 14 : 26;
    for (var i = 0; i < n; i += 1) list.push(make(true));
    window.addEventListener("resize", size);
    new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }).observe(cv);
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  }

  /* ---------- Demo phone: the voice guide in miniature ---------- */
  var demoRun = 0;
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function graphemes(s) {
    if (window.Intl && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(s), function (x) { return x.segment; });
    }
    return Array.from(s);
  }
  function slipRows(rows) {
    return '<div class="slip-title"><span>' + t("slip.title") + "</span><small>" + D.localDigits("4", lang()) + "/" + D.localDigits("6", lang()) + "</small></div>" +
      rows.map(function (r) { return '<div class="slip-row is-empty" data-row="' + r + '"><dt>' + t("f." + r) + "</dt><dd>–</dd>" + BKS.ui.icon("stamp", "stamp") + "</div>"; }).join("");
  }
  async function demo() {
    var box = $("[data-demo]");
    if (!box) return;
    var my = ++demoRun;
    var q = $("[data-demo-q]", box), heard = $("[data-demo-heard]", box), a = $("[data-demo-a]", box);
    var chips = $("[data-demo-chips]", box), slip = $("[data-demo-slip]", box), mic = $(".mic", box);
    var i = BKS.i18n.idx();
    var steps = [
      { q: t("g.name"), a: t("demo.name"), row: "name", v: t("demo.name") },
      { q: t("g.mobile"), a: D.localDigits("98765 43210", lang()), row: "mobile", v: D.localDigits("98765 43210", lang()) },
      { q: t("demo.q"), a: t("demo.a"), row: "trade", v: t("demo.trade"), chips: ["idol", "bamboo", "light", "bearer"] },
      { q: t("g.pujaCheck", { v: t("demo.puja") }), a: t("c.yes"), row: "puja", v: t("demo.puja") }
    ];
    slip.innerHTML = slipRows(["name", "mobile", "trade", "puja"]);
    if (reduced) {
      q.textContent = steps[2].q; a.textContent = steps[2].a; heard.style.opacity = 1;
      $$(".slip-row", slip).forEach(function (r, k) { r.classList.remove("is-empty"); r.classList.add("is-filled"); $("dd", r).textContent = steps[k].v; });
      return;
    }
    while (my === demoRun) {
      for (var s = 0; s < steps.length && my === demoRun; s += 1) {
        var st = steps[s];
        heard.style.transition = "opacity .3s"; heard.style.opacity = 0; chips.innerHTML = "";
        q.textContent = "";
        mic.className = "mic sm demo-mic is-speaking";
        var g = graphemes(st.q);
        for (var k = 0; k < g.length && my === demoRun; k += 1) { q.textContent += g[k]; await sleep(28); }
        await sleep(500);
        mic.className = "mic sm demo-mic is-listening";
        if (st.chips) {
          chips.innerHTML = st.chips.map(function (id) { return '<span data-c="' + id + '">' + D.trade(id).label[i] + "</span>"; }).join("");
          if (hasGsap) gsap.from(chips.children, { y: 12, opacity: 0, stagger: .08, duration: .4, ease: "back.out(2)" });
        }
        await sleep(1500);
        mic.className = "mic sm demo-mic";
        a.textContent = st.a;
        heard.style.opacity = 1;
        if (hasGsap) gsap.fromTo(heard, { y: 10, scale: .9 }, { y: 0, scale: 1, duration: .45, ease: "back.out(2)" });
        if (st.chips) { var on = chips.querySelector('[data-c="bearer"]'); if (on) on.classList.add("on"); }
        await sleep(900);
        var row = slip.querySelector('[data-row="' + st.row + '"]');
        row.classList.remove("is-empty"); row.classList.add("is-filled");
        $("dd", row).textContent = st.v;
        await sleep(1500);
      }
      await sleep(1800);
      if (my !== demoRun) return;
      slip.innerHTML = slipRows(["name", "mobile", "trade", "puja"]);
    }
  }
  function demoWhenVisible() {
    var box = $("[data-demo]");
    if (!box) return;
    var started = false;
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !started) { started = true; demo(); }
    }, { threshold: .3 }).observe(box);
  }

  /* ---------- Story rail on phones ---------- */
  function rail() {
    var track = $("[data-track]"), bar = $("[data-rail]");
    if (!track || !bar) return;
    track.addEventListener("scroll", function () {
      var max = track.scrollWidth - track.clientWidth;
      bar.style.width = (max > 0 ? (track.scrollLeft / max) * 100 : 0) + "%";
    }, { passive: true });
  }

  /* ---------- GSAP choreography ---------- */
  function motion() {
    if (!hasGsap || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    var ease = "power3.out";

    // Hero: frame draws itself, art slides in from both sides like the invitation opening.
    var title = $("[data-title]");
    splitWords(title);
    var tl = gsap.timeline({ defaults: { ease: ease } });
    // Kept short: the red button must be usable within a second on a cheap phone.
    tl.fromTo(".hero-frame rect", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: .15, ease: "power2.inOut" }, 0)
      .from(".corner", { scale: 0, rotate: -90, opacity: 0, duration: .8, stagger: .08, ease: "back.out(1.8)" }, .2)
      .from(".hero-sun", { scale: .6, opacity: 0, duration: 2, ease: "power2.out" }, 0)
      .from("[data-art=conch]", { xPercent: -30, opacity: 0, duration: 1.1 }, .1)
      .from("[data-art=durga]", { xPercent: 25, scale: 1.08, opacity: 0, duration: 1.2 }, .15)
      .from(".welcome", { y: 16, opacity: 0, duration: .6 }, .2)
      .fromTo(".flourish path", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, .3)
      .from(title.querySelectorAll(".w"), { yPercent: 40, opacity: 0, duration: .8, stagger: .1 }, .25)
      .from("[data-hero-in]:not(.welcome)", { y: 18, opacity: 0, duration: .6, stagger: .07 }, .55)
      .from(".scroll-cue", { opacity: 0, duration: .6 }, 1.4);
    // Never leave the invitation hidden if frames are starved (old phone, background tab).
    setTimeout(function () { if (tl.progress() < 1) tl.progress(1); }, 3500);

    // Hero parallax on scroll.
    var heroST = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
    gsap.to("[data-art=durga]", { yPercent: -14, ease: "none", scrollTrigger: heroST });
    gsap.to("[data-art=conch]", { yPercent: -6, ease: "none", scrollTrigger: heroST });
    gsap.to(".hero-sun svg", { rotate: 60, ease: "none", scrollTrigger: heroST });
    gsap.to(".hero-copy", { y: -40, opacity: .35, ease: "none", scrollTrigger: heroST });

    // No scroll-in reveals: everything below the hero is visible from the first paint.
    // Hiding content until a scroll animation fires left blank screens on slow phones.

    // Counters.
    $$("[data-count]").forEach(function (el) {
      var n = +el.dataset.count, o = { v: 0 };
      gsap.to(o, { v: n, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: function () { el.textContent = D.localDigits(String(Math.round(o.v)), lang()); } });
    });

    // Image parallax inside framed boxes.
    $$("[data-parallax]").forEach(function (img) {
      var f = +img.dataset.parallax || .06;
      gsap.set(img, { scale: 1 + f * 2.2 });
      gsap.fromTo(img, { yPercent: -f * 100 }, { yPercent: f * 100, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // Story: pinned horizontal scroll on wide screens, native swipe on phones.
    var mm = gsap.matchMedia();
    mm.add("(min-width: 960px)", function () {
      var story = $("[data-story]"), track = $("[data-track]"), bar = $("[data-rail]");
      story.classList.add("is-pinned");
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth + 40); };
      var tw = gsap.to(track, {
        x: function () { return -dist(); }, ease: "none",
        scrollTrigger: { trigger: story, start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: .6, invalidateOnRefresh: true,
          onUpdate: function (self) { bar.style.width = self.progress * 100 + "%"; } }
      });
      $$(".shot img", track).forEach(function (img) {
        gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tw, start: "left right", end: "right left", scrub: true } });
      });
      return function () { story.classList.remove("is-pinned"); gsap.set(track, { clearProps: "x" }); };
    });
    mm.add("(max-width: 959px)", function () {
      // Phones swipe the story natively; nothing to animate.
    });

    // Invitation card: tilts toward the pointer, settles on leave.
    var tiltBox = $(".invite-tilt"), card = $("[data-tilt]");
    if (tiltBox && card && window.matchMedia("(hover: hover)").matches) {
      tiltBox.addEventListener("pointermove", function (e) {
        var r = tiltBox.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        gsap.to(card, { rotateY: x * 14, rotateX: -y * 12, duration: .5, ease: "power2.out" });
      });
      tiltBox.addEventListener("pointerleave", function () { gsap.to(card, { rotateY: 0, rotateX: 0, duration: .8, ease: "elastic.out(1, .5)" }); });
    }
    gsap.from(card, { rotateY: -25, rotateX: 10, duration: 1.4, ease: ease, scrollTrigger: { trigger: card, start: "top 85%", once: true } });

    // Primary button leans toward the pointer.
    $$("[data-magnet]").forEach(function (b) {
      if (!window.matchMedia("(hover: hover)").matches) return;
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .12, y: (e.clientY - r.top - r.height / 2) * .25, duration: .4 });
      });
      b.addEventListener("pointerleave", function () { gsap.to(b, { x: 0, y: 0, duration: .6, ease: "elastic.out(1, .4)" }); });
    });

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    // The serif heading font can land after "load" and makes the page taller; re-measure then.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }

  function renderAll() {
    renderTrades(); renderBand(); renderTels(); renderSteps();
  }

  renderAll();
  mandala();
  countdown();
  petals();
  rail();
  motion();
  demoWhenVisible();

  document.addEventListener("bks:lang", function () {
    renderAll();
    $$("[data-split], [data-title]").forEach(function (h) { delete h.dataset.splitDone; splitWords(h); });
    var box = $("[data-demo]");
    if (box && box.getBoundingClientRect().top < window.innerHeight) demo();
    if (hasGsap && window.ScrollTrigger) ScrollTrigger.refresh();
  });
})(window.BKS);
