import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "المركز" },
  { to: "/assessment", label: "تقييم القوى" },
  { to: "/protocol", label: "بروتوكول 60 يوم" },
  { to: "/exercises", label: "التمارين" },
  { to: "/journal", label: "اليوميات" },
  { to: "/identities", label: "الهويات" },
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 gold-border">
            <span className="gold-text font-black text-lg">س</span>
          </span>
          <div className="leading-tight">
            <div className="font-bold gold-text text-base">السيادة</div>
            <div className="text-[10px] text-muted-foreground">مصفوفة القوى الخمس</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors whitespace-nowrap [&.active]:text-primary [&.active]:bg-primary/10"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
