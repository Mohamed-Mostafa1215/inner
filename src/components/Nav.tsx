import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "المركز" },
  { to: "/forces", label: "القوى" },
  { to: "/assessment", label: "التقييم" },
  { to: "/protocol", label: "البروتوكول" },
  { to: "/exercises", label: "التمارين" },
  { to: "/decision", label: "القرار" },
  { to: "/weekly", label: "الأسبوع" },
  { to: "/journal", label: "اليوميات" },
  { to: "/identities", label: "الهويات" },
  { to: "/dashboard", label: "القياس" },
] as const;

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 gold-border">
            <span className="gold-text font-black text-lg">س</span>
          </span>
          <div className="leading-tight">
            <div className="font-bold gold-text text-base">السيادة</div>
            <div className="text-[10px] text-muted-foreground">مصفوفة القوى الخمس</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="px-2.5 py-1.5 rounded-md text-xs xl:text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all whitespace-nowrap [&.active]:text-amber-400 [&.active]:bg-amber-400/5 [&.active]:border [&.active]:border-amber-400/20"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-md gold-border text-muted-foreground hover:text-foreground focus:outline-none bg-white/[0.01]"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out border-b border-border/40 overflow-hidden ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col p-4 gap-2 bg-background/95 backdrop-blur-2xl">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setIsOpen(false)}
              activeOptions={{ exact: l.to === "/" }}
              className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all [&.active]:text-amber-400 [&.active]:bg-amber-400/5 [&.active]:border [&.active]:border-amber-400/20"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
