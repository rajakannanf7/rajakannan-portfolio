import Link from 'next/link';

export default function ProjectCard({ project, tall = false }) {
  const height = tall ? 'h-[480px]' : 'h-[440px]';
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="view"
      className={`group relative block ${height} overflow-hidden rounded-card bg-ink2`}
    >
      {project.cover && (
        <img
          src={project.cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-swift group-hover:scale-[1.04]"
        />
      )}
      <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/90" />
      <span className="absolute inset-x-8 bottom-7 flex items-end justify-between">
        <span>
          <span className="mb-3 block font-mono text-[10px] tracking-[0.24em] text-halo/80">
            {project.category?.toUpperCase()}
          </span>
          <span className="block text-3xl font-medium tracking-[-0.01em] transition-transform duration-500 ease-swift group-hover:-translate-y-1">
            {project.title}
          </span>
        </span>
        <span className="font-mono text-[11px] tracking-[0.1em] text-mute">{project.year}</span>
      </span>
    </Link>
  );
}
