/* Registration: voice guide, typed flow, crew mode and assisted mode.
   One question per screen, show what was heard, confirm with হ্যাঁ / না (brief, sections 5–8). */
(function (BKS) {
  "use strict";
  var t = BKS.i18n.t, D = BKS.data, V = BKS.voice, UI = BKS.ui, esc = UI.esc, icon = UI.icon;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var lang = function () { return BKS.i18n.lang; };
  var li = function () { return BKS.i18n.idx(); };
  var L = function (s) { return D.localDigits(String(s), lang()); };

  var params = new URLSearchParams(location.search);
  var mode = params.get("mode") || "voice";
  if (["voice", "text", "crew", "assisted"].indexOf(mode) < 0) mode = "voice";
  var KEY = "bks.reg.draft", DONE = "bks.reg.done", CREW = "bks.crew.draft", ASSIST = "bks.assist";

  var screen = $("[data-screen]"), dock = $("[data-dock]"), slipEl = $("[data-slip]"), dotsEl = $("[data-dots]");
  var ORDER = ["intro", "consent", "name", "mobile", "trade", "puja", "place", "sardar", "family", "confirm", "card"];
  var QNUM = { name: 1, mobile: 2, trade: 3, puja: 4, place: 4, sardar: 5, family: 6 };
  var DOT = { name: 0, mobile: 1, trade: 2, puja: 3, place: 3, sardar: 4, family: 5, confirm: 6, card: 7 };

  var voiceOn = mode === "voice" && V.supported;
  var unlocked = false;   // speech needs a tap first (and the brief forbids autoplay sound)
  var turn = 0;           // bumps on every new prompt so stale recognitions are ignored
  var handler = null;     // what the current listen() result goes to
  var attempts = 0;
  var keepLangQuiet = false;

  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  function read(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function drop(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }

  function blank() {
    return {
      step: "intro",
      a: { name: "", mobile: "", trades: [], pujas: [], area: "", district: -1, sardar: "", sardarMobile: "", sardarSelf: false, sardarUnknown: false, family: null, consent: false },
      regNo: null, photo: null, returnTo: null, prefilled: false,
      source: params.get("puja") ? "qr" : (params.get("src") || "link"),
      assistedBy: null, lang: lang(), startedAt: new Date().toISOString()
    };
  }
  var S = read(KEY);
  if (!S || !S.a || S.step === "card") S = blank();   // a finished card starts the next visit fresh
  var resumable = !!(S.a.consent && S.step !== "intro");
  var resumeStep = resumable ? S.step : null;

  // Pre-fill from a pandal QR (?puja=&area=&district=) or a trade card on the landing (?trade=).
  (function prefill() {
    var p = params.get("puja");
    if (p && !S.a.pujas.length) {
      var m = D.matchPuja(p);
      S.a.pujas = [{ name: m ? m[lang() === "bn" ? "bn" : "en"] : p, id: m ? m.en : null }];
      S.prefilled = true;
    }
    var ar = params.get("area");
    if (ar && !S.a.area) S.a.area = ar;
    var di = params.get("district");
    if (di != null && S.a.district < 0) S.a.district = /^\d+$/.test(di) ? Math.min(+di, D.DISTRICTS.length - 1) : D.matchDistrict(di);
    var tr = params.get("trade");
    if (tr && D.trade(tr) && S.a.trades.indexOf(tr) < 0) S.a.trades.push(tr);
  })();
  function save() { S.lang = lang(); store(KEY, S); }

  /* ---------------- Shell ---------------- */
  function micHTML(big) {
    return '<div class="mic-wrap" data-micwrap>' +
      '<button class="mic' + (big ? "" : " sm") + (voiceOn ? "" : " is-off") + '" type="button" data-mic aria-label="' + esc(t("mic.tap")) + '"><span class="ring"></span><span class="ring"></span><span class="ring"></span>' + icon("mic") + "</button>" +
      '<div class="wave" data-wave aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>' +
      '<p class="mic-label" data-miclabel>' + esc(voiceOn ? t("mic.tap") : t("g.noVoice")) + "</p></div>";
  }

  function shell(step) {
    var q = QNUM[step];
    screen.innerHTML =
      (S.assistedBy ? '<span class="assist-badge">' + esc(t("assist.badge", { v: S.assistedBy })) + "</span>" : "") +
      '<p class="q-count">' + (q ? esc(t("q.of", { n: L(q) })) : "&nbsp;") + "</p>" +
      '<div class="guide"><span class="guide-name">' + esc(t("g.saathi")) + '</span><p class="guide-line" data-line></p></div>' +
      (voiceOn || V.supported ? micHTML(true) : "") +
      '<div data-heardbox></div><div class="answer" data-answer></div>';
    if (!voiceOn) {
      var mw = $("[data-micwrap]", screen);
      if (mw) mw.style.display = "none";
    }
    screen.classList.remove("screen-in");
    void screen.offsetWidth;
    screen.classList.add("screen-in");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setLine(text) {
    var el = $("[data-line]", screen);
    if (!el) return;
    el.innerHTML = String(text).split(/\s+/).map(function (w, i) {
      return '<span class="w" style="--i:' + i + '">' + esc(w) + "</span>";
    }).join(" ");
  }

  function setMic(state) {
    var m = $("[data-mic]", screen), lab = $("[data-miclabel]", screen), wave = $("[data-wave]", screen);
    if (!m) return;
    m.classList.remove("is-listening", "is-speaking");
    if (state === "listening") m.classList.add("is-listening");
    if (state === "speaking") m.classList.add("is-speaking");
    if (wave) wave.classList.toggle("on", state === "listening");
    if (lab) lab.textContent = state === "listening" ? t("mic.listening") : state === "speaking" ? t("mic.speaking") : voiceOn ? t("mic.tap") : t("g.noVoice");
  }

  function showHeard(text, interim) {
    var box = $("[data-heardbox]", screen);
    if (!box) return;
    if (!text) { box.innerHTML = ""; return; }
    box.innerHTML = '<div class="heard' + (interim ? " interim" : "") + '"><small>' + esc(t("heard")) + "</small><span>" + esc(text) + "</span></div>";
  }

  function answer(html) {
    var a = $("[data-answer]", screen);
    a.innerHTML = html;
    return a;
  }

  function chips(list, cls) {
    return '<div class="chips ' + (cls || "") + '">' + list.map(function (c, i) {
      return '<button type="button" class="chip ' + (c.cls || "") + '" style="--i:' + i + '" data-act="' + c.act + '"' + (c.val != null ? ' data-val="' + esc(c.val) + '"' : "") + ">" + (c.icon ? icon(c.icon) : "") + "<span>" + esc(c.label) + "</span></button>";
    }).join("") + "</div>";
  }

  /* ---------------- Speaking & listening ---------------- */
  async function ask(text, o) {
    o = o || {};
    var my = ++turn;
    handler = o.handler || null;
    V.stopListening();
    setLine(text);
    showHeard("");
    if (voiceOn && unlocked) {
      setMic("speaking");
      await V.speak(o.speech || text, lang(), { rate: o.rate });
      if (my !== turn) return;
      setMic("idle");
      if (o.listen !== false) listen(my);
    } else {
      setMic("idle");
    }
  }

  async function listen(my) {
    if (!voiceOn || !V.supported) return;
    if (document.querySelector(".sheet.is-open")) return;
    my = my || ++turn;
    setMic("listening");
    var r = await V.listen(lang(), { onInterim: function (s) { if (my === turn) showHeard(s, true); } });
    if (my !== turn) return;
    setMic("idle");
    if (r.error) {
      if (r.error === "not-allowed" || r.error === "service-not-allowed" || r.error === "unsupported" || r.error === "audio-capture") {
        voiceOn = false;
        setMic("idle");
        setLine(t("g.noVoice"));
        showKeyboard();
        return;
      }
      if (r.error === "aborted" || r.error === "busy") return;
      return silence();
    }
    showHeard(r.text);
    // The guide switches to Hindi if the person answers in Hindi.
    if (/[ऀ-ॿ]/.test(r.text) && lang() !== "hi") { keepLangQuiet = true; BKS.i18n.set("hi"); keepLangQuiet = false; }
    if (global(r.text)) return;
    attempts = 0;
    (handler || STEPS[S.step].speech || function () {})(r.text, r.alts || []);
  }

  function global(text) {
    var f = D.fold(text);
    if (/টাকা|পয়সা|ফি\b|money|pay|fee|पैसा|पैसे|रुपये|फीस/.test(f)) {
      var back = $("[data-line]", screen).textContent;
      ask(t("g.money") + " " + back, { handler: handler });
      return true;
    }
    if (/সাহায্য|হেল্প|help|मदद/.test(f)) { UI.helpSheet(); return true; }
    return false;
  }

  function silence() {
    attempts += 1;
    var line = STEPS[S.step].prompt ? STEPS[S.step].prompt() : "";
    var box = $(".chips", screen);
    if (box) box.classList.add("hint");
    if (attempts === 1) ask(t("g.silence") + " " + line, { rate: .8, handler: handler });
    else { ask(t("g.failed"), { listen: false }); showKeyboard(); }
  }

  function showKeyboard() {
    var k = $("[data-kb]", screen);
    if (k) { k.hidden = false; var inp = $("input", k); if (inp) setTimeout(function () { inp.focus(); }, 60); }
    var tog = $("[data-act=kb]", screen);
    if (tog) tog.hidden = true;
  }

  /* Read a value back and wait for হ্যাঁ / না. */
  function confirmValue(line, speech, onYes, onNo) {
    answer(chips([{ act: "yes", label: t("c.yes"), cls: "primary", icon: "check" }, { act: "no", label: t("c.no") }]));
    var a = $("[data-answer]", screen);
    a.onclick = function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "yes") onYes(); else onNo();
    };
    ask(line, { speech: speech, handler: function (txt) {
      var yn = D.yesNo(txt);
      if (yn === "yes") onYes();
      else if (yn === "no") onNo();
      else ask(line, { speech: speech, handler: handler });
    } });
  }

  /* ---------------- Steps ---------------- */
  function go(step) {
    V.stopSpeaking();
    V.stopListening();
    attempts = 0;
    S.step = step;
    save();
    dots();
    slip();
    STEPS[step].enter();
  }
  function next() {
    if (S.returnTo) { var r = S.returnTo; S.returnTo = null; go(r); return; }
    go(ORDER[ORDER.indexOf(S.step) + 1]);
  }
  function prev() {
    var i = ORDER.indexOf(S.step);
    if (i <= 0 || S.step === "card") { location.href = "/"; return; }
    go(ORDER[i - 1]);
  }

  function kbBlock(inner) {
    return '<div data-kb' + (voiceOn ? " hidden" : "") + ' class="answer">' + inner + "</div>" +
      (voiceOn ? '<div class="row-actions"><button type="button" class="btn-link keyboard-toggle" data-act="kb">' + icon("keyboard") + "<span>" + esc(t("btn.keyboard")) + "</span></button></div>" : "");
  }
  function bindKb(onSubmit) {
    var a = $("[data-answer]", screen);
    a.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "kb") { V.stopListening(); setMic("idle"); showKeyboard(); }
      if (b.dataset.act === "submit") onSubmit();
    });
    a.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.matches("input")) { e.preventDefault(); onSubmit(); } });
  }

  function cleanName(s) {
    s = String(s).trim()
      .replace(/^(আমার নাম(টা)?( হল| হলো| হচ্ছে)?|নাম|my name is|my name|i am|i'm|this is|मेरा नाम|नाम)\s*/i, "")
      .replace(/\s*(বলছি|হল|হলো|আছে|है|हूँ|हूं)\s*[।.]?$/i, "")
      .replace(/[।.!?,]+$/, "").trim();
    return s.replace(/\b([a-z])/g, function (c) { return c.toUpperCase(); });
  }
  function mobileSpeech(d) {
    var a = d.slice(0, 5), b = d.slice(5);
    if (lang() === "bn") return D.digitWordsBn(a) + ", " + D.digitWordsBn(b);
    return L(a.split("").join(" ")) + ", " + L(b.split("").join(" "));
  }
  function tradeList(ids) { return ids.map(function (id) { return D.trade(id).label[li()]; }).join(", "); }
  function districtName(i) { return i >= 0 && D.DISTRICTS[i] ? D.DISTRICTS[i][li()] : ""; }
  function placeText() { return [S.a.area, districtName(S.a.district)].filter(Boolean).join(", "); }
  function sardarText() {
    if (S.a.sardarSelf) return t("sardar.self");
    if (S.a.sardarUnknown) return t("sardar.unknown");
    return [S.a.sardar, S.a.sardarMobile ? D.groupMobile(S.a.sardarMobile, lang()) : ""].filter(Boolean).join(" · ");
  }
  function familyText() {
    if (S.a.family == null) return "";
    return S.a.family === 0 ? t("family.alone") : t("family.n", { n: L(S.a.family) });
  }
  function parseCount(s) {
    var f = D.fold(D.toAscii(s));
    var m = f.match(/\d+/);
    if (m) return Math.min(+m[0], 20);
    var table = [
      [0, ["একা", "কেউ না", "কেউ নয়", "কেউ আসবে না", "alone", "nobody", "none", "no one", "just me", "zero", "অকেলে", "अकेले", "कोई नहीं"]],
      [1, ["একজন", "এক জন", "এক", "one", "एक"]], [2, ["দুজন", "দু জন", "দুই", "দু", "two", "दो"]],
      [3, ["তিনজন", "তিন", "three", "तीन"]], [4, ["চারজন", "চার", "four", "चार"]],
      [5, ["পাঁচজন", "পাঁচ", "five", "पाँच", "पांच"]], [6, ["ছয়", "ছয়", "six", "छह"]]
    ];
    for (var i = 0; i < table.length; i += 1) {
      for (var j = 0; j < table[i][1].length; j += 1) if (f.indexOf(table[i][1][j]) >= 0) return table[i][0];
    }
    return null;
  }

  var STEPS = {
    intro: {
      prompt: function () { return t("g.intro"); },
      enter: function () {
        shell("intro");
        if (mode === "assisted" && !S.assistedBy) return assistedStart();
        setLine(t("g.intro"));
        var list = [];
        if (resumable) {
          list = [{ act: "resume", label: t("resume.go"), cls: "primary" }, { act: "fresh", label: t("resume.new") }];
          setLine(t("resume.title"));
        } else {
          list = [{ act: "start", label: t("c.start"), cls: "primary", icon: voiceOn ? "mic" : "arrow" }];
          if (voiceOn) list.push({ act: "type", label: t("c.type"), icon: "pencil" });
          else if (V.supported) list.push({ act: "voice", label: t("btn.voice"), icon: "mic" });
          list.push({ act: "help", label: t("nav.help"), cls: "quiet", icon: "help" });
        }
        answer(chips(list));
        $("[data-answer]", screen).onclick = function (e) {
          var b = e.target.closest("[data-act]");
          if (!b) return;
          var act = b.dataset.act;
          if (act === "start") go("consent");
          if (act === "type") { mode = "text"; voiceOn = false; go("consent"); }
          if (act === "voice") { mode = "voice"; voiceOn = true; go("consent"); }
          if (act === "help") UI.helpSheet();
          if (act === "resume") { resumable = false; go(resumeStep || "consent"); }
          if (act === "fresh") { var keep = S.assistedBy; S = blank(); S.assistedBy = keep; resumable = false; save(); go("intro"); }
        };
        handler = function (txt) { if (D.yesNo(txt) === "yes") go("consent"); };
        setMic("idle");
      },
      speech: function (txt) { if (D.yesNo(txt) === "yes") go("consent"); }
    },

    consent: {
      prompt: function () { return t("g.consent"); },
      enter: function () {
        shell("consent");
        answer(chips([{ act: "agree", label: t("c.agree"), cls: "primary", icon: "check" }, { act: "more", label: t("c.more"), cls: "quiet" }]) + '<div data-more></div>');
        var a = $("[data-answer]", screen);
        var agree = function () { S.a.consent = true; S.consentAt = new Date().toISOString(); save(); next(); };
        var more = function () {
          $("[data-more]", a).innerHTML = '<p class="consent-box">' + icon("check") + "<span>" + esc(t("g.consentMore")) + "</span></p>";
          ask(t("g.consentMore") + " " + t("g.consent"), { handler: STEPS.consent.speech });
        };
        a.onclick = function (e) {
          var b = e.target.closest("[data-act]");
          if (!b) return;
          if (b.dataset.act === "agree") agree(); else more();
        };
        STEPS.consent._agree = agree; STEPS.consent._more = more;
        ask(t("g.consent"));
      },
      speech: function (txt) {
        var yn = D.yesNo(txt);
        if (yn === "yes") STEPS.consent._agree();
        else STEPS.consent._more();
      }
    },

    name: {
      prompt: function () { return t("g.name"); },
      enter: function () {
        shell("name");
        answer(kbBlock('<div class="field"><label for="f-name">' + esc(t("f.name")) + '</label><input class="input big" id="f-name" autocomplete="name" data-i18n-ph="ph.name" placeholder="' + esc(t("ph.name")) + '" value="' + esc(S.a.name) + '"></div><button type="button" class="btn btn-primary" data-act="submit">' + esc(t("btn.next")) + icon("arrow") + "</button>"));
        bindKb(function () {
          var v = cleanName($("#f-name").value);
          if (v.length < 2) { $("#f-name").classList.add("shake"); setTimeout(function () { $("#f-name").classList.remove("shake"); }, 500); return; }
          S.a.name = v; save(); next();
        });
        ask(t("g.name"));
      },
      speech: function (txt) {
        var v = cleanName(txt);
        if (v.length < 2) return silence();
        confirmValue(t("g.check", { v: v }), null,
          function () { S.a.name = v; save(); next(); },
          function () {
            STEPS.name.nos = (STEPS.name.nos || 0) + 1;
            STEPS.name.enter();
            if (STEPS.name.nos >= 2) { showKeyboard(); $("#f-name").value = v; }
          });
      }
    },

    mobile: {
      prompt: function () { return t("g.mobile"); },
      enter: function () {
        shell("mobile");
        answer(kbBlock('<div class="field"><label for="f-mob">' + esc(t("f.mobile")) + '</label><input class="input big" id="f-mob" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="14" placeholder="' + esc(t("ph.mobile")) + '" value="' + esc(S.a.mobile) + '"></div><p class="err" data-err hidden></p><button type="button" class="btn btn-primary" data-act="submit">' + esc(t("btn.next")) + icon("arrow") + "</button>") +
          (voiceOn ? chips([{ act: "kb", label: t("c.typeNumber"), icon: "keyboard", cls: "quiet" }]) : ""));
        bindKb(function () {
          var d = D.parseMobile($("#f-mob").value);
          if (!D.validMobile(d)) { var er = $("[data-err]", screen); er.hidden = false; er.textContent = t("g.mobileBad"); return; }
          S.a.mobile = d; save(); next();
        });
        ask(t("g.mobile"));
      },
      speech: function (txt, alts) {
        var d = D.parseMobile(txt);
        if (!D.validMobile(d)) {
          for (var i = 0; i < alts.length && !D.validMobile(d); i += 1) d = D.parseMobile(alts[i]);
        }
        if (!D.validMobile(d)) {
          STEPS.mobile.bad = (STEPS.mobile.bad || 0) + 1;
          if (STEPS.mobile.bad >= 2) { ask(t("g.failed"), { listen: false }); showKeyboard(); return; }
          return ask(t("g.mobileBad"));
        }
        var shown = D.groupMobile(d, lang());
        confirmValue(t("g.mobileCheck", { v: shown }), t("g.mobileCheck", { v: mobileSpeech(d) }),
          function () { S.a.mobile = d; save(); next(); },
          function () { STEPS.mobile.enter(); });
      }
    },

    trade: {
      prompt: function () { return t("g.trade"); },
      enter: function () {
        shell("trade");
        var grid = '<div class="trade-grid">' + D.TRADES.map(function (tr, i) {
          return '<button type="button" class="trade-chip" style="--i:' + i + '" data-trade="' + tr.id + '" aria-pressed="' + (S.a.trades.indexOf(tr.id) >= 0) + '">' + D.icon(tr.id) + "<span>" + esc(tr.label[li()]) + "</span></button>";
        }).join("") + "</div>";
        answer(grid + '<button type="button" class="btn btn-primary" data-act="done"' + (S.a.trades.length ? "" : " disabled") + ">" + icon("check") + "<span>" + esc(t("c.done")) + "</span></button>");
        var a = $("[data-answer]", screen);
        a.onclick = function (e) {
          var b = e.target.closest("[data-trade]");
          if (b) { toggleTrade(b.dataset.trade); return; }
          var d = e.target.closest("[data-act=done]");
          if (d && S.a.trades.length) next();
        };
        ask(t("g.trade"));
      },
      speech: function (txt) {
        var f = D.fold(txt);
        if (S.a.trades.length && /হয়ে গেছে|হয়ে গেছে|হয়েছে|আর না|আর নেই|ব্যাস|বাস|শেষ|done|finished|that's all|हो गया|बस|और नहीं/.test(f)) return next();
        var ids = D.matchTrades(txt);
        if (!ids.length) {
          if (S.a.trades.length && D.yesNo(txt) === "no") return next();
          return silence();
        }
        ids.forEach(function (id) { if (S.a.trades.indexOf(id) < 0) toggleTrade(id, true); });
        ask(t("g.tradeCheck", { v: tradeList(S.a.trades) }));
      }
    },

    puja: {
      prompt: function () { return t("g.puja"); },
      enter: function () {
        shell("puja");
        var added = S.a.pujas.length ? '<div class="added-list">' + S.a.pujas.map(function (p) { return '<span class="added">' + icon("check") + esc(p.name) + "</span>"; }).join("") + "</div>" : "";
        answer(added + kbBlock('<div class="field"><label for="f-puja">' + esc(t("f.puja")) + '</label><input class="input" id="f-puja" autocomplete="off" placeholder="' + esc(t("ph.puja")) + '"></div><p class="note">' + esc(t("pujaList")) + '</p><div class="suggest" data-suggest></div><button type="button" class="btn btn-primary" data-act="submit">' + esc(t("btn.next")) + icon("arrow") + "</button>"));
        var inp = $("#f-puja");
        var paint = function () {
          var list = D.searchPujas(inp.value, 5);
          $("[data-suggest]", screen).innerHTML = list.map(function (p, i) {
            var nm = lang() === "bn" ? p.bn : p.en;
            return '<button type="button" style="--i:' + i + '" data-pick="' + esc(p.en) + '"><b>' + esc(nm) + "</b><small>" + esc(p.area[lang() === "bn" ? 0 : 1] + ", " + D.DISTRICTS[p.d][li()]) + "</small></button>";
          }).join("");
        };
        inp.addEventListener("input", paint);
        paint();
        $("[data-answer]", screen).addEventListener("click", function (e) {
          var b = e.target.closest("[data-pick]");
          if (b) addPuja(D.PUJAS.filter(function (p) { return p.en === b.dataset.pick; })[0]);
        });
        bindKb(function () {
          var v = inp.value.trim();
          if (!v) { if (S.a.pujas.length) return askMore(); inp.classList.add("shake"); return; }
          addPuja(D.matchPuja(v) || v);
        });
        // From a pandal QR: just confirm what we already have.
        if (S.prefilled && S.a.pujas.length === 1 && !STEPS.puja.qrDone) {
          STEPS.puja.qrDone = true;
          var p0 = S.a.pujas[0].name;
          return confirmValue(t("g.pujaCheck", { v: p0 }), null, askMore, function () { S.a.pujas = []; S.prefilled = false; STEPS.puja.enter(); });
        }
        ask(t("g.puja"));
      },
      speech: function (txt) {
        var m = D.matchPuja(txt);
        var raw = txt.replace(/[।.]+$/, "").trim();
        if (m) {
          var nm = lang() === "bn" ? m.bn : m.en;
          confirmValue(t("g.pujaCheck", { v: nm }), null, function () { addPuja(m); }, function () {
            confirmValue(t("g.check", { v: raw }), null, function () { addPuja(raw); }, function () { STEPS.puja.enter(); });
          });
        } else {
          confirmValue(t("g.check", { v: raw }), null, function () { addPuja(raw); }, function () { STEPS.puja.enter(); });
        }
      }
    },

    place: {
      prompt: function () { return t("g.place"); },
      enter: function () {
        shell("place");
        var first = S.a.pujas[0] && S.a.pujas[0].id ? D.PUJAS.filter(function (p) { return p.en === S.a.pujas[0].id; })[0] : null;
        if (first && !S.a.area && !STEPS.place.declined) {
          var area = first.area[lang() === "bn" ? 0 : 1], di = first.d;
          var v = area + ", " + D.DISTRICTS[di][li()];
          return confirmValue(t("g.placePrefilled", { v: v }), null,
            function () { S.a.area = area; S.a.district = di; save(); next(); },
            function () { STEPS.place.declined = true; STEPS.place.enter(); });
        }
        var top = [0, 1, 2, 3, 4, 5];
        answer(kbBlock('<div class="field"><label for="f-area">' + esc(t("f.place")) + '</label><input class="input" id="f-area" autocomplete="address-level3" placeholder="' + esc(t("ph.area")) + '" value="' + esc(S.a.area) + '"></div>') +
          '<div class="field"><label>' + esc(t("ph.district")) + "</label>" +
          chips(top.map(function (i) { return { act: "dist", val: i, label: D.DISTRICTS[i][li()], cls: S.a.district === i ? "primary" : "" }; })) +
          '<select class="select" id="f-dist"><option value="-1">' + esc(t("ph.district")) + "</option>" + D.DISTRICTS.map(function (d, i) { return '<option value="' + i + '"' + (S.a.district === i ? " selected" : "") + ">" + esc(d[li()]) + "</option>"; }).join("") + "</select></div>" +
          '<button type="button" class="btn btn-primary" data-act="submit">' + esc(t("btn.next")) + icon("arrow") + "</button>");
        var a = $("[data-answer]", screen);
        a.addEventListener("click", function (e) {
          var b = e.target.closest("[data-act=dist]");
          if (!b) return;
          S.a.district = +b.dataset.val;
          $("#f-dist").value = b.dataset.val;
          $$("[data-act=dist]", a).forEach(function (c) { c.classList.toggle("primary", c === b); });
          save();
        });
        $("#f-dist").addEventListener("change", function () { S.a.district = +this.value; save(); });
        bindKb(function () {
          var ar = $("#f-area").value.trim();
          if (!ar && S.a.district < 0) { $("#f-area").classList.add("shake"); showKeyboard(); return; }
          S.a.area = ar; save(); next();
        });
        ask(t("g.place"));
      },
      speech: function (txt) {
        var di = D.matchDistrict(txt);
        var area = txt.replace(/[।.]+$/, "").trim();
        if (di >= 0) {
          D.DISTRICTS[di].forEach(function (n) { area = area.replace(n, ""); });
          area = area.replace(/\s*(জেলা|district|ज़िला|जिला)\s*/gi, " ").replace(/[,\s]+$/, "").replace(/^[,\s]+/, "").trim();
        }
        var v = [area, di >= 0 ? D.DISTRICTS[di][li()] : ""].filter(Boolean).join(", ");
        confirmValue(t("g.check", { v: v }), null, function () {
          S.a.area = area; if (di >= 0) S.a.district = di; save();
          if (S.a.district < 0) { STEPS.place.enter(); showKeyboard(); setLine(t("ph.district")); } else next();
        }, function () { STEPS.place.enter(); });
      }
    },

    sardar: {
      prompt: function () { return t("g.sardar"); },
      enter: function () {
        shell("sardar");
        answer(chips([{ act: "self", label: t("c.iAmSardar"), icon: "users" }, { act: "unknown", label: t("c.dontKnow"), cls: "quiet" }]) +
          kbBlock('<div class="field"><label for="f-sname">' + esc(t("f.sardar")) + '</label><input class="input" id="f-sname" placeholder="' + esc(t("ph.sardar")) + '" value="' + esc(S.a.sardar) + '"></div><div class="field"><input class="input" id="f-smob" type="tel" inputmode="numeric" maxlength="14" placeholder="' + esc(t("ph.sardarMobile")) + '" value="' + esc(S.a.sardarMobile) + '"></div><p class="err" data-err hidden></p><button type="button" class="btn btn-primary" data-act="submit">' + esc(t("btn.next")) + icon("arrow") + "</button>"));
        var a = $("[data-answer]", screen);
        a.addEventListener("click", function (e) {
          var b = e.target.closest("[data-act]");
          if (!b) return;
          if (b.dataset.act === "self") { S.a.sardarSelf = true; S.a.sardarUnknown = false; S.a.sardar = ""; save(); next(); }
          if (b.dataset.act === "unknown") { S.a.sardarUnknown = true; S.a.sardarSelf = false; S.a.sardar = ""; save(); next(); }
        });
        bindKb(function () {
          var nm = cleanName($("#f-sname").value), mb = D.parseMobile($("#f-smob").value);
          if (nm.length < 2) { $("#f-sname").classList.add("shake"); return; }
          if (mb && !D.validMobile(mb)) { var er = $("[data-err]", screen); er.hidden = false; er.textContent = t("g.mobileBad"); return; }
          S.a.sardar = nm; S.a.sardarMobile = mb || ""; S.a.sardarSelf = false; S.a.sardarUnknown = false; save(); next();
        });
        ask(t("g.sardar"));
      },
      speech: function (txt) {
        var f = D.fold(txt);
        if (/আমিই|আমি সর্দার|i am the|i'm the|मैं ही|मैं सरदार/.test(f)) { S.a.sardarSelf = true; save(); return next(); }
        if (/জানি না|জানিনা|don't know|dont know|not sure|पता नहीं|मालूम नहीं/.test(f)) { S.a.sardarUnknown = true; save(); return next(); }
        var mb = D.parseMobile(txt);
        var name = D.toAscii(txt).split(/\s+/).filter(function (w) { return !/\d/.test(w) && !D.parseMobile(w); }).join(" ");
        name = cleanName(name.replace(/(ওনার|উনার|ফোন|নম্বর|নাম্বার|number|phone|फ़ोन|फोन|नंबर)/gi, "").replace(/\s+/g, " "));
        if (name.length < 2) return silence();
        var hasMob = D.validMobile(mb);
        var shown = name + (hasMob ? " · " + D.groupMobile(mb, lang()) : "");
        var spoken = name + (hasMob ? ", " + mobileSpeech(mb) : "");
        confirmValue(t("g.check", { v: shown }), t("g.check", { v: spoken }), function () {
          S.a.sardar = name; S.a.sardarMobile = hasMob ? mb : ""; S.a.sardarSelf = false; S.a.sardarUnknown = false; save(); next();
        }, function () { STEPS.sardar.enter(); showKeyboard(); });
      }
    },

    family: {
      prompt: function () { return t("g.family"); },
      enter: function () {
        shell("family");
        var list = [{ act: "n", val: 0, label: t("c.alone") }];
        for (var i = 1; i <= 5; i += 1) list.push({ act: "n", val: i, label: L(i) + (i === 5 ? "+" : "") });
        answer(chips(list.map(function (c) { if (S.a.family === c.val) c.cls = "primary"; return c; })));
        $("[data-answer]", screen).onclick = function (e) {
          var b = e.target.closest("[data-act=n]");
          if (!b) return;
          S.a.family = +b.dataset.val; save(); next();
        };
        ask(t("g.family"));
      },
      speech: function (txt) {
        var n = parseCount(txt);
        if (n == null) return silence();
        S.a.family = n; save();
        setLine(t("f.family") + ": " + familyText());
        setTimeout(next, 700);
      }
    },

    confirm: {
      prompt: function () { return t("g.confirm"); },
      enter: function () {
        shell("confirm");
        var rows = [
          ["name", S.a.name], ["mobile", D.groupMobile(S.a.mobile, lang())], ["trade", tradeList(S.a.trades)],
          ["puja", S.a.pujas.map(function (p) { return p.name; }).join(", ")], ["place", placeText()],
          ["sardar", sardarText()], ["family", familyText()]
        ];
        answer('<dl class="confirm-list">' + rows.map(function (r, i) {
          return '<button type="button" class="confirm-row" style="--i:' + i + '" data-edit="' + r[0] + '"><dt>' + esc(t("f." + r[0])) + "</dt><dd>" + esc(r[1] || "–") + '</dd><span class="edit">' + icon("pencil") + esc(t("btn.edit")) + "</span></button>";
        }).join("") + "</dl>" +
          '<p class="consent-box">' + icon("check") + "<span>" + esc(t("footer.privacy")) + "</span></p>" +
          '<button type="button" class="btn btn-primary btn-xl pulse" data-act="ok">' + icon("check") + "<span>" + esc(t("c.allRight")) + "</span></button>");
        $("[data-answer]", screen).onclick = function (e) {
          var ed = e.target.closest("[data-edit]");
          if (ed) {
            var st = ed.dataset.edit;
            S.returnTo = "confirm";
            if (st === "puja") { S.a.pujas = []; S.prefilled = false; }
            if (st === "place") { S.a.area = ""; STEPS.place.declined = true; }
            if (st === "family") S.a.family = null;
            go(st);
            return;
          }
          if (e.target.closest("[data-act=ok]")) submit();
        };
        var readback = rows.filter(function (r) { return r[1]; }).map(function (r) {
          var v = r[0] === "mobile" ? mobileSpeech(S.a.mobile) : r[1];
          return t("f." + r[0]) + ": " + v;
        }).join("। ");
        ask(t("g.confirm"), { speech: readback + "। " + t("g.confirm") });
      },
      speech: function (txt) {
        if (D.yesNo(txt) === "yes") submit();
        else setLine(t("g.confirm"));
      }
    },

    card: {
      enter: function () { cardScreen(); }
    }
  };

  function toggleTrade(id, flash) {
    var i = S.a.trades.indexOf(id);
    if (i >= 0 && !flash) S.a.trades.splice(i, 1); else if (i < 0) S.a.trades.push(id);
    save();
    var b = $('[data-trade="' + id + '"]', screen);
    if (b) {
      b.setAttribute("aria-pressed", String(S.a.trades.indexOf(id) >= 0));
      if (flash) { b.classList.remove("flash"); void b.offsetWidth; b.classList.add("flash"); }
    }
    var done = $("[data-act=done]", screen);
    if (done) done.disabled = !S.a.trades.length;
    slip();
  }

  function addPuja(p) {
    var item = typeof p === "string" ? { name: p, id: null } : { name: lang() === "bn" ? p.bn : p.en, id: p.en };
    if (!S.a.pujas.some(function (x) { return x.name === item.name; })) S.a.pujas.push(item);
    save();
    slip();
    askMore();
  }

  function askMore() {
    shell("puja");
    answer('<div class="added-list">' + S.a.pujas.map(function (p) { return '<span class="added">' + icon("check") + esc(p.name) + "</span>"; }).join("") + "</div>" +
      chips([{ act: "no", label: t("c.noMore"), cls: "primary", icon: "arrow" }, { act: "yes", label: t("c.otherPuja"), icon: "plus" }]));
    var more = function () { STEPS.puja.qrDone = true; STEPS.puja.enter(); };
    $("[data-answer]", screen).onclick = function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "yes") more(); else next();
    };
    ask(t("g.pujaMore"), { handler: function (txt) {
      var yn = D.yesNo(txt);
      if (yn === "yes") more();
      else if (yn === "no") next();
      else if (D.matchPuja(txt)) addPuja(D.matchPuja(txt));
      else next();
    } });
  }

  /* ---------------- Assisted mode: volunteer desk ---------------- */
  function assistedStart() {
    var saved = null;
    try { saved = sessionStorage.getItem(ASSIST); } catch (e) { /* ignore */ }
    setLine(t("assist.title"));
    answer('<div class="field"><label for="f-vol">' + esc(t("assist.who")) + '</label><input class="input" id="f-vol" value="' + esc(saved || "") + '"></div><button type="button" class="btn btn-primary" data-act="go">' + esc(t("assist.start")) + icon("arrow") + "</button>");
    $("[data-act=go]", screen).onclick = function () {
      var v = $("#f-vol").value.trim();
      if (!v) { $("#f-vol").classList.add("shake"); return; }
      try { sessionStorage.setItem(ASSIST, v); } catch (e) { /* ignore */ }
      S.assistedBy = v; save(); go("consent");
    };
  }

  /* ---------------- Submit & card ---------------- */
  function record() {
    return {
      regNo: S.regNo, name: S.a.name, mobile: S.a.mobile, trades: S.a.trades.slice(),
      pujas: S.a.pujas.slice(), puja: S.a.pujas.map(function (p) { return p.name; }).join(", "),
      area: S.a.area, district: S.a.district, districtName: districtName(S.a.district),
      sardar: S.a.sardar, sardarMobile: S.a.sardarMobile, sardarSelf: S.a.sardarSelf, sardarUnknown: S.a.sardarUnknown,
      family: S.a.family || 0, consent: S.a.consent, consentAt: S.consentAt || null, language: lang(),
      assistedBy: S.assistedBy || null, source: S.source, mode: mode, createdAt: new Date().toISOString()
    };
  }
  async function submit() {
    if (!S.regNo) S.regNo = BKS.card.regNo();
    var rec = record();
    var list = read(DONE) || [];
    if (!list.some(function (r) { return r.regNo === rec.regNo; })) list.push(rec);
    store(DONE, list.slice(-200));
    if (BKS.config.apiEndpoint) {
      try {
        await fetch(BKS.config.apiEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rec) });
      } catch (e) { rec.pending = true; }
    }
    save();
    go("card");
  }

  var photoImg = null;
  async function cardScreen() {
    dock.hidden = true;
    var rec = record();
    screen.innerHTML = '<div class="card-stage">' +
      (S.assistedBy ? '<span class="assist-badge">' + esc(t("assist.badge", { v: S.assistedBy })) + "</span>" : "") +
      "<h2>" + esc(t("card.yours")) + "</h2>" +
      '<p class="guide-line" data-line style="min-height:0;text-align:center"></p>' +
      '<div class="card-flip"><canvas class="card-canvas" data-card width="1080" height="1350" aria-label="' + esc(t("card.yours")) + '"></canvas></div>' +
      '<div class="card-actions">' +
      '<button type="button" class="btn btn-wa btn-xl shine" data-act="wa">' + icon("wa") + "<span>" + esc(t("card.whatsapp")) + "</span></button>" +
      '<div class="two"><button type="button" class="btn btn-ghost" data-act="save">' + icon("download") + "<span>" + esc(t("card.save")) + '</span></button>' +
      '<label class="btn btn-ghost" style="cursor:pointer">' + icon("camera") + "<span>" + esc(t("card.photo")) + '</span><input type="file" accept="image/*" capture="user" data-photo hidden></label></div>' +
      '<p class="note">' + esc(t("card.photoNote")) + "</p>" +
      '<a class="btn btn-gold" href="/event/">' + icon("cal") + "<span>" + esc(t("card.event")) + "</span></a>" +
      (S.assistedBy ? '<button type="button" class="btn btn-primary" data-act="nextp">' + icon("users") + "<span>" + esc(t("card.next")) + "</span></button>" : '<a class="btn-link" href="/">' + esc(t("card.home")) + "</a>") +
      "</div></div>";
    setLine(t("g.done"));
    var cv = $("[data-card]", screen);
    await waitForQR();
    await BKS.card.draw(cv, { name: rec.name, trades: rec.trades, puja: rec.puja, area: rec.area, district: rec.district, family: rec.family, regNo: rec.regNo, photo: photoImg }, lang());
    cv.classList.add("reveal");
    setTimeout(function () { BKS.card.burst(cv); }, 500);
    if (BKS.config.media.anthemAudio && unlocked) {
      try {
        var au = new Audio(BKS.config.media.anthemAudio);
        au.volume = .35;
        au.play();
        setTimeout(function () { var k = setInterval(function () { au.volume = Math.max(0, au.volume - .05); if (au.volume <= 0) { au.pause(); clearInterval(k); } }, 200); }, 9000);
      } catch (e) { /* no sound */ }
    }
    if (voiceOn && unlocked) V.speak(t("g.done"), lang());
    var file = "nimantran-" + rec.regNo + ".jpg";
    screen.querySelector(".card-actions").onclick = function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "save") BKS.card.save(cv, file);
      if (b.dataset.act === "wa") BKS.card.share(cv, t("card.shareText", { event: BKS.i18n.pick(BKS.config.event.name), name: rec.name, trade: tradeList(rec.trades), puja: rec.puja, url: location.origin + "/" }), file);
      if (b.dataset.act === "nextp") { var keep = S.assistedBy; drop(KEY); S = blank(); S.assistedBy = keep; photoImg = null; save(); go("consent"); }
    };
    $("[data-photo]", screen).addEventListener("change", function () {
      var f = this.files && this.files[0];
      if (!f) return;
      var im = new Image();
      im.onload = async function () {
        photoImg = im;
        await BKS.card.draw(cv, { name: rec.name, trades: rec.trades, puja: rec.puja, area: rec.area, district: rec.district, family: rec.family, regNo: rec.regNo, photo: im }, lang());
        cv.classList.remove("reveal"); void cv.offsetWidth; cv.classList.add("reveal");
      };
      im.src = URL.createObjectURL(f);
    });
  }
  function waitForQR() {
    return new Promise(function (res) {
      var n = 0;
      (function check() { if (typeof window.qrcode === "function" || n++ > 30) res(); else setTimeout(check, 100); })();
    });
  }

  /* ---------------- Slip + progress ---------------- */
  var SLIP_ROWS = ["name", "mobile", "trade", "puja", "place", "sardar", "family"];
  function slipValue(r) {
    if (r === "name") return S.a.name;
    if (r === "mobile") return S.a.mobile ? D.groupMobile(S.a.mobile, lang()) : "";
    if (r === "trade") return tradeList(S.a.trades);
    if (r === "puja") return S.a.pujas.map(function (p) { return p.name; }).join(", ");
    if (r === "place") return placeText();
    if (r === "sardar") return S.a.sardar || S.a.sardarSelf || S.a.sardarUnknown ? sardarText() : "";
    if (r === "family") return familyText();
    return "";
  }
  function slip() {
    var show = S.a.consent && ["intro", "consent", "confirm", "card"].indexOf(S.step) < 0;
    dock.hidden = !show;
    if (!slipEl.dataset.built || slipEl.dataset.built !== lang()) {
      slipEl.innerHTML = '<div class="slip-title"><span>' + esc(t("slip.title")) + '</span><small data-count></small></div>' +
        SLIP_ROWS.map(function (r) { return '<div class="slip-row is-empty" data-row="' + r + '"><dt>' + esc(t("f." + r)) + "</dt><dd>–</dd>" + icon("stamp", "stamp") + "</div>"; }).join("");
      slipEl.dataset.built = lang();
    }
    var filled = 0;
    SLIP_ROWS.forEach(function (r) {
      var row = $('[data-row="' + r + '"]', slipEl), v = slipValue(r);
      var dd = $("dd", row);
      if (v) {
        filled += 1;
        if (dd.textContent !== v) dd.textContent = v;
        if (!row.classList.contains("is-filled")) { row.classList.remove("is-empty"); row.classList.add("is-filled"); }
      } else {
        row.classList.remove("is-filled"); row.classList.add("is-empty"); dd.textContent = "–";
      }
    });
    $("[data-count]", slipEl).textContent = L(filled) + "/" + L(SLIP_ROWS.length);
    // Keep the newest line visible when collapsed.
    if (!slipEl.classList.contains("open")) {
      var last = $$(".slip-row.is-filled", slipEl).pop();
      if (last) slipEl.scrollTop = last.offsetTop - 36;
    }
  }
  slipEl.addEventListener("click", function (e) {
    var row = e.target.closest(".slip-row.is-filled");
    if (row && slipEl.classList.contains("open")) {
      S.returnTo = S.step;
      var st = row.dataset.row;
      if (st === "puja") { S.a.pujas = []; S.prefilled = false; }
      slipEl.classList.remove("open");
      go(st);
      return;
    }
    slipEl.classList.toggle("open");
    slipEl.setAttribute("aria-expanded", String(slipEl.classList.contains("open")));
  });

  function dots() {
    var n = DOT[S.step];
    dotsEl.innerHTML = [0, 1, 2, 3, 4, 5, 6].map(function (i) {
      var c = n == null ? "" : i < n ? "done" : i === n ? "now" : "";
      return '<i class="' + c + '"></i>';
    }).join("");
  }

  /* ---------------- Mic & global controls ---------------- */
  document.addEventListener("pointerdown", function () { unlocked = true; }, { once: true, capture: true });
  document.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") unlocked = true; }, { capture: true });
  screen.addEventListener("click", function (e) {
    var m = e.target.closest("[data-mic]");
    if (!m) return;
    unlocked = true;
    if (!V.supported) { setLine(t("g.noVoice")); showKeyboard(); return; }
    if (!voiceOn) { voiceOn = true; mode = mode === "text" ? "voice" : mode; m.classList.remove("is-off"); }
    if (V.speaking) { V.stopSpeaking(); turn += 1; listen(); return; }        // interrupt the guide
    if (V.listening) { V.stopListening(); turn += 1; setMic("idle"); return; }
    if (S.step === "intro" && !STEPS.intro.spoken) {
      STEPS.intro.spoken = true;
      ask(t("g.intro"), { handler: STEPS.intro.speech });
      return;
    }
    listen();
  });
  $("[data-back]").addEventListener("click", function (e) {
    if (mode === "crew") return;
    e.preventDefault();
    prev();
  });

  document.addEventListener("bks:lang", function () {
    if (keepLangQuiet) return;
    if (mode === "crew") { crew.render(); return; }
    slipEl.dataset.built = "";
    go(S.step);
  });

  /* ---------------- Crew mode (sardar) ---------------- */
  var crew = (function () {
    var C = read(CREW) || { stage: 1, me: { name: "", mobile: "" }, puja: "", area: "", district: -1, trades: [], members: [], sent: {} };
    var draftTrades = C.trades.slice();
    var lastAdded = null;
    function persist() { store(CREW, C); }
    function head(stage) {
      var names = [t("crew.s1"), t("crew.s2"), t("crew.s3")];
      return '<div class="crew-steps">' + names.map(function (n, i) { return '<span class="' + (i + 1 === stage ? "on" : i + 1 < stage ? "done" : "") + '">' + L(i + 1) + ". " + esc(n) + "</span>"; }).join("") + "</div>";
    }
    function tradeGrid(sel) {
      return '<div class="trade-grid">' + D.TRADES.map(function (tr, i) {
        return '<button type="button" class="trade-chip" style="--i:' + i + '" data-trade="' + tr.id + '" aria-pressed="' + (sel.indexOf(tr.id) >= 0) + '">' + D.icon(tr.id) + "<span>" + esc(tr.label[li()]) + "</span></button>";
      }).join("") + "</div>";
    }
    function dictate(btn, input, isNumber) {
      if (!V.supported) { input.focus(); return; }
      unlocked = true;
      btn.classList.add("on");
      V.listen(lang()).then(function (r) {
        btn.classList.remove("on");
        if (r.text) input.value = isNumber ? D.parseMobile(r.text) : cleanName(r.text);
        input.dispatchEvent(new Event("input"));
      });
    }
    function micBtn(target, num) {
      return '<button type="button" class="mini-mic" data-dictate="' + target + '"' + (num ? ' data-num="1"' : "") + ' aria-label="' + esc(t("btn.voice")) + '">' + icon("mic") + "</button>";
    }

    function stage1() {
      screen.innerHTML = head(1) + '<h2 class="crew-h">' + esc(t("crew.title")) + '</h2><p class="lead" style="margin:0">' + esc(t("crew.intro")) + "</p>" +
        '<div class="field"><label for="c-name">' + esc(t("crew.you")) + '</label><div class="input-row"><input class="input" id="c-name" value="' + esc(C.me.name) + '">' + micBtn("c-name") + "</div></div>" +
        '<div class="field"><label for="c-mob">' + esc(t("crew.yourMobile")) + '</label><div class="input-row"><input class="input" id="c-mob" type="tel" inputmode="numeric" maxlength="14" value="' + esc(C.me.mobile) + '">' + micBtn("c-mob", 1) + "</div></div>" +
        '<div class="field"><label for="c-puja">' + esc(t("f.puja")) + '</label><input class="input" id="c-puja" autocomplete="off" placeholder="' + esc(t("ph.puja")) + '" value="' + esc(C.puja) + '"><div class="suggest" data-suggest></div></div>' +
        '<div class="field"><label for="c-area">' + esc(t("f.place")) + '</label><input class="input" id="c-area" placeholder="' + esc(t("ph.area")) + '" value="' + esc(C.area) + '"></div>' +
        '<div class="field"><select class="select" id="c-dist"><option value="-1">' + esc(t("ph.district")) + "</option>" + D.DISTRICTS.map(function (d, i) { return '<option value="' + i + '"' + (C.district === i ? " selected" : "") + ">" + esc(d[li()]) + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label>' + esc(t("crew.mainTrade")) + "</label>" + tradeGrid(C.trades) + "</div>" +
        '<p class="err" data-err hidden></p><button type="button" class="btn btn-primary btn-xl" data-act="s1">' + esc(t("btn.next")) + icon("arrow") + "</button>";
      var pin = $("#c-puja");
      var paint = function () {
        var list = pin.value.trim() ? D.searchPujas(pin.value, 4) : [];
        $("[data-suggest]", screen).innerHTML = list.map(function (p, i) {
          return '<button type="button" style="--i:' + i + '" data-pick="' + esc(p.en) + '"><b>' + esc(lang() === "bn" ? p.bn : p.en) + "</b><small>" + esc(p.area[lang() === "bn" ? 0 : 1] + ", " + D.DISTRICTS[p.d][li()]) + "</small></button>";
        }).join("");
      };
      pin.addEventListener("input", paint);
      screen.onclick = function (e) {
        var pk = e.target.closest("[data-pick]");
        if (pk) {
          var p = D.PUJAS.filter(function (x) { return x.en === pk.dataset.pick; })[0];
          pin.value = lang() === "bn" ? p.bn : p.en;
          $("#c-area").value = p.area[lang() === "bn" ? 0 : 1];
          $("#c-dist").value = p.d;
          $("[data-suggest]", screen).innerHTML = "";
          return;
        }
        var tb = e.target.closest("[data-trade]");
        if (tb) {
          var id = tb.dataset.trade, k = C.trades.indexOf(id);
          if (k >= 0) C.trades.splice(k, 1); else C.trades.push(id);
          tb.setAttribute("aria-pressed", String(k < 0));
          return;
        }
        var dm = e.target.closest("[data-dictate]");
        if (dm) { dictate(dm, $("#" + dm.dataset.dictate), !!dm.dataset.num); return; }
        if (e.target.closest("[data-act=s1]")) {
          C.me.name = cleanName($("#c-name").value);
          C.me.mobile = D.parseMobile($("#c-mob").value);
          C.puja = pin.value.trim(); C.area = $("#c-area").value.trim(); C.district = +$("#c-dist").value;
          if (C.me.name.length < 2 || !D.validMobile(C.me.mobile) || !C.puja || (!C.area && C.district < 0)) {
            var er = $("[data-err]", screen); er.hidden = false; er.textContent = t("crew.needSelf"); return;
          }
          draftTrades = C.trades.slice();
          C.stage = 2; persist(); render();
        }
      };
    }

    function memberRow(m, i, withSend) {
      var tr = m.trades.map(function (id) { return D.trade(id).short[li()]; }).join(", ");
      var sent = C.sent[m.regNo];
      return '<div class="member' + (sent ? " sent" : "") + (m.regNo === lastAdded ? " new" : "") + '"><span class="num">' + L(i + 1) + "</span><div><b>" + esc(m.name) + "</b><small>" + esc(D.groupMobile(m.mobile, lang())) + " · " + esc(tr) + "</small></div>" +
        (withSend ? '<button type="button" class="btn ' + (sent ? "btn-ghost" : "btn-wa") + '" data-send="' + i + '">' + icon(sent ? "check" : "wa") + "<span>" + esc(sent ? t("crew.sent") : t("crew.send")) + "</span></button>"
          : '<button type="button" class="icon-btn" data-rm="' + i + '" aria-label="' + esc(t("crew.remove")) + '">' + icon("x") + "</button>") + "</div>";
    }

    function stage2() {
      var canPick = "contacts" in navigator && "ContactsManager" in window;
      screen.innerHTML = head(2) + '<div class="row-actions"><h2 class="crew-h">' + esc(t("crew.list")) + '</h2><span class="count-pill">' + icon("users") + esc(t("crew.count", { n: L(C.members.length) })) + "</span></div>" +
        '<div class="members" data-members>' + (C.members.length ? C.members.map(function (m, i) { return memberRow(m, i, false); }).join("") : '<p class="note">' + esc(t("crew.empty")) + "</p>") + "</div>" +
        '<div class="slip" style="display:grid;gap:12px">' +
        '<div class="field"><label for="m-name">' + esc(t("crew.member")) + '</label><div class="input-row"><input class="input" id="m-name">' + micBtn("m-name") + "</div></div>" +
        '<div class="field"><label for="m-mob">' + esc(t("crew.memberMobile")) + '</label><div class="input-row"><input class="input" id="m-mob" type="tel" inputmode="numeric" maxlength="14">' + micBtn("m-mob", 1) + "</div></div>" +
        '<div class="field"><label>' + esc(t("f.trade")) + "</label>" + tradeGrid(draftTrades) + "</div>" +
        '<p class="err" data-err hidden></p>' +
        '<button type="button" class="btn btn-primary" data-act="add">' + icon("plus") + "<span>" + esc(t("crew.add")) + "</span></button>" +
        (canPick ? '<button type="button" class="btn btn-ghost btn-sm" data-act="contacts">' + icon("users") + "<span>" + esc(t("crew.contacts")) + "</span></button>" : "") +
        "</div>" +
        '<button type="button" class="btn btn-gold btn-xl" data-act="s2"' + (C.members.length ? "" : " disabled") + ">" + icon("wa") + "<span>" + esc(t("crew.finish")) + "</span></button>" +
        '<button type="button" class="btn-link" data-act="back1">' + esc(t("btn.back")) + "</button>";
      screen.onclick = function (e) {
        var tb = e.target.closest("[data-trade]");
        if (tb) {
          var id = tb.dataset.trade, k = draftTrades.indexOf(id);
          if (k >= 0) draftTrades.splice(k, 1); else draftTrades.push(id);
          tb.setAttribute("aria-pressed", String(k < 0));
          return;
        }
        var dm = e.target.closest("[data-dictate]");
        if (dm) { dictate(dm, $("#" + dm.dataset.dictate), !!dm.dataset.num); return; }
        var rm = e.target.closest("[data-rm]");
        if (rm) { C.members.splice(+rm.dataset.rm, 1); persist(); render(); return; }
        var act = e.target.closest("[data-act]");
        if (!act) return;
        if (act.dataset.act === "add") addMember($("#m-name").value, $("#m-mob").value, draftTrades.slice());
        if (act.dataset.act === "contacts") pickContacts();
        if (act.dataset.act === "s2") { C.stage = 3; persist(); render(); }
        if (act.dataset.act === "back1") { C.stage = 1; persist(); render(); }
      };
    }

    function addMember(name, mob, trades) {
      var nm = cleanName(name), d = D.parseMobile(mob), er = $("[data-err]", screen);
      if (nm.length < 2 || !D.validMobile(d) || !trades.length) { if (er) { er.hidden = false; er.textContent = t("crew.need"); } return false; }
      if (C.members.some(function (m) { return m.mobile === d; })) { if (er) { er.hidden = false; er.textContent = t("crew.dup"); } return false; }
      var m = { name: nm, mobile: d, trades: trades, regNo: BKS.card.regNo() };
      C.members.push(m);
      lastAdded = m.regNo;
      var list = read(DONE) || [];
      list.push({ regNo: m.regNo, name: m.name, mobile: m.mobile, trades: m.trades, puja: C.puja, area: C.area, district: C.district, sardar: C.me.name, sardarMobile: C.me.mobile, consent: false, source: "crew", createdAt: new Date().toISOString() });
      store(DONE, list.slice(-200));
      if (BKS.config.apiEndpoint) fetch(BKS.config.apiEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(list[list.length - 1]) }).catch(function () {});
      persist();
      render();
      var nameInput = $("#m-name");
      if (nameInput) nameInput.focus();
      return true;
    }

    async function pickContacts() {
      try {
        var res = await navigator.contacts.select(["name", "tel"], { multiple: true });
        res.forEach(function (c) { addMember((c.name || [])[0] || "", (c.tel || [])[0] || "", draftTrades.length ? draftTrades.slice() : ["other"]); });
      } catch (e) { /* cancelled */ }
    }

    function stage3() {
      screen.innerHTML = head(3) + '<h2 class="crew-h">' + esc(t("crew.s3")) + '</h2><p class="note" style="font-size:1rem">' + esc(t("crew.sendEach")) + "</p>" +
        '<div class="members">' + C.members.map(function (m, i) { return memberRow(m, i, true); }).join("") + "</div>" +
        '<a class="btn btn-primary" href="/register/?mode=voice&amp;trade=sardar&amp;puja=' + encodeURIComponent(C.puja) + "&amp;area=" + encodeURIComponent(C.area) + "&amp;district=" + C.district + '">' + icon("ticket") + "<span>" + esc(t("card.yours")) + "</span></a>" +
        '<button type="button" class="btn-link" data-act="back2">' + esc(t("btn.back")) + "</button>";
      screen.onclick = function (e) {
        var s = e.target.closest("[data-send]");
        if (s) {
          var m = C.members[+s.dataset.send];
          var url = BKS.card.linkFor({ name: m.name, trades: m.trades, puja: C.puja, area: C.area, district: C.district, regNo: m.regNo, by: C.me.name });
          var msg = t("crew.msg", { name: m.name, sardar: C.me.name, event: BKS.i18n.pick(BKS.config.event.name), url: url });
          window.open("https://wa.me/91" + m.mobile + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
          C.sent[m.regNo] = true; persist();
          setTimeout(render, 300);
          return;
        }
        if (e.target.closest("[data-act=back2]")) { C.stage = 2; persist(); render(); }
      };
    }

    function render() {
      dock.hidden = true;
      dotsEl.innerHTML = "";
      if (C.stage === 2) stage2(); else if (C.stage === 3) stage3(); else stage1();
      screen.classList.remove("screen-in"); void screen.offsetWidth; screen.classList.add("screen-in");
    }
    return { render: render };
  })();

  /* ---------------- Boot ---------------- */
  if (BKS.config.previewMode) $("[data-preview]").hidden = false;
  if (mode === "crew") crew.render();
  else if (resumable) go("intro");
  else go(S.step && S.step !== "card" ? S.step : "intro");
})(window.BKS);
