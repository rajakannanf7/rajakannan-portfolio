import Link from 'next/link';
import { accentParts, videoEmbed } from '../../lib/text';

// Renders "*accent*" markup from plain admin text as the serif italic accent.
export function Accent({ text }) {
  return accentParts(text).map((p, i) => (p.it ? <span key={i} className="it">{p.t}</span> : <span key={i}>{p.t}</span>));
}

// Big display heading split into masked lines. `lines` is an array; a line
// wrapped in *stars* renders as the red serif accent.
export function SplitHeading({ as: Tag = 'h2', lines, className = '' }) {
  return (
    <Tag className={`display split ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className="ln"><span><Accent text={l} /></span></span>
      ))}
    </Tag>
  );
}

// Word-split paragraph for the scroll-scrubbed "light up" effect.
export function Words({ text, className = '' }) {
  return (
    <p className={className} data-words>
      {accentParts(text).flatMap((p, i) =>
        p.it
          ? [<span key={i} className="w"><span className="it">{p.t}</span></span>, ' ']
          : p.t.split(/\s+/).filter(Boolean).flatMap((w, j) => [<span key={`${i}-${j}`} className="w">{w}</span>, ' '])
      )}
    </p>
  );
}

export function Arrow({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

// Image, uploaded video file, or YouTube/Vimeo link, all from one media item.
export function Media({ item, alt = '', priority = false }) {
  if (!item?.src) return null;
  if (item.type === 'video') {
    const v = videoEmbed(item.src);
    if (!v) return null;
    return (
      <div className="embed">
        {v.kind === 'iframe' ? (
          <iframe src={v.src} title={item.caption || alt || 'Video'} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="lazy" />
        ) : (
          <video src={v.src} controls playsInline preload="metadata" poster={item.poster || undefined} />
        )}
      </div>
    );
  }
  return <img src={item.src} alt={item.caption || alt} loading={priority ? 'eager' : 'lazy'} />;
}

export function PageHead({ eyebrow, lines, intro, aside }) {
  return (
    <header className="page-head">
      <div className="eyebrow mono">{eyebrow}</div>
      <SplitHeading as="h1" lines={lines} />
      {(intro || aside) && (
        <div className="intro rv">
          {intro && <p>{intro}</p>}
          {aside && <span className="mono">{aside}</span>}
        </div>
      )}
    </header>
  );
}

export function ContactBlock({ site }) {
  const letters = (s) => [...s].map((c, i) => (c === ' ' ? ' ' : <span key={i} className="ch">{c}</span>));
  return (
    <section className="contact" id="contact">
      <div className="glow" />
      <div className="eyebrow mono" style={{ marginBottom: 30, position: 'relative' }}>Now booking · {site.availability}</div>
      <h2 className="display" data-letters aria-label="Got a frame worth making unreal?">
        {letters('Got a frame')}<br />{letters('worth making')}<br /><span className="it">unreal?</span>
      </h2>
      <div className="cta-row">
        <a className="mag" href={`mailto:${site.email}`} data-magnetic>{site.email} <Arrow size={22} /></a>
        <Link className="ghost mono" href="/contact" data-magnetic>Start a project →</Link>
        {site.instagram && <a className="ghost mono" href={site.instagram} target="_blank" rel="noopener noreferrer" data-magnetic>Instagram ↗</a>}
      </div>
      <div className="cgrid">
        <div><span className="mono">Taking on</span><span>Brand films, campaigns & shoots</span></div>
        <div><span className="mono">Based in</span><span>{site.city}. Working worldwide.</span></div>
        <div><span className="mono">Studio</span><span>Magizh: photo & podcast rental</span></div>
        <div><span className="mono">Elsewhere</span><span><Link href="/shoots">Shoots</Link> · <Link href="/lab">Lab</Link> · <Link href="/skills">Skills</Link></span></div>
      </div>
      <div className="foot mono">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Chennai, IN</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </section>
  );
}

// Endless strip of phrases, alternating bold condensed and serif italic.
export function Ticker({ items = [] }) {
  if (!items.length) return null;
  const run = items.map((t, i) => <span key={i} className={i % 2 ? 's' : 'b'}>{t}</span>);
  return (
    <div className="ticker" aria-label={items.join(', ')}>
      <div className="tr" aria-hidden="true">{run}{run.map((r, i) => <span key={`d${i}`} className={r.props.className}>{r.props.children}</span>)}</div>
    </div>
  );
}
