const TOOLS = [
  'CINEMA 4D', 'REDSHIFT', 'HOUDINI', 'UNREAL ENGINE 5', 'AFTER EFFECTS',
  'COMFYUI', 'BLENDER', 'FASHION PHOTOGRAPHY', 'GAUSSIAN SPLATS',
];

export default function Marquee() {
  const run = [...TOOLS, ...TOOLS];
  return (
    <div className="overflow-hidden border-y border-bone/[0.08] py-6">
      <div className="marquee-track">
        {run.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="px-5 font-mono text-[13px] tracking-[0.22em] text-faint">{t}</span>
            <span className="text-bone/10">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
