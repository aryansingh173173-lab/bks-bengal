# BKS Pujo · কারিগর রত্ন সম্মাননা

An animated, voice-first invitation and registration site for every kaarigar who worked on a Durga Puja in 2026. It's a redesign of `BKS-Bengal/karigar-vijay-sammelan-2026` that follows the *Kaarigar Registration: Voice-Guided Experience Design Brief* (Draft 1, 14 October 2026).

> আপনার হাতেই মা আসেন। এবার আপনাকে সম্মান জানাতে চাই।

## Look

The palette is **Coral Fire `#FF4D4D`** and **Sky Cyan `#5CE1FF`**, with deep navy `#0E1A2B` as the ink, on a warm paper ground (`#FFF8F1`). Shapes are soft: rounded cards, hairline borders and soft shadows, with no hard outlines, offset shadows or tilted boxes. Headings are set in Noto Serif Bengali (Noto Serif Devanagari for Hindi) with generous line height so vowel signs never clip. Body text is Hind Siliguri. For contrast, white text only goes on coral at large, bold sizes, and text on cyan is always navy.

Bangla is written first and as people in Kolkata speak it. It is not translated from the English. When copy changes, write the Bangla first in `js/i18n.js`.

### Trade photos

Each of the 16 trades has a photo in `assets/trades/<id>.webp` (the ids are in `js/data.js`). The landing page cards and the job picker in the registration flow both use it. The current files were cropped from the organisers' "The Hands Behind Durga Puja" reference sheet, so they are small (about 320 px wide). To use sharper originals, replace a file with the same name at roughly 800 × 600 px.

## What's here

| Page | Path | What it does |
| --- | --- | --- |
| Invitation landing | `/` | Opens with an animated invitation: the frame draws itself, the conch-blower and Maa Durga slide in, and marigold petals fall. One large red button, "কথা বলে নাম লেখান". On scroll you get the reel, 16 trade cards that cascade in, a pinned horizontal photo story (21 Sep → finished pandal), a live demo phone, the film, the dedication, and a countdown. |
| Voice guide | `/register/?mode=voice` | Kaarigar Saathi asks six questions, one per screen, in Bangla. It shows what it heard, reads it back for হ্যাঁ / না, and stamps each answer onto a registration slip. The mic breathes while listening and ripples while speaking. |
| Typed flow | `/register/?mode=text` | The same flow, typed and tapped. |
| Crew mode | `/register/?mode=crew` | A sardar enters the Puja once, adds each crew member (by typing, by voice, or from the phone's contacts where supported), then sends each person their own invitation link on WhatsApp. |
| Assisted mode | `/register/?mode=assisted` | For a volunteer desk. Each registration is marked "assisted by", and a "পরের জন" button resets for the next person. |
| Invitation card | end of the flow, and `/card/#d=…` | A 1080 × 1350 card for WhatsApp, drawn on the phone. It shows the name in the place of honour, trade · Puja, family pass, date and venue, and a QR entry pass. People can save it, share it, or add their own photo. |
| Event details | `/event/` | Date, time, venue, map, add-to-calendar, what to bring, family passes, helpline, the anthem, the film, the reel, and all the invitation designs. |

Bangla is the default. English and Hindi are one tap away (`বাং / EN / हि`), and the guide switches to Hindi when someone answers in Hindi.

## Pandal QR codes

To pre-fill the Puja and location, so the question is only confirmed, add parameters:

```
/register/?mode=voice&puja=সন্তোষপুর লেক পল্লী&area=সন্তোষপুর&district=0
```

`district` takes an index into `DISTRICTS` in `js/data.js` (0 = Kolkata) or a district name.

## Changing event details

The event name, date, time, venue, helpline numbers and media links are content slots in **`js/config.js`**. The brief (section 14) lists them as open decisions. Change them there and every page and the card follow. Right now they hold the Event Note values: **Wednesday 4 November 2026, 3:30–6:30 pm, Netaji Indoor Stadium**.

## Before real registrations

`previewMode: true` in `js/config.js` shows a notice that names are not sent anywhere yet. Registrations are kept only on the phone, in `localStorage`. To collect them:

1. Point `apiEndpoint` in `js/config.js` at a backend that accepts a JSON POST. The record shape is in `record()` in `js/register.js`.
2. Set `previewMode: false`.
3. Add `anthemAudio` (MP3/AAC on Vercel Blob) once the file arrives. The card screen then plays the opening bars.

## Voice

Speech uses the browser's own engines (`SpeechRecognition` in `bn-IN` / `hi-IN` / `en-IN` and `speechSynthesis`). That works in Chrome on Android. Where a phone has no Bangla voice, the guide shows its line instead of reading Bangla in an English accent. Where it can't listen, the same flow works by tapping and typing. The screens only call `BKS.voice.speak()` and `BKS.voice.listen()`, so the winner of the brief's bake-off (Gemini, Sarvam, ElevenLabs) can be dropped into `js/voice.js` without touching the flow.

## Run locally

It's a static site with no build step:

```
python -m http.server 5173
```

Then open http://localhost:5173.

## Credits

The invitation artwork, the progress photographs and the logos come from the organisers (KarmYog for the 21st Century, Bharatiya Krishak Samaj) via the original repository. The reel, the anthem and the film belong to @dharmsansthapan / Dharma Sansthapaner Pala and load only when tapped.
