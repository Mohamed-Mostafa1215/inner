import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { PROTOCOL, FORCES } from "@/lib/forces";
import { useLocalStorage } from "@/lib/storage";
import { useState } from "react";

export const Route = createFileRoute("/protocol")({ component: Protocol });

const PHASE_META = {
  1: { label: "المرحلة 1 — تثبيت الأساس", desc: "أيام 1-20: تفعيل الحدس والتحكم السريع", color: "from-amber-300 to-yellow-500" },
  2: { label: "المرحلة 2 — تشغيل العقل الواعي", desc: "أيام 21-40: البدائل الثلاثة والتفريغ العاطفي", color: "from-sky-400 to-indigo-500" },
  3: { label: "المرحلة 3 — الدمج والسيادة", desc: "أيام 41-60: ربط النظام واختيار هوية اليوم", color: "from-rose-400 to-fuchsia-500" },
} as const;

function calculateStreak(progress: Record<number, boolean>): number {
  let longest = 0;
  let current = 0;
  for (let d = 1; d <= 60; d++) {
    if (progress[d]) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }
  return longest;
}

function Protocol() {
  const [progress, setProgress] = useLocalStorage<Record<number, boolean>>(
    "protocol-progress",
    {}
  );
  const [selectedPhase, setSelectedPhase] = useState<1 | 2 | 3>(1);

  const toggle = (day: number) => setProgress({ ...progress, [day]: !progress[day] });
  const days = PROTOCOL.filter((d) => d.phase === selectedPhase);
  const completed = Object.values(progress).filter(Boolean).length;
  const streak = calculateStreak(progress);

  // Compute current active phase based on completed days
  let activePhase: 1 | 2 | 3 = 1;
  if (completed > 40) activePhase = 3;
  else if (completed > 20) activePhase = 2;

  // Percentage for overall protocol
  const overallPct = Math.round((completed / 60) * 100);

  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header and Stats */}
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-border/20 pb-6">
          <div>
            <h1 className="text-3xl font-black gold-text">بروتوكول الـ 60 يوم</h1>
            <p className="text-sm text-muted-foreground mt-1">
              إعادة برمجة المسارات العصبية بالتكرار البنيوي وتطوير القوى الخمس.
            </p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="card-elevated px-4 py-2.5 rounded-xl gold-border text-center">
              <span className="block text-[10px] text-muted-foreground font-semibold">أيام متتالية</span>
              <span className="text-lg font-black text-orange-400 tabular-nums">🔥 {streak} أيام</span>
            </div>
            <div className="card-elevated px-4 py-2.5 rounded-xl gold-border text-center">
              <span className="block text-[10px] text-muted-foreground font-semibold">المنجز الإجمالي</span>
              <span className="text-lg font-black gold-text tabular-nums">{completed} / 60 يوم</span>
            </div>
          </div>
        </div>

        {/* Phase Progress bar */}
        <section className="card-elevated p-6 rounded-2xl gold-border">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-3">
            <span className="font-bold">المرحلة الحالية: {PHASE_META[activePhase].label}</span>
            <span className="font-semibold text-amber-500">{overallPct}% إنجاز كلي</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-l from-amber-300 to-yellow-600 transition-all duration-500"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </section>

        {/* Phase Tabs */}
        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            {([1, 2, 3] as const).map((p) => {
              const isActive = selectedPhase === p;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPhase(p)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border flex-1 text-center ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white/[0.01] border-border/20 text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
                  }`}
                >
                  {PHASE_META[p].label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground px-1">
            {PHASE_META[selectedPhase].desc}
          </p>
        </div>

        {/* Day Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map((d) => {
            const done = !!progress[d.day];
            const forceInfo = FORCES.find((x) => x.key === d.focusForce);

            return (
              <button
                key={d.day}
                onClick={() => toggle(d.day)}
                className={`text-right card-elevated rounded-xl p-5 transition-all block w-full relative overflow-hidden group ${
                  done
                    ? "border-emerald-500/30 bg-emerald-500/[0.02] shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                    : "gold-border hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-semibold">يوم {d.day}</span>
                  <span
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                      done
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-muted-foreground group-hover:border-amber-400"
                    }`}
                  >
                    {done ? "✓" : ""}
                  </span>
                </div>

                {/* Focus badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {forceInfo && (
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold text-white bg-gradient-to-r ${forceInfo.color}`}
                    >
                      {forceInfo.name} ({forceInfo.number})
                    </span>
                  )}
                  {d.identity && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold gold-border text-amber-500 bg-white/[0.01]">
                      {d.identity}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm mb-3 group-hover:text-amber-400 transition-colors">
                  {d.title}
                </h3>

                <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed border-t border-border/20 pt-3">
                  {d.tasks.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-amber-500 shrink-0">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
