import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { EXERCISES, FORCES } from "@/lib/forces";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/exercises")({ component: Exercises });

function Exercises() {
  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-1">التمارين العملية</h1>
      <p className="text-muted-foreground mb-8">
        أدوات تشغيلية لبناء العضلات النفسية. الأهم: التكرار اليومي.
      </p>

      <FiveSecondTimer />
      <TenMinuteTimer />

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {EXERCISES.map((ex) => {
          const f = FORCES.find((x) => x.key === ex.force)!;
          return (
            <article key={ex.key} className="card-elevated rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold">{ex.name}</h3>
                <span className="text-[10px] gold-border px-2 py-1 rounded text-primary whitespace-nowrap">
                  {f.name} ({f.number})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{ex.duration}</p>
              <p className="text-sm mb-4 leading-relaxed">{ex.description}</p>
              <ol className="space-y-1.5 text-sm text-muted-foreground">
                {ex.steps.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary font-bold">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </Shell>
  );
}

function FiveSecondTimer() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (count === null) return;
    if (count <= 0) {
      const t = setTimeout(() => setCount(null), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="card-elevated rounded-xl p-6 mb-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold">قاعدة الـ 5 ثوانٍ</h2>
          <p className="text-sm text-muted-foreground">اضغط، ثم تحرّك قبل وصول الصفر.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-5xl font-black gold-text w-20 text-center tabular-nums">
            {count === null ? "5" : count > 0 ? count : "نفّذ!"}
          </div>
          <button
            onClick={() => setCount(5)}
            disabled={count !== null}
            className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-50"
          >
            ابدأ
          </button>
        </div>
      </div>
    </div>
  );
}

function TenMinuteTimer() {
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (secs >= 600) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setSecs((s) => s + 1), 1000);
    return () => clearTimeout(t);
  }, [running, secs]);

  const mm = String(Math.floor((600 - secs) / 60)).padStart(2, "0");
  const ss = String((600 - secs) % 60).padStart(2, "0");
  const pct = (secs / 600) * 100;

  return (
    <div className="card-elevated rounded-xl p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
        <div>
          <h2 className="text-xl font-bold">قاعدة الـ 10 دقائق</h2>
          <p className="text-sm text-muted-foreground">سَمِّ الكلب وانتظر. لا رد فعل قبل انتهاء العداد.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-black gold-text tabular-nums">
            {secs >= 600 ? "تم" : `${mm}:${ss}`}
          </div>
          <button
            onClick={() => {
              if (secs >= 600 || !running) {
                setSecs(0);
                setRunning(true);
              } else {
                setRunning(false);
              }
            }}
            className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium"
          >
            {running ? "إيقاف" : "ابدأ"}
          </button>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-to-l from-amber-300 to-yellow-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
