// Starter content. The site renders from this until Firestore has documents,
// so a fresh clone looks finished before you open the admin. The admin's
// "Seed from starter content" button copies all of it into Firestore.
//
// Everything here is placeholder: swap it for real projects in /admin.

const I = (f) => `/img/v2/${f}`;

// Skill slugs are stable ids; projects and shoots tag themselves with them.
export const SKILL_IDS = ['capture', 'motion', '3d', 'ai', 'tech'];

export const skills = [
  {
    id: 'capture', slug: 'capture', order: 1, n: '01', title: 'Capture', sub: 'photography',
    summary: 'Editorial portraits, campaigns and fashion film, shot, lit and directed in studio. Every render starts with how real light behaves.',
    body: 'I started behind the camera, and it still shapes everything I make. Lighting a set teaches you how a surface actually catches light, and that is what makes a render believable later. At Magizh Studio I shoot fashion editorial, campaigns, portraits and fashion films end to end: concept, casting, styling direction, lighting, capture and grade.',
    offers: ['Fashion editorials', 'Campaign shoots', 'Portraits', 'Fashion films', 'Plates for CGI'],
    tools: ['Studio lighting', 'Fashion direction', 'Capture One', 'Lightroom'],
    cover: I('hero-captured.webp'),
    showcase: [
      { type: 'image', src: I('ph-indigo.webp'), caption: 'Gold & Indigo, campaign' },
      { type: 'image', src: I('ph-noir.webp'), caption: 'Noir, menswear' },
      { type: 'image', src: I('ph-silk.webp'), caption: 'Emerald Silk, fashion film still' },
    ],
  },
  {
    id: 'motion', slug: 'motion', order: 2, n: '02', title: 'Motion', sub: 'design',
    summary: 'Brand films, title sequences, product animation and social content: rhythm, timing and type that move with intent.',
    body: 'Seven years of motion design across studios, product teams and my own practice. I care about timing more than effects: when a cut lands, how type breathes, and how a loop feels on the tenth watch.',
    offers: ['Brand films', 'Title sequences', 'Product animation', 'UI motion', 'Social content'],
    tools: ['After Effects', 'Premiere Pro', 'DaVinci Resolve'],
    cover: I('work-magizh.webp'),
    showcase: [],
  },
  {
    id: '3d', slug: '3d', order: 3, n: '03', title: '3D / CGI', sub: 'worlds',
    summary: 'Product visualisation, look development and virtual production, built to be photographed rather than simply rendered.',
    body: 'I light CG the way I light a studio: one decisive key, a considered rim, and nothing that would not exist on a real set. That discipline makes product renders feel like photographs and abstract forms feel physical.',
    offers: ['Product visualisation', 'Look development', 'Abstract brand worlds', 'Virtual production'],
    tools: ['Cinema 4D', 'Redshift', 'Blender', 'Unreal Engine 5'],
    cover: I('work-aura.webp'),
    showcase: [
      { type: 'image', src: I('lab-chrome.webp'), caption: 'Chrome study' },
      { type: 'image', src: I('lab-ribbon.webp'), caption: 'Ribbon figure' },
    ],
  },
  {
    id: 'ai', slug: 'ai', order: 4, n: '04', title: 'AI', sub: 'production',
    summary: 'AI image and video, consistent characters and generative films, with custom workflows instead of one-click prompts.',
    body: 'I build generative pipelines in ComfyUI the way I would build a comp: node by node, with control over every pass. The result is AI work with art direction, consistent characters and a finish that survives a big screen.',
    offers: ['AI campaigns', 'Character consistency', 'Generative films', 'Custom ComfyUI workflows'],
    tools: ['ComfyUI', 'Video models', 'Custom nodes'],
    cover: I('work-neural.webp'),
    showcase: [
      { type: 'image', src: I('hero-unreal.webp'), caption: 'Captured to unreal' },
    ],
  },
  {
    id: 'tech', slug: 'tech', order: 5, n: '05', title: 'Creative', sub: 'tech',
    summary: 'Automation, shaders and experimental tooling: the systems that let one person deliver at studio scale.',
    body: 'Between projects I build tools: shaders, simulation setups, capture experiments and automations that remove the boring parts of a pipeline. The lab is where those ideas get tested before they reach client work.',
    offers: ['Pipeline automation', 'Shaders', 'Simulation', 'Gaussian splat capture'],
    tools: ['GLSL', 'Houdini', 'Gaussian splats', 'Pipelines'],
    cover: I('lab-grid.webp'),
    showcase: [
      { type: 'image', src: I('lab-thinfilm.webp'), caption: 'Thin-film shader' },
      { type: 'image', src: I('lab-splat.webp'), caption: 'Splat capture' },
    ],
  },
];

