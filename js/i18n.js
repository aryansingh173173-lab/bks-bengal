/* Strings as [bn, en, hi]. Bangla is written first and is the default. */
(function (BKS) {
  "use strict";
  var LANGS = ["bn", "en", "hi"];
  var S = {
    "lang.label": ["ভাষা", "Language", "भाषा"],
    "nav.help": ["সাহায্য", "Need help", "मदद चाहिए"],
    "nav.home": ["প্রথম পাতা", "Home", "मुख्य पन्ना"],
    "nav.event": ["অনুষ্ঠান", "Event", "कार्यक्रम"],
    "tagline": ["শিকড় • সম্ভাবনা • সমৃদ্ধি", "Roots • Possibility • Prosperity", "जड़ें • संभावना • समृद्धि"],

    "hero.welcome": ["সাদর আমন্ত্রণ", "A warm invitation", "सादर आमंत्रण"],
    "hero.line": ["আপনার হাতেই মা আসেন। এবার আপনাকে বরণ করার পালা।", "Maa arrives through your hands. Now we want to honour you.", "आपके हाथों से ही माँ आती हैं। अब हम आपका सम्मान करना चाहते हैं।"],
    "hero.for": ["এবারের দুর্গাপুজোয় যাঁরা খেটেছেন, সেই সব কারিগরের জন্য", "For every kaarigar who worked on a Durga Puja in 2026", "दुर्गा पूजा २०२६ में काम करने वाले हर कारीगर के लिए"],
    "cta.voice": ["মুখে বলে নাম লেখান", "Register by speaking", "बोलकर नाम लिखवाएँ"],
    "cta.text": ["লিখে নাম দেব", "I'll type instead", "लिखकर करूँगा"],
    "cta.crew": ["সর্দার? গোটা দলের নাম দিন", "I'm a sardar: register my crew", "सरदार हूँ: टीम के नाम दूँगा"],
    "cta.meta": ["মাত্র দু'মিনিট · ছ'টা প্রশ্ন · কোনও খরচ নেই", "2 minutes · 6 questions · completely free", "२ मिनट · ६ सवाल · पूरी तरह मुफ़्त"],
    "cta.sticky": ["নাম লেখান", "Register", "नाम लिखवाएँ"],
    "anthem.play": ["সম্মিলনীর গানটা শুনুন", "Hear the Sammelan anthem", "सम्मेलन का गीत सुनें"],
    "anthem.title": ["সম্মিলনীর গান", "The Sammelan anthem", "सम्मेलन का गीत"],

    "why.kicker": ["কেন এই সম্মান", "Why this honour", "यह सम्मान क्यों"],
    "why.title": ["মণ্ডপে আলো জ্বললেই যাঁরা আড়ালে সরে যান, আসল কৃতিত্ব তাঁদেরই", "The real heroes are the ones who fade from view once the Puja opens", "पूजा शुरू होते ही जो नज़रों से ओझल हो जाते हैं, वही असली नायक हैं"],
    "why.body": ["মহাচার্য শ্রী সৌরভ জে. সরকার আর পশ্চিমবঙ্গ সরকারের মন্ত্রী শ্রী দিলীপ ঘোষ এবারের পুজোর কারিগরদের সপরিবারে ডেকে, সবার সামনে সম্মান জানাবেন। এখানে কোনও তারকা অতিথি নেই — মঞ্চের মধ্যমণি আপনারাই, আমাদের কারিগর দাদারা।", "Mahacharya Shri Sourabh J. Sarkar and Shri Dilip Ghosh, Minister in the Government of West Bengal, want to honour this year's Puja kaarigars publicly, with their families. No celebrity chief guest: the Kaarigar Dadas are the heart of this event.", "महाचार्य श्री सौरभ जे. सरकार और पश्चिम बंगाल सरकार के मंत्री श्री दिलीप घोष इस बार की पूजा के कारीगरों का उनके परिवार के साथ सार्वजनिक सम्मान करना चाहते हैं। कोई सेलिब्रिटी मुख्य अतिथि नहीं — कारीगर दादा ही इस कार्यक्रम के केंद्र हैं।"],
    "why.reel": ["মহাচার্যজির কথা শুনুন", "Hear Mahacharyaji explain", "महाचार्यजी की बात सुनें"],
    "why.stat1": ["লক্ষ", "Lakhs", "लाखों"],
    "why.stat1b": ["হাতে গড়ে ওঠে বাংলার পুজো", "of hands build Bengal's Puja", "हाथ बनाते हैं बंगाल की पूजा"],
    "why.stat2b": ["রকম কাজ, নিমন্ত্রণ সবার", "kinds of work, every one invited", "तरह के काम — हर एक को न्योता"],
    "why.stat3b": ["মিনিটেই নাম লেখা শেষ", "minutes to register", "मिनट में नाम दर्ज"],
    "media.tapNote": ["ছুঁলে তবেই চালু হবে", "Plays only when you tap", "टैप करने पर ही चलेगा"],
    "media.insta": ["Instagram-এ দেখুন", "Watch on Instagram", "Instagram पर देखें"],
    "media.yt": ["YouTube-এ দেখুন", "Watch on YouTube", "YouTube पर देखें"],
    "media.close": ["বন্ধ করুন", "Close", "बंद करें"],

    "trades.kicker": ["যাঁদের হাতে গড়ে ওঠে পুজো", "The hands that build the Puja", "जिनके हाथों से बनती है पूजा"],
    "trades.title": ["লক্ষ হাতে গড়া পুজো, নিমন্ত্রণ সবার", "Lakhs of hands. An invitation for each one.", "लाखों हाथों का काम, हर एक को निमंत्रण"],
    "trades.body": ["ঠাকুর গড়া থেকে ঢাক বাজানো, বাঁশ বাঁধা থেকে ভোগ রান্না — পুজোয় যে কাজই করে থাকুন, এই সম্মান আপনারও। নিজের কাজটা ছুঁয়ে নাম লেখান।", "From shaping the idol to playing the dhak: whatever your work, there is a place for you.", "मूर्ति गढ़ने से ढाक बजाने तक — जो भी काम किया हो, इस सम्मान में आपकी जगह है।"],

    "story.kicker": ["মাটি থেকে মণ্ডপ", "From earth to pandal", "मिट्टी से मंडप तक"],
    "story.title": ["একটা পুজো, তিন সপ্তাহ, অগণিত হাত", "One Puja, three weeks, countless hands", "एक पूजा, तीन हफ़्ते, अनगिनत हाथ"],
    "story.body": ["প্রত্যাবর্তন পুজোর মণ্ডপ কীভাবে মাথা তুলল — ২১ সেপ্টেম্বরের প্রথম বাঁশ থেকে আলো-ঝলমল রাত পর্যন্ত।", "How the Protyabortan pandal rose: from the first bamboo on 21 September to the night the lights came on.", "प्रत्यावर्तन पूजा का मंडप कैसे बना — २१ सितम्बर के पहले बाँस से रोशनी वाली रात तक।"],
    "story.hint": ["আঙুল দিয়ে পাশে সরান →", "Swipe →", "आगे सरकाएँ →"],
    "p01": ["২১ সেপ্টেম্বর · প্রথম বাঁশ", "21 Sep · The first bamboo", "२१ सितम्बर · पहला बाँस"],
    "p02": ["২৪ সেপ্টেম্বর · পুকুরপাড়ে কাঠামো", "24 Sep · The frame by the pond", "२४ सितम्बर · तालाब किनारे ढाँचा"],
    "p03": ["২৮ সেপ্টেম্বর · রাত জেগে খুঁটি পোঁতা", "28 Sep · Raising poles at night", "२८ सितम्बर · रात में भी खंभे उठाना"],
    "p04": ["২৮ সেপ্টেম্বর · আলোর নিচে কাঠামো", "28 Sep · The frame under the lamps", "२८ सितम्बर · रोशनी में ढाँचा"],
    "p05": ["৭ অক্টোবর · জলের ধারে ছাউনি", "7 Oct · A shelter at the water", "७ अक्टूबर · पानी किनारे छप्पर"],
    "p06": ["৭ অক্টোবর · বাঁশের রেলিং", "7 Oct · Bamboo railings", "७ अक्टूबर · बाँस की रेलिंग"],
    "p07": ["৮ অক্টোবর · হাঁটাপথ আর কুঁড়েঘর", "8 Oct · Walkway and hut", "८ अक्टूबर · रास्ता और झोपड़ी"],
    "p08": ["সাজের কাজ চলছে", "Decoration work", "सजावट का काम"],
    "p09": ["তৈরি মণ্ডপ, রাতের আলোয়", "The finished pandal at night", "पूरा मंडप, रात में"],
    "p10": ["প্রতিমা, ২০২৫", "The pratima, 2025", "प्रतिमा, २०२५"],

    "how.kicker": ["কীভাবে নাম লেখাবেন", "How to register", "नाम कैसे लिखवाएँ"],
    "how.title": ["মাত্র দু'মিনিট, শুধু মুখে বলুন", "Two minutes. Just talk.", "दो मिनट। बस बोलिए।"],
    "how.s1t": ["বলুন", "Speak", "बोलिए"],
    "how.s1": ["কারিগর সাথী বাংলায় ছ'টা প্রশ্ন করবে। মুখে উত্তর দিন, চাইলে বোতাম টিপেও দিতে পারেন।", "Kaarigar Saathi asks six questions in Bangla. Answer by speaking, or tap a button.", "कारीगर साथी छह सवाल पूछेगा। जवाब बोलकर दें, या बटन दबाएँ।"],
    "how.s2t": ["মিলিয়ে নিন", "Check", "मिलान करें"],
    "how.s2": ["যা শুনল, লিখে দেখাবে। ঠিক হলে বলুন 'হ্যাঁ', ভুল হলে 'না'।", "It shows what it heard. Say 'yes' if it's right, 'no' if not.", "जो सुना, लिखकर दिखाएगा। सही हो तो 'हाँ', गलत हो तो 'नहीं'।"],
    "how.s3t": ["নিমন্ত্রণপত্র হাতে নিন", "Get your card", "निमंत्रण पत्र लें"],
    "how.s3": ["আপনার নামে নিমন্ত্রণপত্র তৈরি হয়ে যাবে। সেভ করে রাখুন, হোয়াটসঅ্যাপে সবাইকে পাঠান।", "A personal invitation card in your name. Save it, send it on WhatsApp.", "आपके नाम का निमंत्रण पत्र बनेगा। सेव करें, व्हाट्सऐप पर भेजें।"],
    "demo.q": ["এবারের পুজোয় আপনি কী কাজ করেছেন?", "What work did you do for this year's Puja?", "इस बार की पूजा में आपने क्या काम किया?"],
    "demo.a": ["ঠাকুর বওয়ার কাজ করেছি", "I carried the idol", "मूर्ति उठाने का काम किया"],

    "slip.title": ["আপনার স্লিপ", "Registration slip", "पंजीकरण पर्ची"],
    "f.name": ["নাম", "Name", "नाम"],
    "f.mobile": ["মোবাইল", "Mobile", "मोबाइल"],
    "f.trade": ["কাজ", "Work", "काम"],
    "f.puja": ["পুজো", "Puja", "पूजा"],
    "f.place": ["পুজোর এলাকা", "Puja ground", "प्रांगण"],
    "f.sardar": ["সর্দার", "Sardar", "सरदार"],
    "f.family": ["সঙ্গে ক'জন", "Family coming", "साथ आएँगे"],
    "demo.name": ["হারেন মণ্ডল", "Haren Mondal", "हारेन मंडल"],
    "demo.trade": ["ঠাকুর বওয়া", "Idol bearer", "मूर्ति वाहक"],
    "demo.puja": ["সন্তোষপুর লেক পল্লী", "Santoshpur Lake Pally", "संतोषपुर लेक पल्ली"],
    "demo.place": ["সন্তোষপুর, কলকাতা", "Santoshpur, Kolkata", "संतोषपुर, कोलकाता"],
    "demo.sardar": ["সুনীল দাস", "Sunil Das", "सुनील दास"],
    "demo.family": ["২ জন", "2 people", "२ लोग"],

    "film.kicker": ["কারিগরদের গল্প", "Kaarigar stories", "कारीगरों की कहानी"],
    "film.title": ["যাঁদের হাতে গড়ে ওঠে পুজো", "The hands that build the Puja", "जिनके हाथों से बनती है पूजा"],
    "film.body": ["প্রত্যাবর্তন মণ্ডপের কারিগরদের মুখে তাঁদের জীবনের কথা, কাজের টান আর স্বপ্নের গল্প।", "The lives and inspiration of the kaarigars: conversations with the kaarigars of the Protyabortan pandal.", "उन कारीगरों के जीवन की कहानी और प्रेरणा — प्रत्यावर्तन मंडप के कारीगरों से बातचीत।"],
    "film.play": ["ছবিটা দেখুন", "Watch the film", "फ़िल्म देखें"],
    "film.credit": ["ধর্ম সংস্থাপনের পালা", "Dharma Sansthapaner Pala", "धर्म संस्थापनेर पाला"],

    "dedi.kicker": ["উৎসর্গ", "Dedicated to", "समर्पण"],
    "dedi.title": ["নিষ্ঠা দিয়ে যাঁরা পুজো গড়েছেন, তাঁদের প্রত্যেককে", "Everyone who gave their work with devotion", "जिन्होंने निष्ठा से काम किया, उन सबके लिए"],
    "dedi.body": ["নিমন্ত্রণপত্রে নাম ছাপা হয়েছে কয়েকজনের, কিন্তু সম্মান সবার। যিনি বাঁশ বেঁধেছেন, যিনি আলো জ্বেলেছেন, যিনি ঠাকুর কাঁধে তুলেছেন — প্রত্যেকের।", "A few names are printed on the invitation. The honour belongs to all: whoever tied the bamboo, lit the lamps, or carried Maa on their shoulders.", "निमंत्रण पत्र पर कुछ ही नाम छपे हैं — सम्मान सबका है। जिसने बाँस बाँधा, जिसने रोशनी जलाई, जिसने मूर्ति कंधे पर उठाई।"],

    "event.kicker": ["অনুষ্ঠান", "The event", "कार्यक्रम"],
    "event.date": ["তারিখ", "Date", "तारीख"],
    "event.time": ["সময়", "Time", "समय"],
    "event.venue": ["স্থান", "Venue", "स्थान"],
    "event.more": ["অনুষ্ঠানের সব খুঁটিনাটি", "All event details", "कार्यक्रम की पूरी जानकारी"],
    "event.family": ["পরিবারকে সঙ্গে নিয়ে আসুন", "Bring your family", "परिवार के साथ आइए"],
    "event.countdown": ["অনুষ্ঠানের আর বাকি", "To go", "बाकी"],
    "cd.d": ["দিন", "days", "दिन"],
    "cd.h": ["ঘণ্টা", "hours", "घंटे"],
    "cd.m": ["মিনিট", "min", "मिनट"],
    "org.title": ["আয়োজনে", "Jointly organised by", "आयोजक"],
    "footer.free": ["নাম লেখাতে এক পয়সাও লাগে না। কেউ টাকা চাইলে দেবেন না।", "Registration is completely free. Never pay anyone for it.", "नाम लिखवाना पूरी तरह मुफ़्त है। कोई पैसे माँगे तो न दें।"],
    "footer.privacy": ["আপনার তথ্য কাজে লাগবে শুধু এই অনুষ্ঠানের নিমন্ত্রণ আর কারিগরদের তালিকা তৈরিতে। আধার কার্ড বা ব্যাংকের কোনও তথ্য আমরা কখনও চাইব না।", "Your details are used only for this event's invitation and the kaarigar list. We never ask for Aadhaar or bank details.", "आपकी जानकारी सिर्फ़ इस कार्यक्रम के निमंत्रण और कारीगरों की सूची के लिए है। आधार या बैंक की जानकारी कभी नहीं माँगी जाएगी।"],
    "footer.credit": ["ভিডিও ও গান: @dharmsansthapan। ছবি: প্রত্যাবর্তন দুর্গাপূজা।", "Video and anthem: @dharmsansthapan. Photographs: Protyabortan Durga Puja.", "वीडियो और गीत: @dharmsansthapan। तस्वीरें: प्रत्यावर्तन दुर्गा पूजा।"],

    "help.title": ["সাহায্য লাগবে?", "Need help?", "मदद चाहिए?"],
    "help.body": ["নিচের যেকোনও নম্বরে ফোন করুন — আমাদের লোক আপনার হয়ে নাম লিখে দেবেন। এতক্ষণ যা বলেছেন, এই ফোনেই রাখা থাকবে।", "Call one of these numbers and someone from our team will register you. Your answers so far stay saved on this phone.", "नीचे के नंबर पर फ़ोन करें, हमारी टीम आपका नाम लिख देगी। आपके जवाब इसी फ़ोन में सहेजे रहेंगे।"],
    "help.call": ["ফোন করুন", "Call", "फ़ोन करें"],
    "help.free": ["নাম লেখাতে কোনও খরচ নেই। কেউ টাকা চাইলে দেবেন না।", "Registration is free. Never pay anyone.", "नाम लिखवाना मुफ़्त है। कोई पैसे माँगे तो न दें।"],

    /* Voice guide */
    "g.intro": ["নমস্কার! আমি কারিগর সাথী। এবারের পুজো যাঁদের হাতে গড়ে উঠেছে, আমরা তাঁদের সম্মান জানাতে চাই। আপনার নামটা লিখে নিই? মিনিট দুয়েক লাগবে।", "Namaskar! I am Kaarigar Saathi. We want to honour the people whose hands built this year's Puja. Shall I write down your name? It takes two minutes.", "नमस्कार! मैं कारीगर साथी हूँ। इस बार की पूजा जिनके हाथों से बनी, हम उनका सम्मान करना चाहते हैं। आपका नाम लिख लूँ? दो मिनट लगेंगे।"],
    "g.consent": ["আপনার তথ্য শুধু এই অনুষ্ঠানের নিমন্ত্রণ আর কারিগরদের তালিকার কাজে লাগবে। রাজি থাকলে \"হ্যাঁ\" বলুন।", "Your details will be kept only for this event's invitation and the list of kaarigars. If you agree, say \"yes\".", "आपकी जानकारी सिर्फ़ इस कार्यक्रम के निमंत्रण और कारीगरों की सूची के लिए रखी जाएगी। सहमत हों तो \"हाँ\" कहिए।"],
    "g.consentMore": ["আমরা লিখে রাখব: নাম, মোবাইল, কী কাজ করেছেন, কোন পুজোয়, পুজোটা কোথায়, সর্দারের নাম আর সঙ্গে ক'জন আসবেন। আধার, ব্যাংক, জাত, ধর্ম বা রাজনীতি নিয়ে কোনও প্রশ্ন করা হবে না। ছবি দিতে চাইলে দেবেন, না দিলেও চলবে। নাম লেখাতে এক পয়সাও লাগে না।", "We keep: name, mobile, work, Puja, Puja ground, sardar's name and how many will come. We will never ask for Aadhaar, bank details, caste, religion or politics. A photo is optional. Registration is completely free.", "हम रखेंगे: नाम, मोबाइल, काम, पूजा, प्रांगण, सरदार का नाम और कितने लोग आएँगे। आधार, बैंक, जाति, धर्म या राजनीति के बारे में कभी नहीं पूछा जाएगा। तस्वीर देना ज़रूरी नहीं। नाम लिखवाना पूरी तरह मुफ़्त है।"],
    "g.name": ["আপনার পুরো নামটা বলুন।", "Please tell me your full name.", "अपना पूरा नाम बताइए।"],
    "g.check": ["লিখে নিলাম: {v}। ঠিক তো?", "I wrote: {v}. Is that right?", "लिखा: {v}। ठीक है?"],
    "g.mobile": ["আপনার মোবাইল নম্বরটা একটু ধীরে ধীরে বলুন।", "Please say your mobile number, slowly.", "अपना मोबाइल नंबर बताइए, धीरे-धीरे।"],
    "g.mobileCheck": ["নম্বরটা {v}। ঠিক তো?", "The number is {v}. Is that right?", "नंबर है {v}। ठीक है?"],
    "g.mobileBad": ["পুরো নম্বরটা ধরতে পারলাম না। দশটা সংখ্যা আরেকবার বলুন, নয়তো টাইপ করে দিন।", "I didn't get the whole number. Please say all ten digits again, or type it.", "पूरा नंबर नहीं मिला। दसों अंक फिर से बोलिए, या टाइप कीजिए।"],
    "g.trade": ["এবারের পুজোয় আপনি কী কাজ করেছেন? যেমন — ঠাকুর গড়া, বাঁশ বাঁধা, আলোর কাজ, ঠাকুর বওয়া।", "What work did you do for this year's Puja? For example idol making, bamboo work, lighting, carrying the idol.", "इस बार की पूजा में आपने क्या काम किया? जैसे मूर्ति बनाना, बाँस का काम, लाइट का काम, मूर्ति उठाना।"],
    "g.tradeCheck": ["লিখে নিলাম: {v}। আর কোনও কাজ করে থাকলে সেটাও বেছে নিন, নয়তো \"হয়ে গেছে\" বলুন।", "I noted: {v}. Pick any other work you did too, or say \"done\".", "लिखा: {v}। और कोई काम किया हो तो वो भी चुनिए, नहीं तो \"हो गया\" कहिए।"],
    "g.puja": ["কোন পুজোয় কাজ করেছেন? ক্লাব বা কমিটির নাম আর পাড়ার নামটা বলুন।", "Which Puja did you work on? Tell me the club or committee name and the neighbourhood.", "किस पूजा में काम किया? क्लब या पूजा कमेटी का नाम और मोहल्ला बताइए।"],
    "g.pujaCheck": ["{v} — এই পুজোটাই তো?", "{v}, is that right?", "{v} की पूजा, है ना?"],
    "g.pujaMore": ["আর কোনও পুজোতেও কাজ করেছেন?", "Did you work on any other Puja?", "किसी और पूजा में भी काम किया?"],
    "g.place": ["পুজোটা কোথায় হয়েছে? পাড়া আর জেলার নাম বললেই চলবে।", "Where is the Puja ground? The area and district are enough.", "पूजा का प्रांगण कहाँ है? इलाका और ज़िला बताना काफ़ी है।"],
    "g.placePrefilled": ["পুজোর জায়গা লিখে রেখেছি: {v}। ঠিক তো?", "I have the Puja ground as: {v}. Is that right?", "प्रांगण लिखा है: {v}। ठीक है?"],
    "g.sardar": ["আপনার সর্দার বা সুপারভাইজারের নাম কী? ওঁর ফোন নম্বর জানা থাকলে সেটাও বলুন।", "What is your sardar or supervisor's name? Tell me their phone number too, if you know it.", "आपके सरदार या सुपरवाइज़र का नाम क्या है? फ़ोन नंबर पता हो तो वो भी बताइए।"],
    "g.family": ["অনুষ্ঠানে আপনার সঙ্গে বাড়ির ক'জন আসবেন?", "How many of your family will come with you to the event?", "कार्यक्रम में आपके साथ घर के कितने लोग आएँगे?"],
    "g.confirm": ["একবার সবটা মিলিয়ে নিই। সব ঠিক থাকলে \"হ্যাঁ\" বলুন। কোথাও ভুল থাকলে সেই লাইনটা ছুঁয়ে ঠিক করে দিন।", "Let me read it back once. If everything is right, say \"yes\". If something is wrong, tap that line to fix it.", "एक बार मिला लेते हैं। सब ठीक हो तो \"हाँ\" कहिए। कुछ गलत हो तो उस लाइन को छूकर ठीक कीजिए।"],
    "g.done": ["অভিনন্দন! আপনার নিমন্ত্রণপত্র তৈরি। ছবিটা সেভ করে রাখুন, হোয়াটসঅ্যাপে সবাইকে পাঠান। অনুষ্ঠানে দেখা হচ্ছে!", "Congratulations! Your invitation card is ready. Save it and send it on WhatsApp. See you at the event.", "बधाई हो! आपका निमंत्रण पत्र तैयार है। इसे सेव कीजिए, व्हाट्सऐप पर भेजिए। कार्यक्रम में मिलते हैं।"],
    "g.silence": ["ঠিক শুনতে পেলাম না। আরেকবার বলবেন? নিচের বোতাম টিপেও উত্তর দিতে পারেন।", "I couldn't hear that. Could you say it once more? You can also tap a button below.", "सुन नहीं पाया। एक बार और बोलेंगे? नीचे का बटन भी दबा सकते हैं।"],
    "g.failed": ["কোনও চিন্তা নেই। লিখে দিন, নয়তো সাহায্যের জন্য ফোন করুন।", "No problem. You can type it instead, or ask for help.", "कोई बात नहीं। अब लिखकर दीजिए, या मदद माँगिए।"],
    "g.noVoice": ["এই ফোনে কথা শোনার ব্যবস্থা নেই। লিখে বা বোতাম টিপে উত্তর দিন।", "This phone can't listen here. Answer by typing or tapping.", "इस फ़ोन में सुनने की सुविधा नहीं है। लिखकर या बटन दबाकर जवाब दीजिए।"],
    "g.money": ["নাম লেখাতে এক পয়সাও লাগে না। কেউ টাকা চাইলে দেবেন না।", "Registration is completely free. Nobody should ask you for money.", "नाम लिखवाना पूरी तरह मुफ़्त है। कोई पैसे माँगे तो न दें।"],
    "g.saathi": ["কারিগর সাথী", "Kaarigar Saathi", "कारीगर साथी"],

    "c.start": ["হ্যাঁ, শুরু করুন", "Yes, let's start", "हाँ, शुरू करें"],
    "c.type": ["লিখে দেব", "I'll type", "लिखकर करूँगा"],
    "c.agree": ["হ্যাঁ, রাজি", "Yes, I agree", "हाँ, सहमत हूँ"],
    "c.more": ["আরেকটু জানতে চাই", "Tell me more", "और जानना है"],
    "c.yes": ["হ্যাঁ", "Yes", "हाँ"],
    "c.no": ["না", "No", "नहीं"],
    "c.typeNumber": ["নম্বর টাইপ করে দেব", "I'll type the number", "नंबर टाइप करूँगा"],
    "c.done": ["হয়ে গেছে", "Done", "हो गया"],
    "c.dontKnow": ["জানি না", "I don't know", "पता नहीं"],
    "c.iAmSardar": ["আমিই সর্দার", "I am the sardar", "मैं ही सरदार हूँ"],
    "c.alone": ["আমি একাই আসব", "Just me", "अकेले"],
    "c.allRight": ["হ্যাঁ, সব ঠিক আছে", "Yes, all correct", "हाँ, सब ठीक"],
    "c.otherPuja": ["আরও একটা পুজো", "Another Puja", "एक और पूजा"],
    "c.noMore": ["আর নেই", "No more", "और नहीं"],

    "mic.tap": ["মাইকে ছুঁয়ে কথা বলুন", "Tap the mic to speak", "बोलने के लिए माइक छुएँ"],
    "mic.listening": ["শুনছি…", "Listening…", "सुन रहा हूँ…"],
    "mic.speaking": ["বলছি… থামাতে চাইলে ছুঁয়ে দিন", "Speaking… tap to interrupt", "बोल रहा हूँ… रोकने के लिए छुएँ"],
    "mic.off": ["মাইক বন্ধ", "Voice off", "आवाज़ बंद"],
    "heard": ["শুনলাম", "I heard", "सुना"],
    "q.of": ["প্রশ্ন {n} / ৬", "Question {n} of 6", "सवाल {n} / ६"],
    "btn.next": ["পরের ধাপে", "Continue", "आगे बढ़ें"],
    "btn.back": ["পিছনে", "Back", "पीछे"],
    "btn.edit": ["বদলান", "Edit", "ठीक करें"],
    "btn.keyboard": ["লিখে দেব", "Type it", "लिखकर दूँगा"],
    "btn.voice": ["মুখে বলব", "Say it", "बोलकर दूँगा"],
    "btn.ok": ["ঠিক আছে", "OK", "ठीक है"],
    "ph.name": ["যেমন: হারেন মণ্ডল", "e.g. Haren Mondal", "जैसे: हारेन मंडल"],
    "ph.mobile": ["১০ সংখ্যার মোবাইল নম্বর", "10-digit mobile number", "१० अंकों का मोबाइल नंबर"],
    "ph.puja": ["ক্লাব বা কমিটির নাম, পাড়া", "Club or committee name, area", "क्लब या कमेटी का नाम, मोहल्ला"],
    "ph.area": ["পাড়া বা এলাকা", "Area or neighbourhood", "इलाका या मोहल्ला"],
    "ph.district": ["জেলা বেছে নিন", "Choose district", "ज़िला चुनें"],
    "ph.sardar": ["সর্দারের নাম", "Sardar's name", "सरदार का नाम"],
    "ph.sardarMobile": ["সর্দারের মোবাইল (জানা থাকলে)", "Sardar's mobile (if known)", "सरदार का मोबाइल (पता हो तो)"],
    "ph.family": ["ক'জন", "How many", "कितने"],
    "pujaList": ["নিচের তালিকা থেকে বাছুন, না পেলে নিজেই লিখে দিন", "Pick from the list, or write it your own way", "सूची से चुनें, या अपने शब्दों में लिखें"],
    "pujaAdded": ["যোগ হল", "Added", "जुड़ गया"],
    "family.n": ["{n} জন", "{n}", "{n} लोग"],
    "family.alone": ["একা", "Just me", "अकेले"],
    "sardar.self": ["নিজেই সর্দার", "Self (sardar)", "स्वयं सरदार"],
    "sardar.unknown": ["জানা নেই", "Not known", "पता नहीं"],
    "preview.banner": ["পরীক্ষামূলক সংস্করণ: নাম এখনও কোথাও জমা পড়ছে না, শুধু এই ফোনেই থাকছে।", "Preview build: names are not sent anywhere yet. They stay on this phone.", "प्रीव्यू संस्करण: नाम अभी कहीं जमा नहीं हो रहे, सिर्फ़ इसी फ़ोन में हैं।"],
    "resume.title": ["আগের উত্তরগুলো রাখা আছে", "Your earlier answers are saved", "पिछले जवाब सहेजे हुए हैं"],
    "resume.go": ["যেখানে থেমেছিলাম, সেখান থেকে", "Continue where I left off", "जहाँ छोड़ा था, वहीं से"],
    "resume.new": ["গোড়া থেকে শুরু", "Start fresh", "नए सिरे से शुरू"],

    "card.save": ["ছবি সেভ করুন", "Save image", "तस्वीर सेव करें"],
    "card.whatsapp": ["হোয়াটসঅ্যাপে পাঠান", "Send on WhatsApp", "व्हाट्सऐप पर भेजें"],
    "card.photo": ["নিজের ছবি জুড়ুন", "Add your photo", "अपनी तस्वीर दें"],
    "card.photoNote": ["ছবিটা শুধু আপনার কার্ডে বসবে, এই ফোনের বাইরে যাবে না।", "The photo only goes on your card and stays on this phone.", "तस्वीर सिर्फ़ आपके कार्ड पर लगेगी, इसी फ़ोन में रहेगी।"],
    "card.event": ["অনুষ্ঠানের খুঁটিনাটি", "Event details", "कार्यक्रम की जानकारी"],
    "card.next": ["পরের জন", "Next person", "अगला व्यक्ति"],
    "card.home": ["প্রথম পাতায় ফিরুন", "Back to home", "मुख्य पन्ने पर"],
    "card.regno": ["নিবন্ধন নং", "Reg. no.", "पंजीकरण सं."],
    "card.entry": ["প্রবেশপত্র", "Entry pass", "प्रवेश पत्र"],
    "card.honoured": ["সম্মানিত কারিগর", "Honoured kaarigar", "सम्मानित कारीगर"],
    "card.withFamily": ["সপরিবারে আমন্ত্রিত", "Invited with family", "सपरिवार आमंत्रित"],
    "card.shareText": ["আমি \"{event}\" অনুষ্ঠানে নিমন্ত্রণ পেয়েছি! {name} · {trade} · {puja}। এবারের পুজোয় কাজ করে থাকলে আপনিও নাম লেখান: {url}", "I'm invited to {event}! {name} · {trade} · {puja}. If you worked on a Puja, register too: {url}", "मुझे {event} में आमंत्रित किया गया है! {name} · {trade} · {puja}। पूजा में काम किया हो तो आप भी नाम लिखवाएँ: {url}"],
    "card.accept": ["নিমন্ত্রণ নিলাম, আসছি", "I accept the invitation", "निमंत्रण स्वीकार है"],
    "card.accepted": ["ধন্যবাদ! অনুষ্ঠানে দেখা হচ্ছে।", "Thank you! See you at the event.", "धन्यवाद! कार्यक्रम में मिलते हैं।"],
    "card.invalid": ["এই লিংকে কোনও নিমন্ত্রণ খুঁজে পাওয়া গেল না। নিজের নাম লেখাতে নিচের বোতামটা টিপুন।", "No invitation was found in this link. Tap below to register yourself.", "इस लिंक में कोई निमंत्रण नहीं मिला। खुद नाम लिखवाने के लिए नीचे दबाएँ।"],
    "card.bySardar": ["{v} আপনার নাম লিখিয়েছেন", "{v} registered you", "{v} ने आपका नाम लिखवाया है"],
    "card.yours": ["আপনার নিমন্ত্রণপত্র", "Your invitation card", "आपका निमंत्रण पत्र"],

    "crew.title": ["সর্দারের খাতা", "Sardar's register", "सरदार का रजिस्टर"],
    "crew.intro": ["প্রথমে নিজের নাম আর পুজোর খবর একবার দিন। তারপর দলের এক-একজনের নাম, মোবাইল আর কাজ যোগ করুন। শেষে প্রত্যেককে হোয়াটসঅ্যাপে তাঁর নিজের নিমন্ত্রণ পাঠিয়ে দিন।", "Give your name and the Puja once. Then add each crew member's name, mobile and work. At the end, send each person their own invitation on WhatsApp.", "अपना नाम और पूजा की जानकारी एक बार दें। फिर टीम के हर सदस्य का नाम, मोबाइल और काम जोड़ें। आख़िर में हर किसी को व्हाट्सऐप पर उसका निमंत्रण भेजें।"],
    "crew.s1": ["আপনি আর পুজো", "You and the Puja", "आप और पूजा"],
    "crew.s2": ["দলের লোকজন", "Crew members", "टीम के सदस्य"],
    "crew.s3": ["নিমন্ত্রণ পাঠান", "Send invitations", "निमंत्रण भेजें"],
    "crew.you": ["আপনার নাম (সর্দার)", "Your name (sardar)", "आपका नाम (सरदार)"],
    "crew.yourMobile": ["আপনার মোবাইল", "Your mobile", "आपका मोबाइल"],
    "crew.member": ["কারিগরের নাম", "Kaarigar's name", "कारीगर का नाम"],
    "crew.memberMobile": ["কারিগরের মোবাইল", "Kaarigar's mobile", "कारीगर का मोबाइल"],
    "crew.add": ["দলে যোগ করুন", "Add to crew", "टीम में जोड़ें"],
    "crew.list": ["আপনার দল", "Your crew", "आपकी टीम"],
    "crew.empty": ["এখনও কাউকে যোগ করা হয়নি। প্রথম জনের নাম দিন।", "Nobody added yet. Add the first person.", "अभी कोई नहीं जुड़ा। पहले व्यक्ति का नाम दें।"],
    "crew.count": ["{n} জন", "{n} people", "{n} लोग"],
    "crew.finish": ["সবার নিমন্ত্রণপত্র তৈরি করুন", "Make everyone's invitation", "सबका निमंत्रण बनाएँ"],
    "crew.sendEach": ["প্রত্যেকের নামের পাশে \"পাঠান\" টিপুন। হোয়াটসঅ্যাপ খুলে যাবে, তাঁর নিমন্ত্রণের লিংক তৈরি থাকবে।", "Tap \"Send\" beside each person. WhatsApp opens with the link to their invitation ready.", "हर नाम के पास \"भेजें\" दबाएँ। व्हाट्सऐप खुलेगा, उनके निमंत्रण का लिंक तैयार रहेगा।"],
    "crew.send": ["পাঠান", "Send", "भेजें"],
    "crew.sent": ["পাঠানো হয়েছে", "Sent", "भेजा"],
    "crew.remove": ["বাদ দিন", "Remove", "हटाएँ"],
    "crew.msg": ["নমস্কার {name}! {sardar} \"{event}\" অনুষ্ঠানে আপনার নাম লিখিয়েছেন। আপনার নিমন্ত্রণপত্রটা দেখে নিন: {url}", "Namaskar {name}! {sardar} has registered you for {event}. See your invitation: {url}", "नमस्कार {name}! {sardar} ने आपका नाम {event} के लिए लिखवाया है। अपना निमंत्रण देखें: {url}"],
    "crew.mainTrade": ["দলের বেশিরভাগ লোক কী কাজ করেন?", "What work does most of the crew do?", "टीम ज़्यादातर क्या काम करती है?"],
    "crew.contacts": ["ফোনের কনট্যাক্ট থেকে বাছুন", "Pick from contacts", "कॉन्टैक्ट से चुनें"],
    "crew.dup": ["এই নম্বরটা আগেই দলে আছে।", "This number is already in the crew.", "यह नंबर पहले से टीम में है।"],
    "crew.need": ["নাম, ঠিকঠাক মোবাইল নম্বর আর অন্তত একটা কাজ দিন।", "Add a name, a valid mobile number and at least one kind of work.", "नाम, सही मोबाइल नंबर और कम से कम एक काम दें।"],
    "crew.needSelf": ["আপনার নাম, মোবাইল, পুজোর নাম আর এলাকাটা দিন।", "Add your name, mobile, the Puja and its area.", "अपना नाम, मोबाइल, पूजा का नाम और इलाका दें।"],

    "assist.title": ["স্বেচ্ছাসেবকের টেবিল", "Volunteer desk", "स्वयंसेवक डेस्क"],
    "assist.who": ["আপনার নাম (যিনি সাহায্য করছেন)", "Your name (the volunteer helping)", "आपका नाम (जो मदद कर रहे हैं)"],
    "assist.badge": ["সহায়তায়: {v}", "Assisted by {v}", "सहायता: {v}"],
    "assist.start": ["প্রথম জনকে দিয়ে শুরু করুন", "Start with the first person", "पहले व्यक्ति से शुरू करें"],

    "ev.kicker": ["অনুষ্ঠানের দিনের সব খবর", "Everything you need on the day", "कार्यक्रम के दिन की पूरी जानकारी"],
    "ev.map": ["ম্যাপে রাস্তা দেখুন", "Directions on the map", "नक्शे पर रास्ता देखें"],
    "ev.cal": ["ক্যালেন্ডারে তুলে রাখুন", "Add to calendar", "कैलेंडर में जोड़ें"],
    "ev.reach": ["কীভাবে আসবেন", "How to reach", "कैसे पहुँचें"],
    "ev.reachBody": ["ম্যাপের বোতাম টিপলে রাস্তা দেখাবে। সবচেয়ে সহজ হল দলের সঙ্গে একসঙ্গে আসা — সর্দারের সঙ্গে কথা বলে নিন। গাড়ির ব্যবস্থা হলে হেল্পলাইন থেকে জানিয়ে দেওয়া হবে।", "Use the map button for directions. Coming together with your crew is easiest: speak to your sardar. If transport is arranged, the helpline will let you know.", "नक्शे के बटन से रास्ता देखें। टीम के साथ आना सबसे आसान है — अपने सरदार से बात कर लें। गाड़ी की व्यवस्था हुई तो हेल्पलाइन से बताया जाएगा।"],
    "ev.bring": ["সঙ্গে যা আনবেন", "What to bring", "साथ लाएँ"],
    "ev.bring1": ["আপনার নিমন্ত্রণপত্র (QR-সহ) — ফোনে দেখালেও হবে, ছাপিয়ে আনলেও হবে", "Your invitation card, on the phone or printed, with its QR", "आपका निमंत्रण पत्र — फ़ोन पर या छपा हुआ, QR के साथ"],
    "ev.bring2": ["নাম লেখানোর সময় বাড়ির যতজনের কথা বলেছেন, ততজন", "The family members you registered", "पंजीकरण में बताए परिवार के सदस्य"],
    "ev.bring3": ["জলের বোতল, আর মুখে হাসি", "A water bottle, and a smile", "पानी की बोतल और मुस्कान"],
    "ev.family": ["পরিবারের পাস", "Family passes", "परिवार के पास"],
    "ev.familyBody": ["নাম লেখানোর সময় যতজনের কথা বলেছেন, ততজনের বসার জায়গা রাখা থাকবে। সংখ্যা বদলাতে চাইলে হেল্পলাইনে ফোন করুন।", "Seats are kept for as many family members as you registered. To change the number, call the helpline.", "पंजीकरण में जितने लोग बताए, उतनी सीटें रखी जाएँगी। संख्या बदलनी हो तो हेल्पलाइन पर फ़ोन करें।"],
    "ev.anthemBody": ["গানটা শুনে শিখে রাখুন — অনুষ্ঠানে সবাই মিলে গাইব। গানের পুরো কথা শিগগিরই এখানে দেওয়া হবে।", "Learn the anthem before the day: we will all sing it together. The full lyrics will be added here soon.", "गीत सुनकर सीख लीजिए — कार्यक्रम में सब मिलकर गाएँगे। पूरे बोल जल्द ही यहाँ दिए जाएँगे।"],
    "ev.letter": ["নিমন্ত্রণপত্র", "The invitation", "निमंत्रण पत्र"],
    "ev.letterBody": ["আয়োজকদের চারটে নিমন্ত্রণপত্রের নকশা। ছুঁয়ে বড় করে দেখুন।", "The organisers' four invitation designs. Tap to see them large.", "आयोजकों के चार निमंत्रण डिज़ाइन। छूकर बड़ा देखें।"],
    "ev.helpline": ["হেল্পলাইন", "Helpline", "हेल्पलाइन"],
    "ev.helpBody": ["নাম লেখানো, পরিবারের সংখ্যা বা অনুষ্ঠানের দিনের যেকোনও প্রশ্নে ফোন করুন।", "Call about registration, family numbers or anything on the day.", "नाम, परिवार की संख्या या कार्यक्रम के दिन के किसी भी सवाल के लिए फ़ोन करें।"],
    "ev.watch": ["দেখুন, শুনুন", "Watch and listen", "देखें और सुनें"],
    "ev.notReg": ["এখনও নাম লেখাননি?", "Not registered yet?", "अभी नाम नहीं लिखवाया?"]
  };

  var KEY = "bks.lang";
  function current() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.indexOf(q) >= 0) return q;
    try {
      var v = localStorage.getItem(KEY);
      if (v && LANGS.indexOf(v) >= 0) return v;
    } catch (e) { /* storage blocked */ }
    return "bn";
  }
  var lang = current();

  function t(key, vars) {
    var row = S[key];
    var s = row ? row[LANGS.indexOf(lang)] || row[0] : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    }
    return s;
  }
  // Config slots are {bn, en, hi} objects.
  function pick(obj) { return obj ? obj[lang] || obj.bn : ""; }
  function idx() { return LANGS.indexOf(lang); }

  function apply(root) {
    root = root || document;
    document.documentElement.lang = lang === "bn" ? "bn" : lang === "hi" ? "hi" : "en";
    document.documentElement.dataset.lang = lang;
    root.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.dataset.i18nHtml); });
    root.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.dataset.i18nPh); });
    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    root.querySelectorAll("[data-slot]").forEach(function (el) {
      var path = el.dataset.slot.split(".");
      var v = BKS.config;
      path.forEach(function (p) { v = v && v[p]; });
      el.textContent = pick(v);
    });
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.langBtn === lang));
    });
  }

  function set(next) {
    if (LANGS.indexOf(next) < 0) return;
    lang = next;
    try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
    apply();
    document.dispatchEvent(new CustomEvent("bks:lang", { detail: lang }));
  }

  // One compact control in the corner (brief, section 3): বাং / EN / हि.
  function mountSwitch(el) {
    if (!el) return;
    el.innerHTML = '<span class="sr-only">' + t("lang.label") + "</span>" +
      [["bn", "বাং"], ["en", "EN"], ["hi", "हि"]].map(function (p) {
        return '<button type="button" data-lang-btn="' + p[0] + '" lang="' + p[0] + '">' + p[1] + "</button>";
      }).join("");
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lang-btn]");
      if (b) set(b.dataset.langBtn);
    });
  }

  BKS.i18n = { t: t, pick: pick, apply: apply, set: set, mountSwitch: mountSwitch, idx: idx, get lang() { return lang; } };
})(window.BKS = window.BKS || {});
