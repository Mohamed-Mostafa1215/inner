interface ScientificTermProps {
  term: string;
  english: string;
  definition: string;
  children: React.ReactNode;
}

export function ScientificTerm({
  term,
  english,
  definition,
  children,
}: ScientificTermProps) {
  return (
    <span className="group relative inline-block cursor-help">
      <span className="border-b border-dotted border-amber-400/60 text-primary transition-colors group-hover:border-amber-300 group-hover:text-amber-300">
        {children}
      </span>

      {/* Tooltip — CSS-only via group-hover */}
      <span
        className="pointer-events-none absolute bottom-full right-1/2 translate-x-1/2 mb-2 z-50
                   w-64 rounded-xl p-4 card-elevated gold-border
                   opacity-0 scale-95 transition-all duration-200
                   group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
      >
        <span className="block font-bold text-foreground text-sm mb-0.5">
          {term}
        </span>
        <span className="block text-xs text-muted-foreground mb-2 font-mono tracking-wide">
          {english}
        </span>
        <span className="block text-sm text-muted-foreground leading-relaxed">
          {definition}
        </span>
        {/* Arrow */}
        <span className="absolute top-full right-1/2 translate-x-1/2 -mt-px w-2.5 h-2.5 rotate-45 bg-[hsl(var(--card))] border-b border-r border-amber-400/25" />
      </span>
    </span>
  );
}
