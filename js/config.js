/*
 * Content slots. The brief (section 14) lists event name, date, venue and time
 * as open decisions, so every screen reads them from here. Change a value here
 * and the landing, the event page, the voice guide and the invitation card all follow.
 */
window.BKS = window.BKS || {};
window.BKS.config = {
  event: {
    name: {
      bn: "কারিগর রত্ন সম্মাননা",
      en: "Kaarigar Ratna Sammanana",
      hi: "कारीगर रत्न सम्मान"
    },
    series: {
      bn: "কারিগর বিজয়া সম্মিলনী ২০২৬",
      en: "Kaarigar Bijoya Sammelan 2026",
      hi: "कारीगर विजया सम्मेलन २०२६"
    },
    // Event Note values. The current build said Sunday 1 November at Munshi Bheri.
    // Mahacharyaji and Shri Dilip Ghosh's office decide; update here when settled.
    date: {
      bn: "বুধবার, ৪ নভেম্বর ২০২৬",
      en: "Wednesday, 4 November 2026",
      hi: "बुधवार, ४ नवम्बर २०२६"
    },
    dateShort: { bn: "৪ নভেম্বর", en: "4 Nov", hi: "४ नवम्बर" },
    time: {
      bn: "বিকেল ৩:৩০ – সন্ধ্যা ৬:৩০",
      en: "3:30 – 6:30 pm",
      hi: "दोपहर ३:३० – शाम ६:३०"
    },
    venue: {
      bn: "নেতাজি ইন্ডোর স্টেডিয়াম, কলকাতা",
      en: "Netaji Indoor Stadium, Kolkata",
      hi: "नेताजी इंडोर स्टेडियम, कोलकाता"
    },
    mapQuery: "Netaji Indoor Stadium, Kolkata",
    isoDate: "2026-11-04T15:30:00+05:30"
  },
  helpline: [
    { tel: "+919167719898", display: "+91 91677 19898" },
    { tel: "+919830024611", display: "+91 98300 24611" }
  ],
  media: {
    reel: "https://www.instagram.com/reel/DeeWOaRsMPF/",
    reelEmbed: "https://www.instagram.com/reel/DeeWOaRsMPF/embed",
    anthem: "https://www.instagram.com/p/DeZSGVgRnmo/",
    anthemEmbed: "https://www.instagram.com/p/DeZSGVgRnmo/embed",
    // Set to an MP3/AAC URL (Vercel Blob) once the anthem audio file arrives.
    anthemAudio: null,
    filmId: "BKrUP5Froy4",
    film: "https://www.youtube.com/watch?v=BKrUP5Froy4",
    channel: "@dharmsansthapan"
  },
  // Registrations POST here when set. Until the backend is wired, nothing leaves
  // the phone and the register screens show a preview notice.
  apiEndpoint: null,
  previewMode: true
};
