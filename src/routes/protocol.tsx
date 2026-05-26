import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { PROTOCOL } from "@/lib/forces";
import { useLocalStorage } from "@/lib/storage";
import { useState } from "react";

export const Route = createFileRoute("/protocol")({ component: Protocol });

const PHASE_META = {
  1: { label: "المرحلة 1 — تثبيت الأساس", color: "from-amber-300 to-yellow-500" },
  2: { label: "المرحلة 2 — الذكاء الاستراتيجي", color: "from-sky-400 to-indigo-500" },
  3: { label: "المرحلة 3 — الدمج والسيادة", color: "from-rose-400 to-fuchsia-500" },
} as const;

function Protocol() {
  const [progress, setProgress] = useLocalStorage<Record<number, boolean>>(
    "protocol-progress",
    {},
  );
  const [selectedPhase, setSelectedPhase] = useState<1 | 2 | 3>(1);

  const toggle = (day: number) => setProgress({ ...progress, [day]: !progress[day] });
  const days = PROTOCOL.filter((d) => d.phase === selectedPhase);
  const completed = Object.values(progress).filter(Boolean).length;

  return (
    <Shell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">بروتوكول الـ 60 يوم</h1>
          <p className="text-muted-foreground">إعادة برمجة المسارات العصبية بالتكرار البنيوي.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          أكملت <span className="text-primary font-bold">{completed}</span> / 60
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {([1, 2, 3] as const).map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPhase(p)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPhase === p
                ? "bg-primary text-primary-foreground"
                : "gold-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {PHASE_META[p].label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {days.map((d) => {
          const done = !!progress[d.day];
          return (
            <button
              key={d.day}
              onClick={() => toggle(d.day)}
              className={`text-right card-elevated rounded-lg p-4 transition-all ${
                done ? "ring-1 ring-primary/60" : "opacity-90 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">يوم {d.day}</span>
                <span
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                    done ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                  }`}
                >
                  {done ? "✓" : ""}
                </span>
              </div>
              <h3 className="font-bold mb-2 text-sm">{d.title}</h3>
              <ul className="space-y-1 text-xs text-muted-foreground leading-relaxed">
                {d.tasks.map((t, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-primary">·</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </Shell>
  );
}
