/* The invitation card (brief, section 10): 1080 × 1350 portrait, made for WhatsApp.
   Drawn in the browser so it works offline after registration. */
(function (BKS) {
  "use strict";
  var W = 1080, H = 1350;
  var C = { parchment: "#FBF3E4", p2: "#F1DDB0", sindoor: "#9E1B1F", deep: "#6D0F12", gold: "#C8901A", gold2: "#E2B04A", ink: "#2A1A12", ink2: "#5B4433" };
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
    var sample = lang === "hi" ? "कारीगर" : lang === "en" ? "Kaarigar" : "কারিগর";
    return Promise.all([
      document.fonts.load('80px "Galada"', "কারিগর"),
      document.fonts.load('40px "Tiro Bangla"', sample),
      document.fonts.load('40px "Tiro Devanagari Hindi"', "कारीगर"),
      document.fonts.load('600 40px "Hind Siliguri"', sample)
    ]).catch(function () {});
  }

  function fit(ctx, text, maxW, size, family, weight) {
    var s = size;
    do {
      ctx.font = (weight || "") + " " + s + "px " + family;
      if (ctx.measureText(text).width <= maxW) break;
      s -= 2;
    } while (s > 24);
    return s;
  }

  function wrap(ctx, text, maxW) {
    var words = String(text).split(/\s+/), lines = [], line = "";
    words.forEach(function (w) {
      var test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function rosette(ctx, x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    for (var k = 0; k < 8; k += 1) {
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = k % 2 ? C.gold2 : C.sindoor;
      ctx.beginPath();
      ctx.ellipse(0, -r * .55, r * .22, r * .5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = C.parchment;
    ctx.beginPath(); ctx.arc(0, 0, r * .22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.sindoor;
    ctx.beginPath(); ctx.arc(0, 0, r * .1, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function flourish(ctx, cx, y, w) {
    ctx.save();
    ctx.strokeStyle = C.sindoor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, y);
    ctx.lineTo(cx - 46, y);
    ctx.bezierCurveTo(cx - 34, y - 14, cx - 14, y - 14, cx, y);
    ctx.bezierCurveTo(cx + 14, y - 14, cx + 34, y - 14, cx + 46, y);
    ctx.lineTo(cx + w / 2, y);
    ctx.stroke();
    ctx.fillStyle = C.gold;
    ctx.beginPath(); ctx.arc(cx, y + 2, 6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawQR(ctx, text, x, y, size) {
    if (typeof window.qrcode !== "function") return false;
    var qr = window.qrcode(0, "M");
    qr.addData(text);
    qr.make();
    var n = qr.getModuleCount(), cell = size / (n + 2);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = C.ink;
    for (var r = 0; r < n; r += 1) {
      for (var c = 0; c < n; c += 1) {
        if (qr.isDark(r, c)) ctx.fillRect(Math.round(x + (c + 1) * cell), Math.round(y + (r + 1) * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }
    return true;
  }

  // Fade an image into the parchment along one side.
  function fadedImage(ctx, image, x, y, w, h, side) {
    if (!image) return;
    var off = document.createElement("canvas");
    off.width = w; off.height = h;
    var o = off.getContext("2d");
    var ir = image.width / image.height, br = w / h, sw, sh, sx, sy;
    if (ir > br) { sh = image.height; sw = sh * br; sx = (image.width - sw) / 2; sy = 0; }
    else { sw = image.width; sh = sw / br; sx = 0; sy = 0; }
    o.drawImage(image, sx, sy, sw, sh, 0, 0, w, h);
    o.globalCompositeOperation = "destination-in";
    var g = side === "left" ? o.createLinearGradient(w, 0, 0, 0) : o.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(.38, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,1)");
    o.fillStyle = g;
    o.fillRect(0, 0, w, h);
    var g2 = o.createLinearGradient(0, h, 0, 0);
    g2.addColorStop(0, "rgba(0,0,0,0)");
    g2.addColorStop(.3, "rgba(0,0,0,1)");
    o.fillStyle = g2;
    o.fillRect(0, 0, w, h);
    ctx.drawImage(off, x, y);
  }

  /* data: { name, trades:[ids], puja, area, district, family, regNo, photo (Image|null) } */
  async function draw(canvas, data, lang) {
    lang = lang || BKS.i18n.lang;
    var li = ["bn", "en", "hi"].indexOf(lang);
    var t = BKS.i18n.t, pick = BKS.i18n.pick, D = BKS.data, ev = BKS.config.event;
    var DISP = lang === "en" ? '"Tiro Bangla", Georgia, serif' : lang === "hi" ? '"Tiro Devanagari Hindi", serif' : '"Galada", "Tiro Bangla", serif';
    var SERIF = lang === "hi" ? '"Tiro Devanagari Hindi", "Tiro Bangla", serif' : '"Tiro Bangla", Georgia, serif';
    var BODY = '"Hind Siliguri", "Noto Sans Devanagari", sans-serif';
    await fonts(lang);
    var art = await Promise.all([img("/assets/img/conch.webp"), img("/assets/img/durga-face.webp"), img("/assets/img/organisers.webp")]);

    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext("2d");
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    // Parchment
    var bg = ctx.createRadialGradient(W / 2, H * .45, 120, W / 2, H / 2, H * .75);
    bg.addColorStop(0, "#FFF8EA"); bg.addColorStop(.6, C.parchment); bg.addColorStop(1, C.p2);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Artwork band: conch on the left, Maa Durga on the right (invitation design A)
    fadedImage(ctx, art[0], 40, 60, 330, 470, "right");
    fadedImage(ctx, art[1], 640, 46, 400, 560, "left");
    var glow = ctx.createRadialGradient(W / 2, 250, 10, W / 2, 250, 330);
    glow.addColorStop(0, "rgba(255,236,190,.95)"); glow.addColorStop(1, "rgba(255,236,190,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(180, 40, 720, 460);

    // Border: sindoor band, gold inner line, rosettes in the corners
    ctx.strokeStyle = C.sindoor; ctx.lineWidth = 26;
    ctx.strokeRect(13, 13, W - 26, H - 26);
    ctx.strokeStyle = C.gold; ctx.lineWidth = 4;
    ctx.strokeRect(38, 38, W - 76, H - 76);
    ctx.strokeStyle = C.gold2; ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, W - 96, H - 96);
    [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40]].forEach(function (p) { rosette(ctx, p[0], p[1], 34); });
    for (var k = 1; k < 9; k += 1) {
      ctx.fillStyle = C.gold2;
      ctx.beginPath(); ctx.arc(W * k / 9, 13, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(W * k / 9, H - 13, 4, 0, Math.PI * 2); ctx.fill();
    }

    // Heading
    ctx.fillStyle = C.deep;
    ctx.font = "44px " + SERIF;
    ctx.fillText(t("hero.welcome"), W / 2, 150);
    flourish(ctx, W / 2, 178, 300);
    ctx.fillStyle = C.sindoor;
    var evName = pick(ev.name);
    fit(ctx, evName, 560, lang === "bn" ? 92 : 64, DISP, lang === "bn" ? "" : "700");
    var evLines = wrap(ctx, evName, 520);
    evLines.forEach(function (l, i) { ctx.fillText(l, W / 2, 268 + i * (lang === "bn" ? 88 : 70)); });
    var tagY = 268 + evLines.length * (lang === "bn" ? 88 : 70) + 6;
    ctx.font = "34px " + SERIF;
    ctx.fillText(t("tagline"), W / 2, tagY);

    // Photo (optional) in a gold ring
    var nameTop = 640;
    if (data.photo) {
      var cx = W / 2, cy = 590, r = 108;
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r + 12, 0, Math.PI * 2); ctx.fillStyle = C.gold; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, r + 5, 0, Math.PI * 2); ctx.fillStyle = C.sindoor; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
      var p = data.photo, s = Math.max((2 * r) / p.width, (2 * r) / p.height);
      ctx.drawImage(p, cx - (p.width * s) / 2, cy - (p.height * s) / 2, p.width * s, p.height * s);
      ctx.restore();
      nameTop = 760;
    }

    // Honoured kaarigar: name in the place of honour
    ctx.fillStyle = C.ink2;
    ctx.font = "600 30px " + BODY;
    ctx.fillText("—  " + t("card.honoured") + "  —", W / 2, nameTop);
    ctx.fillStyle = C.sindoor;
    fit(ctx, data.name || "", 880, lang === "bn" ? 116 : 92, DISP, lang === "bn" ? "" : "700");
    ctx.fillText(data.name || "", W / 2, nameTop + 112);

    var tradeTxt = (data.trades || []).map(function (id) { var tr = D.trade(id); return tr ? tr.short[li] : ""; }).filter(Boolean).join(", ");
    var line2 = [tradeTxt, data.puja].filter(Boolean).join("  ·  ");
    ctx.fillStyle = C.ink;
    fit(ctx, line2, 900, 40, SERIF);
    ctx.fillText(line2, W / 2, nameTop + 176);
    var placeTxt = [data.area, data.district >= 0 && data.district != null ? D.DISTRICTS[data.district][li] : ""].filter(Boolean).join(", ");
    ctx.fillStyle = C.ink2;
    fit(ctx, placeTxt, 860, 30, BODY, "500");
    if (placeTxt) ctx.fillText(placeTxt, W / 2, nameTop + 222);

    var fam = +data.family || 0;
    var famTxt = fam > 0 ? t("card.withFamily") + " · " + t("family.n", { n: D.localDigits(String(fam + 1), lang) }) : "";
    if (famTxt) {
      ctx.font = "600 28px " + BODY;
      var fw = ctx.measureText(famTxt).width + 48;
      ctx.fillStyle = "rgba(158,27,31,.1)";
      roundRect(ctx, W / 2 - fw / 2, nameTop + 244, fw, 48, 24); ctx.fill();
      ctx.fillStyle = C.sindoor;
      ctx.fillText(famTxt, W / 2, nameTop + 278);
    }

    // Event details
    var evY = Math.max(nameTop + 330, 1000);
    flourish(ctx, W / 2, evY - 30, 520);
    ctx.fillStyle = C.deep;
    ctx.font = "600 36px " + BODY;
    ctx.fillText(pick(ev.date) + "  ·  " + pick(ev.time), W / 2, evY + 18);
    ctx.font = "500 32px " + BODY;
    fit(ctx, pick(ev.venue), 860, 32, BODY, "500");
    ctx.fillText(pick(ev.venue), W / 2, evY + 62);

    // Entry pass + organisers
    var by = H - 230;
    ctx.fillStyle = "rgba(255,253,248,.9)";
    roundRect(ctx, 80, by - 8, W - 160, 176, 18); ctx.fill();
    ctx.strokeStyle = "rgba(200,144,26,.6)"; ctx.lineWidth = 2; ctx.stroke();
    drawQR(ctx, "BKS:" + (data.regNo || ""), 96, by + 4, 152);
    ctx.textAlign = "left";
    ctx.fillStyle = C.ink2;
    ctx.font = "600 24px " + BODY;
    ctx.fillText(t("card.entry"), 268, by + 52);
    ctx.fillStyle = C.ink;
    ctx.font = "700 36px " + BODY;
    ctx.fillText(data.regNo || "", 268, by + 96);
    ctx.fillStyle = C.ink2;
    ctx.font = "500 22px " + BODY;
    ctx.fillText(t("card.regno"), 268, by + 126);
    if (art[2]) {
      var lw = 420, lh = lw * art[2].height / art[2].width;
      ctx.globalCompositeOperation = "multiply";
      ctx.drawImage(art[2], W - 96 - lw, by + 80 - lh / 2, lw, lh);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.textAlign = "center";
    return canvas;
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

  /* ----- Celebration: marigold petals burst from the card ----- */
  function burst(host) {
    if (BKS.ui && BKS.ui.reduced) return;
    var cv = document.createElement("canvas");
    cv.className = "burst";
    cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:90";
    document.body.appendChild(cv);
    var dpr = Math.min(window.devicePixelRatio || 1, 2), w = innerWidth, h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    var ctx = cv.getContext("2d");
    ctx.scale(dpr, dpr);
    var r = (host || document.body).getBoundingClientRect();
    var ox = r.left + r.width / 2, oy = r.top + Math.min(r.height / 2, h / 2);
    var cols = ["#F2A516", "#F7C23B", "#C3271F", "#E2462F", "#E2B04A", "#FFFFFF"];
    var ps = [];
    for (var i = 0; i < 120; i += 1) {
      var a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
      ps.push({ x: ox, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 5, r: 4 + Math.random() * 7, rot: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[i % cols.length], life: 0 });
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
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      if (el < 2600) requestAnimationFrame(frame); else cv.remove();
    })(start);
  }

  BKS.card = { draw: draw, save: save, share: share, encode: encode, decode: decode, linkFor: linkFor, regNo: regNo, burst: burst };
})(window.BKS = window.BKS || {});