export const projects = [
  {
    id: 'sentient', slug: 'sentient', order: 1, published: true, featured: true, layout: 'wide',
    title: 'Sentient', client: 'Elysian', year: '2026', category: 'CGI · Brand film',
    skills: ['3d', 'ai', 'motion'],
    role: 'Creative direction, 3D, animation',
    summary: 'A launch film that makes an abstract AI product feel physical: one form that learns, shifting from liquid to chrome to light.',
    cover: I('work-sentient.webp'), hero: I('work-sentient.webp'), heroVideo: '',
    overview: 'Elysian needed a launch film that made an abstract AI product feel physical, something you could almost touch before you understood what it did.',
    sections: [
      { heading: 'The idea', body: 'A single evolving form: a material that shifts between liquid, chrome and light as the product learns. Every beat of the film maps to a stage in that learning curve.' },
      { heading: 'Process', body: 'Look development in Cinema 4D and Redshift, AI-assisted texture and lighting exploration in ComfyUI, then the final grade and composite in After Effects.' },
    ],
    gallery: [
      { type: 'image', src: I('lab-chrome.webp'), caption: 'Material study', size: 'half' },
      { type: 'image', src: I('lab-thinfilm.webp'), caption: 'Thin-film lookdev', size: 'half' },
      { type: 'image', src: I('work-sentient.webp'), caption: 'Final frame', size: 'full' },
    ],
    compare: { before: '', after: '' },
    tools: ['Cinema 4D', 'Redshift', 'Unreal Engine 5', 'ComfyUI', 'After Effects'],
    credits: [{ role: 'Client', name: 'Elysian' }],
  },
  {
    id: 'aura', slug: 'aura', order: 2, published: true, featured: true, layout: 'tall',
    title: 'Aura', client: 'Product', year: '2025', category: 'Product viz',
    skills: ['3d'],
    role: '3D, look development',
    summary: 'A sensor unit that had to look inevitable before it existed. Lit like a studio product shoot, not a CG render.',
    cover: I('work-aura.webp'), hero: I('work-aura.webp'), heroVideo: '',
    overview: 'Hard-surface modelling and look development for a device that did not exist yet.',
    sections: [
      { heading: 'Lighting', body: 'Lit as a studio product shoot rather than a CG render: one large key, one cool rim, and a single warm accent to keep it in the family.' },
    ],
    gallery: [], compare: { before: '', after: '' },
    tools: ['Cinema 4D', 'Redshift', 'Photoshop'], credits: [],
  },
  {
    id: 'neural-bloom', slug: 'neural-bloom', order: 3, published: true, featured: true, layout: 'tall',
    title: 'Neural Bloom', client: 'Self-initiated', year: '2025', category: 'AI film · Generative',
    skills: ['ai', 'motion'],
    role: 'Direction, AI pipeline',
    summary: 'Thousands of filaments resolving into one form, made with a custom ComfyUI conditioning chain and graded as a film.',
    cover: I('work-neural.webp'), hero: I('work-neural.webp'), heroVideo: '',
    overview: 'A generative study in growth: thousands of filaments resolving into a single form.',
    sections: [
      { heading: 'Pipeline', body: 'Built as a ComfyUI workflow with a custom conditioning chain, then retimed and graded as a film rather than a sequence of stills.' },
    ],
    gallery: [], compare: { before: '', after: '' },
    tools: ['ComfyUI', 'After Effects', 'DaVinci Resolve'], credits: [],
  },
  {
    id: 'magizh', slug: 'magizh', order: 4, published: true, featured: true, layout: 'wide',
    title: 'Magizh', client: 'Magizh', year: '2025', category: 'Identity · Titles',
    skills: ['motion', '3d'],
    role: 'Design, animation',
    summary: 'One mark, one material, one move, designed to read at any size and animate from any frame.',
    cover: I('work-magizh.webp'), hero: I('work-magizh.webp'), heroVideo: '',
    overview: 'An identity and title sequence for Magizh, built around a single rotating form.',
    sections: [], gallery: [], compare: { before: '', after: '' },
    tools: ['Cinema 4D', 'After Effects', 'Illustrator'], credits: [],
  },
  {
    id: 'hero-study', slug: 'captured-to-unreal', order: 5, published: true, featured: false, layout: 'wide',
    title: 'Captured to Unreal', client: 'Self-initiated', year: '2026', category: 'Photo + CGI',
    skills: ['capture', 'ai', '3d'],
    role: 'Photography, CGI, AI',
    summary: 'One studio frame, pushed from photograph to hyperreal render.',
    cover: I('hero-unreal.webp'), hero: I('hero-unreal.webp'), heroVideo: '',
    overview: 'A study in the pipeline that defines my work: shoot a real frame, then rebuild it as something that could not exist.',
    sections: [],
    gallery: [],
    compare: { before: I('hero-captured.webp'), after: I('hero-unreal.webp') },
    tools: ['Photography', 'ComfyUI', 'Redshift'], credits: [],
  },
];

