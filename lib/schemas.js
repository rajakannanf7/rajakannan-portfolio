import { skills as seedSkills } from './fallback';

// Skill ids are stable; titles come from the starter content.
export const skillOptions = seedSkills.map((s) => ({ value: s.slug, label: `${s.title} ${s.sub}` }));

const credits = { key: 'credits', label: 'CREDITS', type: 'rows', addLabel: 'ADD CREDIT', hint: 'Model, stylist, MUA, agency, director…', fields: [{ key: 'role', label: 'Role' }, { key: 'name', label: 'Name' }] };

// ---------------------------------------------------------------- projects
export const projectBlank = {
  title: '', slug: '', client: '', year: String(new Date().getFullYear()), category: '', role: '',
  skills: [], summary: '', overview: '', sections: [], gallery: [], tools: [], credits: [],
  cover: '', hero: '', heroVideo: '', compare: { before: '', after: '' },
  layout: 'wide', featured: false, published: true,
};
export const projectSchema = [
  { type: 'heading', label: 'BASICS' },
  { key: 'title', label: 'TITLE', span: 2 },
  { key: 'slug', label: 'SLUG', type: 'slug', span: 2 },
  { key: 'client', label: 'CLIENT', span: 3, placeholder: 'Self-initiated' },
  { key: 'year', label: 'YEAR', span: 3 },
  { key: 'category', label: 'CATEGORY', span: 3, placeholder: 'CGI · Brand film' },
  { key: 'role', label: 'YOUR ROLE', placeholder: 'Creative direction, 3D, animation' },
  { key: 'skills', label: 'CRAFTS', type: 'chips', options: skillOptions, hint: 'Links the project to each skill page and the work filter.' },
  { key: 'summary', label: 'ONE-LINE SUMMARY', type: 'textarea', rows: 2, hint: 'Shown on cards and in search results. Keep it to one sentence.' },

  { type: 'heading', label: 'THE STORY' },
  { key: 'overview', label: 'OVERVIEW', type: 'textarea', rows: 4, hint: 'The big opening paragraph of the case study: the brief in a sentence or two.' },
  { key: 'sections', label: 'SECTIONS', type: 'rows', addLabel: 'ADD SECTION', hint: 'Typical: The brief · The idea · Process · Result. Blank line between paragraphs.',
    fields: [{ key: 'heading', label: 'Heading, e.g. The idea', wide: true }, { key: 'body', label: 'Text', type: 'textarea', rows: 5 }] },
  { key: 'tools', label: 'TOOLS', type: 'list', placeholder: 'Cinema 4D, Redshift, After Effects' },

  { type: 'heading', label: 'GALLERY' },
  { key: 'gallery', label: 'IMAGES & VIDEOS', type: 'media', sizes: true, hint: 'Shown in this order below the story. Use “Half width” to pair two images side by side.' },
  { key: 'compare', label: 'BEFORE / AFTER (OPTIONAL)', type: 'compare', hint: 'Shows a drag slider. Both images should share the same framing.' },
  credits,

  { type: 'heading', label: 'IMAGES', side: true },
  { key: 'cover', label: 'COVER', type: 'image', side: true, ratio: 'aspect-[4/3]', hint: 'Card image on the home reel and work grid.' },
  { key: 'hero', label: 'CASE STUDY HERO', type: 'image', side: true, ratio: 'aspect-video', hint: 'Full-screen top image. Falls back to the cover. Keep the bottom third darker; the title sits there.' },
  { key: 'heroVideo', label: 'HERO VIDEO (OPTIONAL)', side: true, placeholder: 'MP4 URL, or a YouTube / Vimeo link', hint: 'An MP4 plays silently behind the title. A YouTube/Vimeo link is embedded under the overview.' },
  { type: 'heading', label: 'DISPLAY', side: true },
  { key: 'featured', label: 'Show in the home page reel', type: 'checkbox', side: true },
  { key: 'layout', label: 'REEL CARD SHAPE', type: 'select', side: true, options: [{ value: 'wide', label: 'Wide (landscape)' }, { value: 'tall', label: 'Tall (portrait)' }] },
  { key: 'published', label: 'Published', type: 'checkbox', side: true, default: true, hint: 'Untick to keep it as a hidden draft.' },
];

// ---------------------------------------------------------------- shoots
export const shootBlank = {
  title: '', slug: '', year: String(new Date().getFullYear()), tags: [], concept: '', notes: '',
  cover: '', frames: [], instagram: '', location: 'Magizh Studio, Chennai', credits: [], published: true,
};
export const shootSchema = [
  { type: 'heading', label: 'THE SHOOT' },
  { key: 'title', label: 'TITLE', span: 2 },
  { key: 'slug', label: 'SLUG', type: 'slug', span: 2 },
  { key: 'year', label: 'YEAR', span: 2 },
  { key: 'tags', label: 'TAGS', type: 'list', span: 2, placeholder: 'Editorial, Portrait', hint: 'The first tag shows on the card.' },
  { key: 'concept', label: 'CONCEPT', type: 'textarea', rows: 3, hint: 'One or two sentences: the idea behind the shoot.' },
  { key: 'notes', label: 'BEHIND THE SHOOT (OPTIONAL)', type: 'textarea', rows: 4, hint: 'Lighting, styling, references, how it was made.' },
  { key: 'instagram', label: 'INSTAGRAM POST LINK', placeholder: 'https://instagram.com/p/…' },

  { type: 'heading', label: 'FRAMES' },
  { key: 'frames', label: 'PHOTOS', type: 'media', coverKey: 'cover', hint: 'Drop the whole series at once. Press SET COVER on the frame that should lead.' },
  credits,

  { type: 'heading', label: 'COVER & STATUS', side: true },
  { key: 'cover', label: 'COVER', type: 'image', side: true, ratio: 'aspect-[3/4]', hint: 'Or pick one with SET COVER in the frames list.' },
  { key: 'location', label: 'LOCATION', side: true },
  { key: 'published', label: 'Published', type: 'checkbox', side: true, default: true },
];

