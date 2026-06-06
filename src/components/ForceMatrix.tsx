import { FORCES } from "@/lib/forces";
import { useState } from "react";

const POSITIONS: Record<
  string,
  { top: string; left: string; mTop: string; mLeft: string }
> = {
  intuition: { top: "50%", left: "50%", mTop: "50%", mLeft: "50%" },
  will: { top: "12%", left: "72%", mTop: "8%", mLeft: "70%" },
  intellect: { top: "12%", left: "28%", mTop: "8%", mLeft: "30%" },
  emotion: { top: "88%", left: "72%", mTop: "92%", mLeft: "70%" },
  instinct: { top: "88%", left: "28%", mTop: "92%", mLeft: "30%" },
};

const RELATIONS: Record<string, string> = {
  will: "يقود ← ينفّذ",
  intellect: "يخدم الرؤية",
  emotion: "يُفرَّغ بوعي",
  instinct: "تُروَّض",
};

export function ForceMatrix() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="card-elevated rounded-2xl p-6 sm:p-8 my-8">
      <div className="relative w-full aspect-square max-w-lg mx-auto">
        {/* Connection lines */}
        <ConnectionLines active={active} />

        {/* Force nodes */}
        {FORCES.map((f) => {
          const pos = POSITIONS[f.key];
          const isCenter = f.key === "intuition";
          const isActive = active === f.key;

          return (
            <button
              key={f.key}
              onMouseEnter={() => setActive(f.key)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === f.key ? null : f.key)}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-300 focus:outline-none"
              style={{ top: pos.top, left: pos.left }}
            >
              {/* Circle */}
              <div
                className={`
                  flex items-center justify-center rounded-full font-black text-white
                  transition-all duration-300
                  ${isCenter ? "w-20 h-20 sm:w-28 sm:h-28 text-3xl sm:text-5xl" : "w-14 h-14 sm:w-20 sm:h-20 text-xl sm:text-3xl"}
                  bg-gradient-to-br ${f.color}
                  ${isCenter ? "animate-pulse-slow shadow-[0_0_40px_rgba(212,168,67,0.35)]" : ""}
                  ${isActive && !isCenter ? "scale-110 shadow-[0_0_30px_rgba(212,168,67,0.3)]" : ""}
                  ${!isActive && !isCenter ? "opacity-80 hover:opacity-100" : ""}
                `}
              >
                {f.number}
              </div>

              {/* Name */}
              <span
                className={`text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isActive ? "gold-text" : "text-muted-foreground"
                }`}
              >
                {f.name}
              </span>

              {/* Role tooltip */}
              {isActive && !isCenter && (
                <span className="text-[10px] sm:text-xs text-primary px-2 py-0.5 rounded-full gold-border bg-background/80 backdrop-blur whitespace-nowrap animate-fade-in">
                  {RELATIONS[f.key]}
                </span>
              )}

              {/* Center role */}
              {isCenter && (
                <span className="text-[10px] sm:text-xs text-primary font-medium">
                  {f.role}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border/30 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
        {FORCES.map((f) => (
          <span key={f.key} className="flex items-center gap-1.5">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-br ${f.color}`}
            />
            <span>
              {f.name} ({f.number}) — {f.role}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ConnectionLines({ active }: { active: string | null }) {
  return (
    <>
      {/* Lines from center (intuition) to each outer force */}
      {(["will", "intellect", "emotion", "instinct"] as const).map((key) => {
        const pos = POSITIONS[key];
        const isHighlighted = active === key || active === "intuition";

        return (
          <div
            key={key}
            className={`absolute top-1/2 left-1/2 origin-top-left transition-opacity duration-300 ${
              isHighlighted ? "opacity-60" : "opacity-15"
            }`}
            style={{
              width: "1px",
              height: `${Math.sqrt(
                Math.pow(parseFloat(pos.top) - 50, 2) +
                  Math.pow(parseFloat(pos.left) - 50, 2)
              )}%`,
              transform: `rotate(${Math.atan2(
                parseFloat(pos.top) - 50,
                parseFloat(pos.left) - 50
              ) * (180 / Math.PI) - 90}deg)`,
              background: isHighlighted
                ? "linear-gradient(to bottom, #f5c542, transparent)"
                : "linear-gradient(to bottom, #666, transparent)",
            }}
          />
        );
      })}
    </>
  );
}