export const shoots = [
  { id: 'caution', slug: 'caution', order: 1, published: true, title: 'Caution', year: '2025', tags: ['Editorial'],
    concept: 'Hazard tape as couture: a hard-flash editorial about the line you are told not to cross.',
    cover: I('ph-caution.webp'), frames: [{ src: I('ph-caution.webp'), caption: '' }], instagram: '', credits: [] },
  { id: 'gold-indigo', slug: 'gold-and-indigo', order: 2, published: true, title: 'Gold & Indigo', year: '2025', tags: ['Campaign'],
    concept: 'Temple gold against indigo walls, lit warm like late-evening lamplight.',
    cover: I('ph-indigo.webp'), frames: [{ src: I('ph-indigo.webp'), caption: '' }], instagram: '', credits: [] },
  { id: 'noir', slug: 'noir', order: 3, published: true, title: 'Noir', year: '2025', tags: ['Menswear'],
    concept: 'Rembrandt light, one coat, no colour.',
    cover: I('ph-noir.webp'), frames: [{ src: I('ph-noir.webp'), caption: '' }], instagram: '', credits: [] },
  { id: 'emerald-silk', slug: 'emerald-silk', order: 4, published: true, title: 'Emerald Silk', year: '2025', tags: ['Fashion film'],
    concept: 'Fabric as choreography, caught mid-air.',
    cover: I('ph-silk.webp'), frames: [{ src: I('ph-silk.webp'), caption: '' }], instagram: '', credits: [] },
  { id: 'terracotta', slug: 'terracotta', order: 5, published: true, title: 'Terracotta', year: '2025', tags: ['Portrait'],
    concept: 'Earth, linen and window light.',
    cover: I('ph-terracotta.webp'), frames: [{ src: I('ph-terracotta.webp'), caption: '' }], instagram: '', credits: [] },
  { id: 'golden-hour', slug: 'golden-hour', order: 6, published: true, title: 'Golden Hour', year: '2025', tags: ['Portrait'],
    concept: 'A Chennai rooftop, ten minutes before the sun goes.',
    cover: I('ph-golden.webp'), frames: [{ src: I('ph-golden.webp'), caption: '' }], instagram: '', credits: [] },
];