// ---------------------------------------------------------------- skills
export const skillSchema = [
  { type: 'heading', label: 'THE CRAFT' },
  { key: 'title', label: 'TITLE', span: 3 },
  { key: 'sub', label: 'ITALIC WORD', span: 3, placeholder: 'photography' },
  { key: 'n', label: 'NUMBER', span: 3, placeholder: '01' },
  { key: 'summary', label: 'SUMMARY', type: 'textarea', rows: 3, hint: 'Shown on the home page process section and at the top of the skill page.' },
  { key: 'body', label: 'LONGER DESCRIPTION', type: 'textarea', rows: 6, hint: 'Blank line between paragraphs.' },
  { key: 'offers', label: 'WHAT YOU OFFER', type: 'list', placeholder: 'Fashion editorials, Campaign shoots' },
  { key: 'tools', label: 'TOOLS', type: 'list', placeholder: 'Capture One, Lightroom' },
  { type: 'heading', label: 'SHOWCASE' },
  { key: 'showcase', label: 'SHOWCASE CONTENT', type: 'media', sizes: true, links: true, hint: 'Content made to show this skill on its own: reels, breakdowns, stills. Projects tagged with this skill appear automatically below it.' },
  { type: 'heading', label: 'IMAGE', side: true },
  { key: 'cover', label: 'COVER', type: 'image', side: true, ratio: 'aspect-[4/5]', hint: 'Used on the home page process section and the skill page hero.' },
];

// ---------------------------------------------------------------- lab
export const labBlank = { title: '', tool: '', tag: '', src: '' };
export const labSchema = [
  { key: 'title', label: 'TITLE', span: 3 },
  { key: 'tool', label: 'TOOL', span: 3, placeholder: 'Houdini' },
  { key: 'tag', label: 'FILTER TAG', span: 3, placeholder: 'Simulation' },
  { key: 'src', label: 'IMAGE', type: 'image', ratio: 'aspect-square' },
];

// ---------------------------------------------------------------- site settings
export const siteSchema = [
  { type: 'heading', label: 'HOME HERO' },
  { key: 'headline', label: 'HEADLINE', hint: 'Use | to split the two lines. The red italic word goes in the next field.', span: 2 },
  { key: 'headlineAccent', label: 'RED ITALIC WORD', span: 2, placeholder: 'unreal.' },
  { key: 'intro', label: 'INTRO LINE', type: 'textarea', rows: 3 },
  { key: 'heroCaptured', label: 'HERO PHOTO (CAPTURED)', type: 'image', ratio: 'aspect-video', span: 2, hint: 'The real photograph.' },
  { key: 'heroUnreal', label: 'HERO RENDER (UNREAL)', type: 'image', ratio: 'aspect-video', span: 2, hint: 'Same framing, reworked. Revealed under the cursor.' },
  { key: 'heroFocus', label: 'SUBJECT POSITION (0 = LEFT, 1 = RIGHT)', type: 'number', hint: 'Where the subject sits across the hero images. Phones crop to this point. Default 0.58.' },
  { type: 'heading', label: 'MANIFESTO & ABOUT' },
  { key: 'manifesto', label: 'MANIFESTO', type: 'textarea', rows: 4, hint: 'Wrap words in *stars* to make them red italic.' },
  { key: 'aboutHeadline', label: 'ABOUT HEADLINE', type: 'textarea', rows: 2, hint: '*Stars* make the red italic accent.' },
  { key: 'aboutBody', label: 'ABOUT TEXT', type: 'textarea', rows: 7, hint: 'Blank line between paragraphs.' },
  { key: 'experience', label: 'EXPERIENCE', type: 'rows', addLabel: 'ADD ROLE',
    fields: [{ key: 'years', label: 'Years, e.g. 2021 — Now' }, { key: 'place', label: 'Place' }, { key: 'role', label: 'Role, Company', wide: true }, { key: 'note', label: 'One line about it', wide: true }, { key: 'now', label: 'Current role (shows NOW)', type: 'checkbox' }] },
  { key: 'marquee', label: 'SCROLLING STRIP', type: 'list', hint: 'Comma separated phrases. They alternate bold and italic, so pair them: “Brand films, shot on real light, CGI worlds, made unreal”.' },
  { type: 'heading', label: 'CONTACT', side: true },
  { key: 'email', label: 'EMAIL', side: true },
  { key: 'instagram', label: 'INSTAGRAM URL', side: true },
  { key: 'city', label: 'CITY', side: true },
  { key: 'availability', label: 'AVAILABILITY', side: true, placeholder: 'Q4 2026' },
  { type: 'heading', label: 'ABOUT IMAGE', side: true },
  { key: 'aboutImage', label: 'IMAGE', type: 'image', side: true, ratio: 'aspect-[3/4]' },
];
