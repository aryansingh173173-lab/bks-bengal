/* The invitation card (brief, section 10): 1080 × 1350 portrait, made for WhatsApp.
   Drawn in the browser so it works offline after registration.
   Look: coral poster top with the artwork as stickers, name in big condensed navy. */
(function (BKS) {
  "use strict";
  var W = 1080, H = 1350;
  var C = { coral: "#FF4D4D", coralDeep: "#D93030", cyan: "#5CE1FF", cyanTint: "#E6FAFF", ink: "#0E1A2B", ink2: "#33415A", ink3: "#5D6B82", paper: "#FFFFFF" };
  var cache = {};

  function img(src) {
    if (cache[src]) return cache[src];
    cache[src] = new Promise(function (res) {
      var i = new Image();
      i.onload = function () { res(i); };
      i.onerror = function () { res(null); };
      i.src = src;
    });
    return cache[src];
  }

  function fonts(lang) {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var fam = lang === "hi" ? '"Anek Devanagari"' : '"Anek Bangla"';
    var sample = lang === "hi" ? "कारीगर" : lang === "en" ? "Kaarigar" : "কারিগর";
    return Promise.all([
      document.fonts.load("800 80px " + fam, sample),
      document.fonts.load("condensed 800 80px " + fam, sample),
      document.fonts.load("600 40px " + fam, sample),
      document.fonts.load('600 40px "Hind Siliguri"', sample)
    ]).catch(function () {});
  }

  function family(lang) { return lang === "hi" ? '"Anek Devanagari", "Anek Bangla", sans-serif' : '"Anek Bangla", "Hind Siliguri", sans-serif'; }

  function setFont(ctx, weight, size, fam, condensed) {
    ctx.font = weight + " " + size + "px " + fam;
    if ("fontStretch" in ctx) ctx.fontStretch = condensed ? "condensed" : "normal";
  }

  function fit(ctx, text, maxW, size, fam, weight, condensed, min) {
    var s = size;
    do {
      setFont(ctx, weight, s, fam, condensed);
      if (ctx.measureText(text).width <= maxW) break;
      s -= 2;
    } while (s > (min || 24));
    return s;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function sparkle(ctx, x, y, r, fill) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * .15, -r * .15, r, 0);
    ctx.quadraticCurveTo(r * .15, r * .15, 0, r);
    ctx.quadraticCurveTo(-r * .15, r * .15, -r, 0);
    ctx.quadraticCurveTo(-r * .15, -r * .15, 0, -r);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = C.ink;
    ctx.stroke();
    ctx.restore();
  }

  // Text with a hard navy offset shadow, poster style.
  function shadowText(ctx, text, x, y, fill, off) {
    ctx.fillStyle = C.ink;
    ctx.fillText(text, x + off, y + off);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
  }

  function cover(ctx, image, x, y, w, h, fx, fy) {
    var ir = image.width / image.height, br = w / h, sw, sh, sx, sy;
    if (ir > br) { sh = image.height; sw = sh * br; sx = (image.width - sw) * (fx == null ? .5 : fx); sy = 0; }
    else { sw = image.width; sh = sw / br; sx = 0; sy = (image.height - sh) * (fy == null ? .5 : fy); }
    ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
  }

  // A sticker: hard shadow, cyan backing, image clipped to the shape, navy outline.
  function sticker(ctx, shape, image, rot, fx, fy) {
    var b = shape.bounds;
    ctx.save();
    ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
    ctx.rotate(rot);
    ctx.translate(-(b.x + b.w / 2), -(b.y + b.h / 2));
    ctx.save(); ctx.translate(10, 10); shape.path(ctx); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
    shape.path(ctx); ctx.fillStyle = C.cyan; ctx.fill();
    ctx.save(); shape.path(ctx); ctx.clip();
    if (image) cover(ctx, image, b.x, b.y, b.w, b.h, fx, fy);
    ctx.restore();
    shape.path(ctx); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.restore();
  }
  function arch(x, y, w, h) {
    return { bounds: { x: x, y: y, w: w, h: h }, path: function (ctx) {
      var r = w / 2;
      ctx.beginPath();
      ctx.moveTo(x, y + r);
      ctx.arc(x + r, y + r, r, Math.PI, 0);
      ctx.lineTo(x + w, y + h - 18);
      ctx.arcTo(x + w, y + h, x + w - 18, y + h, 18);
      ctx.lineTo(x + 18, y + h);
      ctx.arcTo(x, y + h, x, y + h - 18, 18);
      ctx.closePath();
    } };
  }
  function circle(cx, cy, r) {
    return { bounds: { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r }, path: function (ctx) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); } };
  }

  function drawQR(ctx, text, x, y, size) {
    if (typeof window.qrcode !== "function") return false;
    var qr = window.qrcode(0, "M");
    qr.addData(text);
    qr.make();
    var n = qr.getModuleCount(), cell = size / (n + 2);
    ctx.fillStyle = C.paper;
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = C.ink;
    for (var r = 0; r < n; r += 1) {
      for (var c = 0; c < n; c += 1) {
        if (qr.isDark(r, c)) ctx.fillRect(Math.round(x + (c + 1) * cell), Math.round(y + (r + 1) * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }
    return true;
  }

  /* data: { name, trades:[ids], puja, area, district, family, regNo, photo (Image|null) } */
  async function draw(canvas, data, lang) {
    lang = lang || BKS.i18n.lang;
    var li = ["bn", "en", "hi"].indexOf(lang);
    var t = BKS.i18n.t, pick = BKS.i18n.pick, D = BKS.data, ev = BKS.config.event;
    var FAM = family(lang);
    var BODY = '"Hind Siliguri", "Noto Sans Devanagari", sans-serif';
    var up = function (s) { return lang === "en" ? String(s).toUpperCase() : String(s); };
    await fonts(lang);
    var art = await Promise.all([img("/assets/img/conch.webp"), img("/assets/img/durga-face.webp"), img("/assets/img/organisers.webp")]);

    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext("2d");
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.lineJoin = "round";

    // White sheet
    ctx.fillStyle = C.paper;
    ctx.fillRect(0, 0, W, H);

    // Coral poster top with a zig-zag edge
    var top = 628, tooth = 36, depth = 22;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, top);
    for (var zx = W; zx > 0; zx -= tooth) { ctx.lineTo(zx - tooth / 2, top + depth); ctx.lineTo(zx - tooth, top); }
    ctx.closePath();
    ctx.fillStyle = C.coral; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();

    // Halftone dots in the corners of the coral block
    ctx.fillStyle = "rgba(255,255,255,.22)";
    for (var hy = 40; hy < 300; hy += 22) {
      for (var hx = W - 40; hx > W - 300; hx -= 22) {
        var rr = Math.max(0, 5 - ((W - hx) + hy) / 90);
        if (rr > .4) { ctx.beginPath(); ctx.arc(hx, hy, rr, 0, Math.PI * 2); ctx.fill(); }
      }
    }

    // Welcome pill
    setFont(ctx, 700, 36, FAM, false);
    var wl = t("hero.welcome"), ww = ctx.measureText(wl).width + 56;
    ctx.fillStyle = C.ink; roundRect(ctx, W / 2 - ww / 2 + 5, 62 + 5, ww, 60, 30); ctx.fill();
    ctx.fillStyle = C.paper; roundRect(ctx, W / 2 - ww / 2, 62, ww, 60, 30); ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.fillStyle = C.ink; ctx.fillText(wl, W / 2, 104);

    // Event name: big condensed white with a navy offset
    var evName = up(pick(ev.name));
    var es = fit(ctx, evName, 940, 140, FAM, 800, true, 84);
    if (ctx.measureText(evName).width > 940) {
      var words = evName.split(" "), half = Math.ceil(words.length / 2);
      var l1 = words.slice(0, half).join(" "), l2 = words.slice(half).join(" ");
      es = Math.min(fit(ctx, l1, 940, 130, FAM, 800, true), fit(ctx, l2, 940, 130, FAM, 800, true));
      setFont(ctx, 800, es, FAM, true);
      shadowText(ctx, l1, W / 2, 140 + es * .9, C.paper, 7);
      shadowText(ctx, l2, W / 2, 140 + es * 1.85, C.paper, 7);
    } else {
      shadowText(ctx, evName, W / 2, 140 + es * .95, C.paper, 7);
    }

    // Artwork stickers: the conch-blower in an arch, Maa Durga in a circle
    sticker(ctx, arch(64, 318, 252, 290), art[0], -0.07, .4, .2);
    sticker(ctx, circle(W - 222, 462, 150), art[1], 0.05, .5, .15);
    sparkle(ctx, 352, 330, 26, C.cyan);
    sparkle(ctx, W - 92, 300, 20, C.paper);
    sparkle(ctx, 300, 600, 16, C.paper);

    // Middle: the kaarigar's photo if given, otherwise the three-word tagline
    if (data.photo) {
      var pcx = W / 2 - 10, pcy = 470, pr = 118;
      ctx.save(); ctx.beginPath(); ctx.arc(pcx + 8, pcy + 8, pr + 8, 0, Math.PI * 2); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(pcx, pcy, pr + 8, 0, Math.PI * 2); ctx.fillStyle = C.paper; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
      ctx.beginPath(); ctx.arc(pcx, pcy, pr, 0, Math.PI * 2); ctx.clip();
      cover(ctx, data.photo, pcx - pr, pcy - pr, 2 * pr, 2 * pr, .5, .3);
      ctx.restore();
    } else {
      var tags = t("tagline").split("•").map(function (s) { return s.trim(); }).filter(Boolean);
      tags.forEach(function (tg, i) {
        var ty = 400 + i * 74, rot = i % 2 ? .04 : -.04;
        setFont(ctx, 700, 36, FAM, false);
        var tw = ctx.measureText(tg).width + 44;
        ctx.save();
        ctx.translate(W / 2 - 14, ty);
        ctx.rotate(rot);
        ctx.fillStyle = C.ink; roundRect(ctx, -tw / 2 + 5, -30 + 5, tw, 58, 10); ctx.fill();
        ctx.fillStyle = i === 1 ? C.paper : C.cyan; roundRect(ctx, -tw / 2, -30, tw, 58, 10); ctx.fill();
        ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke();
        ctx.fillStyle = C.ink; ctx.fillText(tg, 0, 12);
        ctx.restore();
      });
    }

    // Honoured kaarigar
    setFont(ctx, 700, 32, FAM, false);
    var hon = t("card.honoured"), hw = ctx.measureText(hon).width;
    ctx.fillStyle = C.coralDeep;
    ctx.fillText(hon, W / 2, 712);
    ctx.fillStyle = C.cyan; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
    [[-1, 1], [1, 1]].forEach(function (s) {
      var bx = W / 2 + s[0] * (hw / 2 + 24) - (s[0] < 0 ? 70 : 0);
      roundRect(ctx, bx, 696, 70, 12, 6); ctx.fill(); ctx.stroke();
    });

    // The name, in the place of honour
    var name = up(data.name || "");
    var ns = fit(ctx, name, 940, 156, FAM, 800, true, 60);
    ctx.fillStyle = C.ink;
    ctx.fillText(name, W / 2, 712 + 30 + ns * .9);
    var y = 712 + 30 + ns * .9;

    var tradeTxt = (data.trades || []).map(function (id) { var tr = D.trade(id); return tr ? tr.short[li] : ""; }).filter(Boolean).join(", ");
    var line2 = [tradeTxt, data.puja].filter(Boolean).join("  ·  ");
    fit(ctx, line2, 940, 42, FAM, 700, false);
    ctx.fillStyle = C.ink;
    y += 60; ctx.fillText(line2, W / 2, y);
    var placeTxt = [data.area, data.district >= 0 && data.district != null ? D.DISTRICTS[data.district][li] : ""].filter(Boolean).join(", ");
    if (placeTxt) {
      fit(ctx, placeTxt, 900, 30, BODY, 500, false);
      ctx.fillStyle = C.ink3;
      y += 44; ctx.fillText(placeTxt, W / 2, y);
    }

    var fam = +data.family || 0;
    if (fam > 0) {
      var famTxt = t("card.withFamily") + " · " + t("family.n", { n: D.localDigits(String(fam + 1), lang) });
      setFont(ctx, 700, 28, FAM, false);
      var fw = ctx.measureText(famTxt).width + 48;
      y += 22;
      ctx.fillStyle = C.ink; roundRect(ctx, W / 2 - fw / 2 + 4, y + 4, fw, 50, 25); ctx.fill();
      ctx.fillStyle = C.cyan; roundRect(ctx, W / 2 - fw / 2, y, fw, 50, 25); ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke();
      ctx.fillStyle = C.ink; ctx.fillText(famTxt, W / 2, y + 35);
    }

    // Event block
    var ey = 1066;
    ctx.fillStyle = C.ink;
    roundRect(ctx, 56, ey, W - 112, 116, 22); ctx.fill();
    fit(ctx, pick(ev.date) + "  ·  " + pick(ev.time), 900, 38, FAM, 700, false);
    ctx.fillStyle = C.paper;
    ctx.fillText(pick(ev.date) + "  ·  " + pick(ev.time), W / 2, ey + 50);
    fit(ctx, pick(ev.venue), 900, 32, FAM, 600, false);
    ctx.fillStyle = C.cyan;
    ctx.fillText(pick(ev.venue), W / 2, ey + 94);

    // Entry pass + organisers
    var by = 1198;
    ctx.fillStyle = C.cyanTint;
    roundRect(ctx, 56, by, W - 112, 120, 18); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke();
    drawQR(ctx, "BKS:" + (data.regNo || ""), 68, by + 8, 104);
    ctx.textAlign = "left";
    setFont(ctx, 700, 24, FAM, false); ctx.fillStyle = C.coralDeep;
    ctx.fillText(t("card.entry"), 188, by + 40);
    setFont(ctx, 800, 40, FAM, true); ctx.fillStyle = C.ink;
    ctx.fillText(data.regNo || "", 188, by + 82);
    setFont(ctx, 500, 20, BODY, false); ctx.fillStyle = C.ink3;
    ctx.fillText(t("card.regno"), 188, by + 106);
    if (art[2]) {
      var lw = 360, lh = lw * art[2].height / art[2].width;
      ctx.globalCompositeOperation = "multiply";
      ctx.drawImage(art[2], W - 72 - lw, by + 60 - lh / 2, lw, lh);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.textAlign = "center";

    // Frame
    ctx.lineWidth = 16; ctx.strokeStyle = C.ink;
    ctx.strokeRect(8, 8, W - 16, H - 16);
    return canvas;
  }

  /* ----- Share / save ----- */
  function toBlob(canvas) {
    return new Promise(function (res) { canvas.toBlob(function (b) { res(b); }, "image/jpeg", .92); });
  }
  async function save(canvas, name) {
    var blob = await toBlob(canvas);
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name || "nimantran.jpg";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  }
  async function share(canvas, text, name) {
    var blob = await toBlob(canvas);
    var file = new File([blob], name || "nimantran.jpg", { type: "image/jpeg" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text: text }); return true; } catch (e) { if (e && e.name === "AbortError") return true; }
    }
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
    return false;
  }

  /* ----- Card links for crew members: /card/#d=… (no mobile number in the link) ----- */
  function encode(obj) {
    var json = JSON.stringify(obj);
    var b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function decode(s) {
    try {
      var b64 = s.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      return JSON.parse(decodeURIComponent(escape(atob(b64))));
    } catch (e) { return null; }
  }
  function linkFor(rec) {
    return location.origin + "/card/#d=" + encode({ n: rec.name, t: rec.trades, p: rec.puja, a: rec.area, d: rec.district, f: rec.family || 0, r: rec.regNo, s: rec.by || "" });
  }

  function regNo() {
    var abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", b = new Uint8Array(6), out = "";
    (window.crypto || window.msCrypto).getRandomValues(b);
    for (var i = 0; i < 6; i += 1) out += abc[b[i] % abc.length];
    return "KRS26-" + out;
  }

  /* ----- Celebration: confetti bursts from the card ----- */
  function burst(host) {
    if (BKS.ui && BKS.ui.reduced) return;
    var cv = document.createElement("canvas");
    cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:90";
    document.body.appendChild(cv);
    var dpr = Math.min(window.devicePixelRatio || 1, 2), w = innerWidth, h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    var ctx = cv.getContext("2d");
    ctx.scale(dpr, dpr);
    var r = (host || document.body).getBoundingClientRect();
    var ox = r.left + r.width / 2, oy = r.top + Math.min(r.height / 2, h / 2);
    var cols = [C.coral, C.cyan, C.paper, C.ink, "#FFB3B3", "#8BEAFF"];
    var ps = [];
    for (var i = 0; i < 130; i += 1) {
      var a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
      ps.push({ x: ox, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 5, r: 4 + Math.random() * 7, rot: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[i % cols.length], sq: i % 3 === 0 });
    }
    var start = performance.now();
    (function frame(now) {
      var el = now - start;
      ctx.clearRect(0, 0, w, h);
      ps.forEach(function (p) {
        p.vy += .22; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - el / 2600);
        ctx.fillStyle = p.c;
        ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2;
        ctx.beginPath();
        if (p.sq) ctx.rect(-p.r * .7, -p.r * .4, p.r * 1.4, p.r * .8); else ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.restore();
      });
      if (el < 2600) requestAnimationFrame(frame); else cv.remove();
    })(start);
  }

  BKS.card = { draw: draw, save: save, share: share, encode: encode, decode: decode, linkFor: linkFor, regNo: regNo, burst: burst };
})(window.BKS = window.BKS || {});
