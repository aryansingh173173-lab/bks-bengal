/* Voice guide engine. Provider-independent on purpose (brief, section 13):
   the screens only call speak() / listen(), so Gemini, Sarvam or ElevenLabs
   can replace the browser engines later without touching the flow. */
(function (BKS) {
  "use strict";
  var LOCALE = { bn: "bn-IN", en: "en-IN", hi: "hi-IN" };
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var synth = window.speechSynthesis;
  var voices = [];
  var rec = null;
  var speaking = false;
  var listening = false;

  function loadVoices() { if (synth) voices = synth.getVoices() || []; }
  loadVoices();
  if (synth && "onvoiceschanged" in synth) synth.onvoiceschanged = loadVoices;

  function voiceFor(lang) {
    var want = LOCALE[lang].toLowerCase();
    var pre = lang;
    return voices.filter(function (v) { return v.lang.toLowerCase().replace("_", "-") === want; })[0] ||
      voices.filter(function (v) { return v.lang.toLowerCase().indexOf(pre) === 0; })[0] || null;
  }

  function canSpeak(lang) {
    if (!synth) return false;
    loadVoices();
    // Without a Bangla or Hindi voice the phone would read the script with an
    // English voice, which is worse than silence. Show the text only.
    if (lang === "en") return true;
    return !!voiceFor(lang);
  }

  function speak(text, lang, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (!canSpeak(lang) || !text) { resolve(false); return; }
      try { synth.cancel(); } catch (e) { /* ignore */ }
      var u = new SpeechSynthesisUtterance(text);
      u.lang = LOCALE[lang];
      var v = voiceFor(lang);
      if (v) u.voice = v;
      u.rate = opts.rate || .9; // slightly slower than normal speech
      u.pitch = 1;
      var done = false;
      var finish = function () { if (done) return; done = true; speaking = false; if (opts.onEnd) opts.onEnd(); resolve(true); };
      u.onend = finish;
      u.onerror = finish;
      speaking = true;
      if (opts.onStart) opts.onStart();
      synth.speak(u);
      // Some Android builds never fire onend; fall back on a reading-time estimate.
      setTimeout(finish, Math.min(20000, 1500 + text.length * 95));
    });
  }

  function stopSpeaking() {
    if (synth) { try { synth.cancel(); } catch (e) { /* ignore */ } }
    speaking = false;
  }

  /* listen() resolves { text, alts } or { error: "no-speech" | "not-allowed" | "unsupported" | "aborted" | … } */
  function listen(lang, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (!SR) { resolve({ error: "unsupported" }); return; }
      stopListening();
      var r = new SR();
      rec = r;
      r.lang = LOCALE[lang];
      r.interimResults = true;
      r.maxAlternatives = 3;
      r.continuous = false;
      var finalText = "", alts = [], settled = false, heardAny = false;
      var silence = setTimeout(function () { if (!heardAny) { try { r.stop(); } catch (e) { /* ignore */ } } }, opts.silenceMs || 6500);
      function settle(v) {
        if (settled) return;
        settled = true;
        clearTimeout(silence);
        listening = false;
        if (rec === r) rec = null;
        resolve(v);
      }
      r.onstart = function () { listening = true; if (opts.onStart) opts.onStart(); };
      r.onspeechstart = function () { heardAny = true; };
      r.onresult = function (e) {
        var interim = "";
        for (var i = e.resultIndex; i < e.results.length; i += 1) {
          var res = e.results[i];
          if (res.isFinal) {
            finalText += res[0].transcript;
            for (var j = 0; j < res.length; j += 1) alts.push(res[j].transcript);
          } else interim += res[0].transcript;
        }
        heardAny = true;
        if (opts.onInterim) opts.onInterim((finalText + " " + interim).trim());
      };
      r.onerror = function (e) { settle({ error: e.error || "error" }); };
      r.onend = function () { settle(finalText.trim() ? { text: finalText.trim(), alts: alts } : { error: "no-speech" }); };
      try { r.start(); } catch (e) { settle({ error: "busy" }); }
    });
  }

  function stopListening() {
    if (rec) { try { rec.abort(); } catch (e) { /* ignore */ } rec = null; }
    listening = false;
  }

  BKS.voice = {
    supported: !!SR,
    speak: speak, stopSpeaking: stopSpeaking, canSpeak: canSpeak,
    listen: listen, stopListening: stopListening,
    get speaking() { return speaking; }, get listening() { return listening; }
  };
})(window.BKS = window.BKS || {});
