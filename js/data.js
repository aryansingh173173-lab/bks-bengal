/* Trades, Pujas and districts, plus the matchers the voice guide uses. */
(function (BKS) {
  "use strict";

  // 24×24 stroke icons. One simple picture per trade (brief, section 12).
  var ICON = {
    idol: '<path d="M9.5 3.5 12 2l2.5 1.5M8 6.5h8"/><circle cx="12" cy="11" r="4"/><path d="M5 21c1.2-3.4 3.8-5.5 7-5.5s5.8 2.1 7 5.5"/><path d="M12 9.2v.1"/>',
    bamboo: '<path d="M6 2v20M12 2v20M18 2v20M3 7.5h18M3 15.5h18"/><path d="M5 5h2M11 12h2M17 19h2"/>',
    carpentry: '<path d="M3 17 16 4l4 4L7 21H3z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
    decor: '<path d="M2 5c3 5 6.5 7 10 7s7-2 10-7"/><circle cx="6" cy="11" r="1.6"/><circle cx="12" cy="13.5" r="1.6"/><circle cx="18" cy="11" r="1.6"/><path d="M6 13v4M12 15.5v5M18 13v4"/>',
    paint: '<path d="m17 2 5 5-9.5 9.5-5-5z"/><path d="M7.5 11.5c-3 0-5 2-5 5 0 2-.8 3.5-1.5 4.5 4 0 8.5-1.5 9.5-5.5"/>',
    light: '<path d="M9 18h6M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 0 0-4 11.6c.7.6 1 1.4 1 2.4h6c0-1 .3-1.8 1-2.4a6.5 6.5 0 0 0-4-11.6z"/>',
    sound: '<path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M15.5 9a4 4 0 0 1 0 6M18.5 6a8 8 0 0 1 0 12"/>',
    daker: '<path d="M3 19h18l-1.5-10-4.5 4.5L12 5l-3 8.5L4.5 9z"/><circle cx="12" cy="3" r="1"/><path d="M8 19v2M16 19v2"/>',
    bearer: '<path d="M1.5 6.5h21"/><path d="M9 6.5V3.5h6v3"/><circle cx="5.5" cy="11" r="2"/><circle cx="18.5" cy="11" r="2"/><path d="M5.5 13v8M18.5 13v8M3 16h5M16 16h5"/>',
    transport: '<path d="M1.5 5.5h12v11h-12zM13.5 9.5h5l4 4v3h-9"/><circle cx="6" cy="18.5" r="2"/><circle cx="17.5" cy="18.5" r="2"/>',
    dhak: '<ellipse cx="12" cy="9" rx="7.5" ry="3"/><path d="M4.5 9v7c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V9"/><path d="M14 4.5 19 2M16.5 6 22 4"/><path d="M8 12.5v5M16 12.5v5"/>',
    sardar: '<rect x="4.5" y="3.5" width="15" height="18" rx="2"/><path d="M9 3.5V2h6v1.5"/><path d="m8.5 12 2.5 2.5 4.5-5"/><path d="M8 18h8"/>',
    bhog: '<path d="M3 11h18c0 5.5-4 9-9 9s-9-3.5-9-9z"/><path d="M8.5 3.5c0 2 1.2 2.4 1.2 4.5M14 3.5c0 2 1.2 2.4 1.2 4.5"/><path d="M1.5 11h21"/>',
    clean: '<path d="M14.5 2 10 13"/><path d="M5.5 13h9.5l3 9H2.5z"/><path d="M8 17v5M12 17v5"/>',
    security: '<path d="M12 2.5 20 5.5v6c0 5.2-3.5 8.6-8 10-4.5-1.4-8-4.8-8-10v-6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    other: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v9M7.5 12h9"/>'
  };

  // Labels [bn, en, hi]. Keywords cover everyday words people actually say
  // (brief, section 8: "ঠাকুর বওয়া", "লাইটের কাজ", "বাঁশ বাঁধা" …).
  var TRADES = [
    { id: "idol", label: ["ঠাকুর গড়া (মৃৎশিল্পী)", "Idol making (clay artisan)", "मूर्ति बनाना (मृत्शिल्पी)"],
      short: ["প্রতিমা শিল্পী", "Idol artisan", "मूर्तिकार"],
      kw: ["ঠাকুর গড়া", "ঠাকুর গড়", "প্রতিমা", "মূর্তি গড়া", "মাটির কাজ", "মৃৎশিল্পী", "কুমোর", "পটুয়া", "মূর্তি বানানো", "idol making", "idol maker", "murti", "clay", "thakur gora", "potter", "मूर्ति बनाना", "मूर्तिकार", "मिट्टी"] },
    { id: "bamboo", label: ["বাঁশ ও মণ্ডপের কাজ", "Bamboo & pandal building", "बाँस और पंडाल का काम"],
      short: ["বাঁশের কারিগর", "Bamboo kaarigar", "बाँस कारीगर"],
      kw: ["বাঁশ", "বাশ", "মণ্ডপ", "মন্ডপ", "প্যান্ডেল", "প্যাণ্ডেল", "বাঁশ বাঁধা", "bamboo", "pandal", "bansh", "baash", "बाँस", "बांस", "पंडाल"] },
    { id: "carpentry", label: ["ছুতোরের কাজ", "Carpentry", "बढ़ई का काम"],
      short: ["ছুতোর", "Carpenter", "बढ़ई"],
      kw: ["ছুতোর", "ছুতার", "কাঠমিস্ত্রি", "কাঠের কাজ", "কাঠ", "carpenter", "carpentry", "wood", "chutor", "बढ़ई", "लकड़ी"] },
    { id: "decor", label: ["সাজসজ্জা / ডেকরেটর", "Decoration / decorator", "सजावट / डेकोरेटर"],
      short: ["সাজশিল্পী", "Decorator", "सज्जाकार"],
      kw: ["ডেকরেটর", "ডেকোরেটর", "ডেকরেশন", "সাজসজ্জা", "সাজানো", "কাপড়ের কাজ", "decorator", "decoration", "draping", "सजावट", "डेकोरेटर", "डेकोरेशन"] },
    { id: "paint", label: ["রঙের কাজ", "Painting", "रंगाई का काम"],
      short: ["রংমিস্ত্রি", "Painter", "रंगसाज़"],
      kw: ["রঙের কাজ", "রং", "রঙ", "পেন্ট", "রংমিস্ত্রি", "painting", "painter", "paint", "rong", "रंग", "पेंट"] },
    { id: "light", label: ["আলো / ইলেকট্রিকের কাজ", "Lighting / electrical", "लाइट / बिजली का काम"],
      short: ["আলোর কারিগর", "Lighting kaarigar", "लाइट कारीगर"],
      kw: ["আলো", "লাইট", "ইলেকট্রিক", "ইলেক্ট্রিক", "ইলেকট্রিশিয়ান", "বিদ্যুৎ", "electric", "electrician", "lighting", "light", "बिजली", "लाइट", "इलेक्ट्रिक"] },
    { id: "sound", label: ["সাউন্ড ও মঞ্চ", "Sound & stage", "साउंड और मंच"],
      short: ["সাউন্ড ও মঞ্চ", "Sound & stage", "साउंड और मंच"],
      kw: ["সাউন্ড", "মাইক", "মঞ্চ", "স্টেজ", "sound", "mike", "mic", "stage", "साउंड", "माइक", "मंच", "स्टेज"] },
    { id: "daker", label: ["ডাকের সাজ / শোলা / পোশাক", "Daker saaj, shola & costume", "डाकेर साज / शोला / पोशाक"],
      short: ["সাজের শিল্পী", "Shola & costume artisan", "शोला कारीगर"],
      kw: ["ডাকের সাজ", "শোলা", "সোলা", "পোশাক", "শাড়ি", "গয়না", "জরি", "shola", "costume", "daker", "शोला", "पोशाक", "गहना"] },
    { id: "bearer", label: ["ঠাকুর বওয়া (বাহক)", "Idol bearer", "मूर्ति उठाना (वाहक)"],
      short: ["প্রতিমা বাহক", "Idol bearer", "मूर्ति वाहक"],
      kw: ["ঠাকুর বওয়া", "ঠাকুর বয়", "ঠাকুর তোলা", "ঠাকুর নামানো", "মূর্তি তোলা", "বাহক", "বওয়া", "bearer", "lifter", "carrying", "thakur boya", "मूर्ति उठाना", "उठाना", "वाहक"] },
    { id: "transport", label: ["গাড়ি ও পরিবহণ", "Vehicles & transport", "गाड़ी और परिवहन"],
      short: ["পরিবহণ", "Transport", "परिवहन"],
      kw: ["গাড়ি", "লরি", "ট্রাক", "ম্যাটাডোর", "ভ্যান", "ড্রাইভার", "পরিবহণ", "পরিবহন", "driver", "truck", "lorry", "transport", "गाड़ी", "ड्राइवर", "ट्रक"] },
    { id: "dhak", label: ["ঢাকি ও বাদ্যকার", "Dhaki & musicians", "ढाकी और वादक"],
      short: ["ঢাকি", "Dhaki", "ढाकी"],
      kw: ["ঢাকি", "ঢাক", "কাঁসর", "বাজনা", "বাদ্য", "বাজাই", "dhak", "dhaki", "drum", "music", "ढाक", "ढाकी", "बाजा"] },
    { id: "sardar", label: ["সর্দার / সুপারভাইজার", "Sardar / supervisor", "सरदार / सुपरवाइज़र"],
      short: ["সর্দার", "Sardar", "सरदार"],
      kw: ["সর্দার", "সুপারভাইজার", "ঠিকাদার", "ম্যানেজার", "মিস্ত্রি প্রধান", "supervisor", "sardar", "contractor", "सरदार", "सुपरवाइजर", "ठेकेदार"] },
    { id: "bhog", label: ["ভোগ ও রান্না", "Bhog & cooking", "भोग और रसोई"],
      short: ["ভোগ ও রান্না", "Bhog & cooking", "भोग और रसोई"],
      kw: ["ভোগ", "রান্না", "রাঁধুনি", "রাধুনি", "cook", "cooking", "bhog", "रसोई", "खाना", "भोग"] },
    { id: "clean", label: ["সাফাই", "Cleaning", "सफ़ाई"],
      short: ["সাফাই কর্মী", "Cleaning", "सफ़ाई कर्मी"],
      kw: ["সাফাই", "ঝাড়ু", "পরিষ্কার", "clean", "cleaning", "safai", "सफाई", "सफ़ाई", "झाड़ू"] },
    { id: "security", label: ["নিরাপত্তা ও স্বেচ্ছাসেবক", "Security & volunteers", "सुरक्षा और स्वयंसेवक"],
      short: ["নিরাপত্তা ও সেবা", "Security & volunteer", "सुरक्षा और सेवा"],
      kw: ["নিরাপত্তা", "সিকিউরিটি", "গার্ড", "ভলান্টিয়ার", "স্বেচ্ছাসেবক", "security", "guard", "volunteer", "सुरक्षा", "गार्ड", "स्वयंसेवक"] },
    { id: "other", label: ["অন্য কাজ", "Other work", "अन्य काम"],
      short: ["কারিগর", "Kaarigar", "कारीगर"],
      kw: ["অন্য কাজ", "অন্য", "other", "अन्य"] }
  ];

  var DISTRICTS = [
    ["কলকাতা", "Kolkata", "कोलकाता"], ["হাওড়া", "Howrah", "हावड़ा"],
    ["উত্তর ২৪ পরগনা", "North 24 Parganas", "उत्तर २४ परगना"], ["দক্ষিণ ২৪ পরগনা", "South 24 Parganas", "दक्षिण २४ परगना"],
    ["হুগলি", "Hooghly", "हुगली"], ["নদিয়া", "Nadia", "नदिया"],
    ["পূর্ব বর্ধমান", "Purba Bardhaman", "पूर्व बर्धमान"], ["পশ্চিম বর্ধমান", "Paschim Bardhaman", "पश्चिम बर्धमान"],
    ["পূর্ব মেদিনীপুর", "Purba Medinipur", "पूर्व मेदिनीपुर"], ["পশ্চিম মেদিনীপুর", "Paschim Medinipur", "पश्चिम मेदिनीपुर"],
    ["বীরভূম", "Birbhum", "बीरभूम"], ["বাঁকুড়া", "Bankura", "बांकुड़ा"], ["পুরুলিয়া", "Purulia", "पुरुलिया"],
    ["ঝাড়গ্রাম", "Jhargram", "झाड़ग्राम"], ["মুর্শিদাবাদ", "Murshidabad", "मुर्शिदाबाद"], ["মালদা", "Malda", "मालदा"],
    ["উত্তর দিনাজপুর", "Uttar Dinajpur", "उत्तर दिनाजपुर"], ["দক্ষিণ দিনাজপুর", "Dakshin Dinajpur", "दक्षिण दिनाजपुर"],
    ["জলপাইগুড়ি", "Jalpaiguri", "जलपाईगुड़ी"], ["আলিপুরদুয়ার", "Alipurduar", "अलीपुरद्वार"],
    ["কোচবিহার", "Cooch Behar", "कूचबिहार"], ["দার্জিলিং", "Darjeeling", "दार्जिलिंग"], ["কালিম্পং", "Kalimpong", "कालिम्पोंग"]
  ];

  // Seed list only. The brief leaves the real Puja list open (section 14);
  // anything not matched is kept exactly as the person said it.
  var PUJAS = [
    { bn: "প্রত্যাবর্তন দুর্গাপূজা", en: "Protyabortan Durga Puja", area: ["মুনশিভেরি, সল্টলেক সেক্টর ৫", "Munshi Bheri, Salt Lake Sector V"], d: 2 },
    { bn: "সন্তোষপুর লেক পল্লী", en: "Santoshpur Lake Pally", area: ["সন্তোষপুর", "Santoshpur"], d: 0 },
    { bn: "সন্তোষ মিত্র স্কোয়ার", en: "Santosh Mitra Square", area: ["লেবুতলা, শিয়ালদহ", "Lebutala, Sealdah"], d: 0 },
    { bn: "একডালিয়া এভারগ্রিন", en: "Ekdalia Evergreen", area: ["বালিগঞ্জ", "Ballygunge"], d: 0 },
    { bn: "সুরুচি সংঘ", en: "Suruchi Sangha", area: ["নিউ আলিপুর", "New Alipore"], d: 0 },
    { bn: "শ্রীভূমি স্পোর্টিং ক্লাব", en: "Sreebhumi Sporting Club", area: ["লেক টাউন", "Lake Town"], d: 2 },
    { bn: "বাগবাজার সর্বজনীন", en: "Bagbazar Sarbojanin", area: ["বাগবাজার", "Bagbazar"], d: 0 },
    { bn: "কুমোরটুলি পার্ক", en: "Kumartuli Park", area: ["কুমোরটুলি", "Kumartuli"], d: 0 },
    { bn: "কলেজ স্কোয়ার", en: "College Square", area: ["কলেজ স্ট্রিট", "College Street"], d: 0 },
    { bn: "মহম্মদ আলি পার্ক", en: "Mohammad Ali Park", area: ["চিত্তরঞ্জন অ্যাভিনিউ", "Chittaranjan Avenue"], d: 0 },
    { bn: "টালা প্রত্যয়", en: "Tala Prattoy", area: ["টালা", "Tala"], d: 0 },
    { bn: "আহিরীটোলা সর্বজনীন", en: "Ahiritola Sarbojanin", area: ["আহিরীটোলা", "Ahiritola"], d: 0 },
    { bn: "হাতিবাগান সর্বজনীন", en: "Hatibagan Sarbojanin", area: ["হাতিবাগান", "Hatibagan"], d: 0 },
    { bn: "কাশী বোস লেন", en: "Kashi Bose Lane", area: ["উত্তর কলকাতা", "North Kolkata"], d: 0 },
    { bn: "চেতলা অগ্রণী", en: "Chetla Agrani", area: ["চেতলা", "Chetla"], d: 0 },
    { bn: "ত্রিধারা সম্মিলনী", en: "Tridhara Sammilani", area: ["রাসবিহারী", "Rashbehari"], d: 0 },
    { bn: "দেশপ্রিয় পার্ক", en: "Deshapriya Park", area: ["রাসবিহারী", "Rashbehari"], d: 0 },
    { bn: "হিন্দুস্তান পার্ক", en: "Hindustan Park", area: ["গড়িয়াহাট", "Gariahat"], d: 0 },
    { bn: "বাদামতলা আষাঢ় সংঘ", en: "Badamtala Ashar Sangha", area: ["কালীঘাট", "Kalighat"], d: 0 },
    { bn: "৬৬ পল্লী", en: "66 Pally", area: ["কালীঘাট", "Kalighat"], d: 0 },
    { bn: "শিবমন্দির", en: "Shib Mandir", area: ["লেক মার্কেট", "Lake Market"], d: 0 },
    { bn: "যোধপুর পার্ক", en: "Jodhpur Park", area: ["যোধপুর পার্ক", "Jodhpur Park"], d: 0 },
    { bn: "বেহালা নতুন দল", en: "Behala Notun Dal", area: ["বেহালা", "Behala"], d: 0 },
    { bn: "নাকতলা উদয়ন সংঘ", en: "Naktala Udayan Sangha", area: ["নাকতলা", "Naktala"], d: 0 },
    { bn: "দমদম পার্ক ভারতচক্র", en: "Dum Dum Park Bharat Chakra", area: ["দমদম পার্ক", "Dum Dum Park"], d: 2 }
  ];

  var BN_DIGITS = "০১২৩৪৫৬৭৮৯";
  var HI_DIGITS = "०१२३४५६७८९";

  function toAscii(s) {
    return String(s == null ? "" : s).replace(/[০-৯०-९]/g, function (ch) {
      var i = BN_DIGITS.indexOf(ch);
      return String(i >= 0 ? i : HI_DIGITS.indexOf(ch));
    });
  }
  function toBn(s) {
    return String(s).replace(/\d/g, function (d) { return BN_DIGITS[+d]; });
  }
  function toHi(s) {
    return String(s).replace(/\d/g, function (d) { return HI_DIGITS[+d]; });
  }
  function localDigits(s, lang) {
    return lang === "bn" ? toBn(s) : lang === "hi" ? toHi(s) : String(s);
  }
  function fold(s) {
    return String(s || "").toLowerCase().replace(/[।,.!?'"“”‘’\-]/g, " ").replace(/\s+/g, " ").trim();
  }

  // Spoken digit words in Bangla, Hindi and English. "ডাবল/ট্রিপল" repeat the next digit.
  var WORDS = {
    0: ["শূন্য", "শুন্য", "জিরো", "zero", "oh", "शून्य", "ज़ीरो", "जीरो"],
    1: ["এক", "ওয়ান", "one", "एक", "वन"],
    2: ["দুই", "দুই", "দু", "টু", "two", "दो", "टू"],
    3: ["তিন", "থ্রি", "three", "तीन", "थ्री"],
    4: ["চার", "ফোর", "four", "चार", "फोर"],
    5: ["পাঁচ", "পাচ", "ফাইভ", "five", "पाँच", "पांच", "फाइव"],
    6: ["ছয়", "ছয়", "ছ", "ছয়", "সিক্স", "six", "छह", "छः", "छे", "सिक्स"],
    7: ["সাত", "সেভেন", "seven", "सात", "सेवन"],
    8: ["আট", "এইট", "eight", "आठ", "एट"],
    9: ["নয়", "নয়", "নাইন", "nine", "नौ", "नाइन"]
  };
  var WORD_TO_DIGIT = {};
  Object.keys(WORDS).forEach(function (d) {
    WORDS[d].forEach(function (w) { WORD_TO_DIGIT[w.toLowerCase()] = d; });
  });

  function parseMobile(text) {
    var s = toAscii(text).toLowerCase();
    var out = "";
    var repeat = 1;
    s.split(/[\s,.\-]+/).forEach(function (tok) {
      if (!tok) return;
      if (/^(ডাবল|ডবল|double|डबल)$/.test(tok)) { repeat = 2; return; }
      if (/^(ট্রিপল|triple|ट्रिपल)$/.test(tok)) { repeat = 3; return; }
      var digits = tok.replace(/\D/g, "");
      var piece = digits || WORD_TO_DIGIT[tok] || "";
      if (!piece) return;
      if (repeat > 1 && piece.length === 1) piece = new Array(repeat + 1).join(piece);
      repeat = 1;
      out += piece;
    });
    if (out.length === 12 && out.indexOf("91") === 0) out = out.slice(2);
    if (out.length === 11 && out.charAt(0) === "0") out = out.slice(1);
    return out;
  }
  function validMobile(d) { return /^[6-9]\d{9}$/.test(d); }
  function groupMobile(d, lang) {
    var g = d.length === 10 ? d.slice(0, 5) + " " + d.slice(5) : d;
    return localDigits(g, lang);
  }

  // Longest keyword wins, so "ঠাকুর বওয়া" beats "ঠাকুর গড়া" fragments.
  function matchTrades(text) {
    var t = fold(text);
    var hits = [];
    TRADES.forEach(function (tr) {
      var best = 0;
      tr.kw.forEach(function (k) {
        var kk = fold(k);
        if (kk && t.indexOf(kk) >= 0 && kk.length > best) best = kk.length;
      });
      if (best) hits.push({ id: tr.id, score: best });
    });
    // Drop a weaker trade when its keyword sits inside a stronger match's keyword
    // ("ঠাকুর বওয়া" should not also add "প্রতিমা" via "ঠাকুর").
    hits.sort(function (a, b) { return b.score - a.score; });
    return hits.map(function (h) { return h.id; }).filter(function (id) { return id !== "other" || hits.length === 1; });
  }

  function matchPuja(text) {
    var t = fold(text);
    if (!t) return null;
    var best = null;
    var bestScore = 0;
    PUJAS.forEach(function (p) {
      var names = [p.bn, p.en, p.area[0], p.area[1]];
      var score = 0;
      names.forEach(function (n, i) {
        var f = fold(n);
        if (!f) return;
        if (t.indexOf(f) >= 0 || f.indexOf(t) >= 0) score = Math.max(score, i < 2 ? 10 : 4);
        var words = f.split(" ").filter(function (w) { return w.length > 2; });
        var common = words.filter(function (w) { return t.indexOf(w) >= 0; }).length;
        if (words.length) score = Math.max(score, Math.round((common / words.length) * (i < 2 ? 8 : 3)));
      });
      if (score > bestScore) { bestScore = score; best = p; }
    });
    return bestScore >= 5 ? best : null;
  }

  function searchPujas(text, limit) {
    var t = fold(text);
    if (!t) return PUJAS.slice(0, limit || 6);
    return PUJAS.filter(function (p) {
      return [p.bn, p.en, p.area[0], p.area[1]].some(function (n) { return fold(n).indexOf(t) >= 0; });
    }).slice(0, limit || 6);
  }

  function matchDistrict(text) {
    var t = fold(text);
    for (var i = 0; i < DISTRICTS.length; i += 1) {
      for (var j = 0; j < 3; j += 1) {
        if (t.indexOf(fold(DISTRICTS[i][j])) >= 0) return i;
      }
    }
    if (/24|২৪|२४/.test(toAscii(t))) return /দক্ষিণ|south|दक्षिण/.test(t) ? 3 : 2;
    return -1;
  }

  // "Yes" / "no" across the three languages.
  function yesNo(text) {
    var t = fold(text);
    if (/(^| )(হ্যাঁ|হ্যা|হাঁ|হা|ঠিক|ঠিক আছে|সব ঠিক|রাজি|আচ্ছা|হুঁ|হুম|yes|yeah|yep|ok|okay|correct|right|हाँ|हां|हा|ठीक|सही|जी)( |$)/.test(t)) return "yes";
    if (/(^| )(না|নাহ|ভুল|নেই|no|nope|wrong|नहीं|नही|ना|गलत)( |$)/.test(t)) return "no";
    return null;
  }

  function digitWordsBn(d) {
    var n = ["শূন্য", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়"];
    return d.split("").map(function (c) { return n[+c]; }).join(" ");
  }

  BKS.data = {
    ICON: ICON, TRADES: TRADES, DISTRICTS: DISTRICTS, PUJAS: PUJAS,
    toAscii: toAscii, toBn: toBn, localDigits: localDigits, fold: fold,
    parseMobile: parseMobile, validMobile: validMobile, groupMobile: groupMobile,
    matchTrades: matchTrades, matchPuja: matchPuja, searchPujas: searchPujas,
    matchDistrict: matchDistrict, yesNo: yesNo, digitWordsBn: digitWordsBn,
    trade: function (id) { return TRADES.filter(function (t) { return t.id === id; })[0]; },
    icon: function (id, cls) {
      return '<svg class="' + (cls || "ico") + '" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICON[id] || ICON.other) + "</svg>";
    }
  };
})(window.BKS = window.BKS || {});
