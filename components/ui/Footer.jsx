import Link from 'next/link';

export default function Footer({ site }) {
  return (
    <footer className="border-t border-bone/10 px-6 py-8 md:px-[72px]">
      <div className="mx-auto flex max-w-shell flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <span className="font-mono text-[11px] tracking-[0.14em] text-faint">
          © {new Date().getFullYear()} RAJA KANNAN — {site.city.toUpperCase()}
        </span>
        <div className="flex gap-7">
          <a href={site.instagram} target="_blank" rel="noreferrer" className="font-mono text-[11px] tracking-[0.14em] text-mute hover:text-bone">
            INSTAGRAM
          </a>
          <a href={`mailto:${site.email}`} className="font-mono text-[11px] tracking-[0.14em] text-mute hover:text-bone">
            EMAIL
          </a>
          <Link href="/lab" className="font-mono text-[11px] tracking-[0.14em] text-mute hover:text-bone">
            LAB
          </Link>
        </div>
      </div>
    </footer>
  );
}