export const labs = [
  { id: 'l1', order: 1, src: I('lab-fluid.webp'), title: 'Crimson Crown', tool: 'Houdini', tag: 'Simulation' },
  { id: 'l2', order: 2, src: I('lab-thinfilm.webp'), title: 'Thin-Film', tool: 'GLSL', tag: 'Shaders' },
  { id: 'l3', order: 3, src: I('lab-ribbon.webp'), title: 'Ribbon Figure', tool: 'Cinema 4D', tag: 'Character' },
  { id: 'l4', order: 4, src: I('lab-chrome.webp'), title: 'Chrome Study', tool: 'Redshift', tag: 'Materials' },
  { id: 'l5', order: 5, src: I('lab-splat.webp'), title: 'Splat Capture', tool: 'Gaussian splats', tag: 'Real-time' },
  { id: 'l6', order: 6, src: I('lab-grid.webp'), title: 'Pin Field', tool: 'Houdini', tag: 'Simulation' },
];

export const site = {
  name: 'Raja Kannan',
  headline: 'I shoot it.|Then I make it',
  headlineAccent: 'unreal.',
  intro: 'Photographer, motion designer and 3D/AI artist. I work across studio photography, CGI and generative film, and one person carries each project from the first flash to the final frame.',
  manifesto: 'Seven years on both sides of the lens. I light a set like a render, and I render like I’m lighting a set. Photography, motion, 3D and AI are *one craft* to me, and the best frames happen when nothing gets lost between the shoot and the final grade.',
  heroCaptured: I('hero-captured.webp'),
  heroUnreal: I('hero-unreal.webp'),
  aboutImage: I('about-bts.webp'),
  aboutHeadline: 'Designer by craft. *Technologist by curiosity.* I run a studio, and I build tools for my own pipeline.',
  aboutBody: 'I’m Raja Kannan, a Chennai-based creative who works where photography, motion, 3D, AI and creative technology overlap. I build brand films and product worlds in Cinema 4D and Redshift, set up virtual production in Unreal Engine, and wire generative pipelines together in ComfyUI, often all on the same project.\n\nI shoot too: fashion editorial, portraiture and fashion film. What I enjoy most is owning a piece end to end: capture, concept, design, 3D, animation, AI and the final composite. Alongside client work I run Magizh, a photo studio, podcast studio and content practice in Chennai.',
  email: 'hello@rajakannan.com',
  instagram: 'https://instagram.com/rajakannan_rk',
  city: 'Chennai, India',
  availability: 'Q4 2026',
  showreelUrl: '',
  marquee: ['Brand films', 'shot on real light', 'CGI worlds', 'made unreal', 'Fashion editorials', 'lit in studio', 'AI production', 'with art direction', 'Title sequences', 'frame by frame'],
  experience: [
    { years: '2021 — Now', role: 'Founder & Creative Director, Magizh', note: 'Photo studio, podcast studio and content production practice.', place: 'Chennai', now: true },
    { years: '2023 — 2026', role: 'Motion Graphic Specialist, Sentient by Elysian', note: '3D animation and VFX for product launch work.', place: 'Bengaluru' },
    { years: '2022 — 2023', role: 'Motion Graphic Designer, aimedis.io', note: 'Animation and motion graphics for a healthcare platform.', place: 'Remote' },
    { years: '2022', role: 'Motion Designer, ByFar Studios', note: 'Motion graphics and After Effects work.', place: 'Bengaluru' },
    { years: '2021 — 2022', role: 'Motion Graphic Designer, Genten', note: 'Visual concepts and motion.', place: 'Chennai' },
    { years: '2018 — 2021', role: 'Motion Graphic Designer, TAKELEAP', note: 'Visual concepts, motion and post-production.', place: 'Tamil Nadu' },
    { years: '2015 — 2018', role: 'BSc Intermedia / Multimedia, ICAT', note: 'Video post-production and visual concepts.', place: 'Chennai' },
  ],
};
