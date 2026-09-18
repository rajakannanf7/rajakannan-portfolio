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

Uploads: images are resized and converted to WebP **in the browser** (under 4 MB each), then sent to
`/api/upload`. That route verifies your Firebase login, checks the email is in `ADMIN_EMAILS`, and commits
the file to the GitHub media repo (`MEDIA_REPO`). Files are served from `/media/…` on this domain and cached
at Vercel's edge for a year, so GitHub is only hit once per file. Videos up to 4 MB upload the same way;
for longer films paste a YouTube or Vimeo link. In text fields, wrap words in `*stars*` for the red accent.

Public pages revalidate every 60 seconds, so saved changes appear within about a minute.

---

## Connect Firebase + GitHub media

1. Firebase console: create the project, then **Firestore Database** (production mode) and
   **Authentication → Email/Password**. Add your admin user under **Users**. No Storage needed.
2. **Authentication → Settings → User actions**: untick **Enable create (sign-up)** so nobody else can
   make an account with your public config.
3. **Project settings → Your apps → Web** → register an app and copy the six config values.
4. GitHub: create a repo for uploads (e.g. `rajakannan-media`, private is fine) with a README so `main`
   exists. Then **Settings → Developer settings → Fine-grained tokens → Generate**, scoped to *only* that
   repo, permission **Contents: Read and write**.
5. Vercel → Project → Settings → Environment Variables (Production + Preview): add the secret
   `GITHUB_TOKEN`, then redeploy. The public settings (Firebase config, admin email, media repo) are
   defaults in `lib/config.js`; set the env vars in `.env.example` only to override them.
6. Put your admin email in `firestore.rules` (the `isAdmin()` list), then publish the rules: paste them in
   **Firestore → Rules**, or run `npx firebase-tools login` once and `npx firebase-tools deploy --only firestore:rules`.
7. Open `/admin`, sign in, and press **Seed empty collections**.

### What the rules do

Reads on `projects`, `shoots`, `skills`, `labs` and `settings` are public, because the site is public. Writes
require a signed-in user whose email is on the `isAdmin()` list: Firebase lets anyone holding the public web
config create an email/password account, so "signed in" alone is not enough. `enquiries` is the exception: **anyone can create one** (that's the contact form)
but **only you can read them**. The create rule also caps field lengths so the collection can't be used as
free storage.

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
lib/admin.js            Firestore writes, image compression, uploads, demo-mode switch
lib/server-auth.js      verifies Firebase ID tokens + admin allow-list on the server
app/api/upload          commits uploads to the GitHub media repo
app/media/[...path]     serves media from that repo, edge-cached
```
