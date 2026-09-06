import Link from 'next/link';

export function SectionLabel({ children, className = '' }) {
  return (
    <div className={`font-mono text-[11px] tracking-label text-dim ${className}`}>{children}</div>
  );
}

export function Arrow({ size = 16, stroke = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export function FillButton({ href = '/contact', children, className = '' }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-4 rounded-full bg-bone px-7 py-4 font-mono text-xs font-medium tracking-chip text-ink transition-transform duration-300 ease-swift hover:scale-[1.03] ${className}`}
    >
      {children}
      <Arrow stroke="#0A0A0C" />
    </Link>
  );
}

export function GhostButton({ href = '/about', children, className = '' }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full border border-bone/20 px-7 py-4 font-mono text-xs tracking-chip text-bone/80 transition-colors duration-300 hover:border-bone/50 hover:text-bone ${className}`}
    >
      {children}
    </Link>
  );
}

export function VioletButton({ href = '/work', children, className = '' }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-violet to-orchid px-7 py-4 font-mono text-[11px] font-medium tracking-chip text-white transition-transform duration-300 ease-swift hover:scale-[1.03] ${className}`}
    >
      {children}
      <span className="h-[5px] w-[5px] rounded-full bg-white/90" />
    </Link>
  );
}

export function Chip({ children }) {
  return (
    <span className="rounded-full border border-bone/15 px-5 py-3 font-mono text-[11px] tracking-chip text-bone/80">
      {children}
    </span>
  );
}

export function Shell({ children, className = '' }) {
  return <div className={`mx-auto max-w-shell px-6 md:px-[72px] ${className}`}>{children}</div>;
}
