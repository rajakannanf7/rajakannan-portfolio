# rajakannan.com

Portfolio site — Next.js 14 (App Router), React Three Fiber, GSAP-free scroll reveals, Lenis smooth
scroll, Tailwind, and a Firebase-backed admin at `/admin`.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

It works immediately, with no Firebase and no keys. Every page reads Firestore first and falls back to
`lib/fallback.js`, so a fresh clone renders the finished site with the images already in
`public/img/`. Connect Firebase when you want to edit content without a deploy.

---

## Connect Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Build → Firestore Database** → create, production mode.
3. **Build → Storage** → create.
4. **Build → Authentication** → Sign-in method → enable **Email/Password**. Then Users → **Add user**.
   That is your admin login. There is no public sign-up anywhere in the app.
5. **Project settings → General → Your apps → Web** → register an app, copy the config values.
6. `cp .env.example .env.local` and fill in the six variables. Restart `npm run dev`.
7. Paste `firestore.rules` and `storage.rules` into the Rules tab of each service and publish.
8. Open `/admin`, sign in, and press **Seed from starter content** — that copies the repo content into
   Firestore so it becomes editable.

### What the rules do

Reads on `projects`, `photos`, `labs` and `settings` are public — the site is public. Writes require a
signed-in user. `enquiries` is the exception and the one worth understanding: **anyone can create one**
(that's the contact form) but **only you can read them**. Without that split either the form breaks or
your enquiries are world-readable. The create rule also caps field lengths so the collection cannot be
used as free storage.

---

## Structure

```
app/
  page.jsx                 Home
  work/                    Index + [slug] case studies
  photography/             Gallery with filters and lightbox
  about/  lab/  contact/
  admin/                   Auth-gated CMS
components/
  three/                   R3F hero — procedural iridescent shader
  sections/                Home page sections
  ui/                      Cursor, Lenis, Nav, Reveal, Magnetic, shared bits
lib/
  firebase.js              Client init, degrades to null without env
  content.js               Server-side getters, all with fallbacks
  fallback.js              Starter content — edit this or seed it into Firestore
  admin.js                 CRUD + upload helpers
```

---

## The hero

`components/three/HeroObject.jsx` renders a subdivided icosahedron with a custom GLSL material
(`iridescent.glsl.js`). No model file, nothing to export.

- Layered simplex noise displaces the surface; the normal is **rebuilt from three samples** of the
  displaced field. Skip that and the lighting goes flat and the whole thing reads as a sticker.
- The cursor does two things: pulls the surface toward itself, and moves the key light. The second one
  is what actually sells the material.
- Scroll shifts the colour ramp and calms the displacement, so the object settles as you leave the hero.
- Three palette variants, switched by the dashes bottom-right of the panel.
- WebGL is skipped on screens under 640px or fewer than 4 cores — those get `hero-object.png`.
  `prefers-reduced-motion` freezes the animation but keeps the render.

To use a modelled GLB instead, swap the `<icosahedronGeometry>` for a `useGLTF` load and keep the
material.

---

## Content model

**projects** — `slug, title, client, year, category, role, services, cover, hero, fullBleed, size
('wide'|'narrow'), featured, order, lead, body[], process[{src,caption}], wide[{src,caption}], tools[]`

`featured: true` with a `cover` puts it on the grid; anything else drops to the archive list.

**photos** — `src, title, tag, offset, order` · **labs** — `src, title, tool, tag, h, order`
**enquiries** — `name, email, company, budget, type, message, status, createdAt`
**settings/site** — `name, tagline, blurb, email, instagram, city, showreelUrl, availability`

---

## Deploy

Push to GitHub, import at [vercel.com/new](https://vercel.com/new), add the same six environment
variables, deploy. Add `rajakannan.com` under the project's Domains tab.

Pages use `revalidate = 60`, so content edits appear within a minute without a rebuild.

---

## Still to do

- Replace `public/img/ph1–ph6.jpg` with full-resolution editorial exports (currently low-res crops).
- `public/img/about-portrait.jpg` is a grey placeholder — needs a real photograph of you.
- Set `showreelUrl` in `settings/site` once the reel is cut; the hero card links to `/work` until then.
- The showreel thumbnail wants to be a muted looping `<video>` rather than a still.
- Project counts on the About page are `[N]` placeholders.
