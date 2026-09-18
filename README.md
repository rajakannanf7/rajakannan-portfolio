# rajakannan.com

Portfolio for Raja Kannan: photography, motion, 3D and AI. Next.js 14 (App Router), GSAP + ScrollTrigger,
Lenis smooth scroll, a raw-WebGL hero, and a Firebase-backed admin at `/admin`.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

It works immediately, with no Firebase and no keys. Every page reads Firestore first and falls back to
`lib/fallback.js`, so a fresh clone renders the finished site with the images in `public/img/v2/`.

### Try the admin without Firebase

```bash
echo NEXT_PUBLIC_ADMIN_DEMO=1 > .env.development.local
npm run dev          # then open /admin
```

Demo mode skips sign-in and saves to this browser's localStorage only. It never changes the live site and
is disabled in production builds. **RESET DEMO** in the admin header starts over. Delete the file to turn it off.

---

## Site map

| Route | What it is |
|---|---|
| `/` | WebGL hero (cursor "develops" the photo into its render), manifesto, horizontal work reel, process, shoot film strip, lab, about, contact |
| `/work`, `/work/[slug]` | All projects with a craft filter; case study with facts, overview, sections, before/after slider, gallery (images, MP4, YouTube, Vimeo), credits, next project |
| `/shoots`, `/shoots/[slug]` | Concept shoots as series: concept, notes, Instagram link, every frame in a lightbox |
| `/skills`, `/skills/[slug]` | The five crafts: description, offers, tools, a showcase uploaded for that skill, and every project tagged with it |
| `/lab`, `/about`, `/contact` | Experiments, experience timeline, enquiry form (saved to Firestore) |

---

## Admin (`/admin`)

| Section | Edits |
|---|---|
| **Projects** | Title, client, year, role, crafts, summary, overview, story sections, tools, gallery, before/after, credits, cover, hero image or video. Home-reel toggle, card shape, draft/published, order. |
| **Shoots** | Drop a whole series at once, pick the cover, add the concept, notes, tags, Instagram link, credits. |
| **Skills** | Text, offers, tools, cover, and a showcase of images or videos for each craft. |
| **Lab** | Experiment tiles and their filter tags. |
| **Site** | Hero headline, hero photo/render pair, manifesto, about text and image, experience, clients, contact details. |
| **Enquiries** | Messages from the contact form. |

Uploads: images are resized to 2400px and converted to WebP **in the browser** before upload, so a 30 MB
camera file lands as a few hundred KB. Videos up to 100 MB upload as-is; put longer films on YouTube or
Vimeo and paste the link. In text fields, wrap words in `*stars*` to get the red serif accent.

Public pages revalidate every 60 seconds, so saved changes appear within about a minute.

---

## Connect Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Build → Firestore Database** → create, production mode.
3. **Build → Storage** → create.
4. **Build → Authentication** → Sign-in method → enable **Email/Password**. Then Users → **Add user**.
   That is your admin login. There is no public sign-up anywhere in the app.
5. **Project settings → General → Your apps → Web** → register an app, copy the config values.
6. `cp .env.example .env.local` and fill in the six variables. Restart `npm run dev`.
   On Vercel, add the same six variables under Project → Settings → Environment Variables.
7. Paste `firestore.rules` and `storage.rules` into the Rules tab of each service and **publish**.
   (Re-publish them after this update: they now cover `shoots` and `skills` and allow video uploads.)
8. Open `/admin`, sign in, and press **Seed empty collections** on the Overview. That copies the starter
   content into Firestore so it becomes editable. Collections that already have content are left alone.

### What the rules do

Reads on `projects`, `shoots`, `skills`, `labs` and `settings` are public, because the site is public. Writes
require a signed-in user. `enquiries` is the exception: **anyone can create one** (that's the contact form)
but **only you can read them**. The create rule also caps field lengths so the collection can't be used as
free storage. Storage allows images under 8 MB and videos under 100 MB, uploaded by a signed-in user only.

---

## Code map

```
app/(site)/…            public pages (server components, read via lib/content.js)
app/admin/…             admin pages (client, write via lib/admin.js)
components/site/…       Hero (WebGL), WorkReel, Process, FilmStrip, Motion (scroll animations), …
components/ui/admin-*   admin form kit: schema-driven editor, media uploader, rows, chips
lib/fallback.js         starter content (also the seed)
lib/schemas.js          admin field definitions per content type
lib/content.js          public data getters with fallback
lib/admin.js            Firestore/Storage writes, image compression, demo-mode switch
```
