import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { EXERCISES, FORCES } from "@/lib/forces";
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/exercises")({ component: Exercises });

interface ExerciseLogItem {
  exerciseKey: string;
  date: string;
}

function Exercises() {
  const [log, setLog] = useLocalStorage<ExerciseLogItem[]>("exercise-log", []);

  const logPractice = (exerciseKey: string) => {
    const newItem: ExerciseLogItem = {
      exerciseKey,
      date: new Date().toISOString(),
    };
    setLog([...log, newItem]);
  };

  const getPracticeCount = (exerciseKey: string) => {
    return log.filter((item) => item.exerciseKey === exerciseKey).length;
  };

  return (
    <Shell>
      <h1 className="text-3xl font-black mb-1 gold-text">التمارين العملية</h1>
      <p className="text-muted-foreground mb-8">
        أدوات تشغيلية لبناء العضلات النفسية وصيانة القوى الخمس. التكرار اليومي هو مفتاح السيادة.
      </p>

      {/* Timers */}
      <div className="space-y-4 mb-8">
        <FiveSecondTimer onComplete={() => logPractice("five-seconds")} />
        <TenMinuteTimer onComplete={() => logPractice("ten-minutes")} />
      </div>

      {/* Exercise Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {EXERCISES.map((ex) => {
          const f = FORCES.find((x) => x.key === ex.force)!;
          const count = getPracticeCount(ex.key);
          
          return (
            <article key={ex.key} className="card-elevated rounded-xl p-5 gold-border flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{ex.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">{ex.duration}</span>
                      {count > 0 && (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/20">
                          🔥 مارسته {count} {count === 1 ? "مرة" : count === 2 ? "مرتين" : "مرات"}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] text-white font-bold bg-gradient-to-r ${f.color} px-2.5 py-1 rounded whitespace-nowrap`}>
                    {f.name} ({f.number})
                  </span>
                </div>
                
                <p className="text-sm mb-4 leading-relaxed text-muted-foreground">{ex.description}</p>
                
                <ol className="space-y-2 text-sm text-foreground leading-relaxed mb-6">
                  {ex.steps.map((st, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-amber-500 font-bold shrink-0">{i + 1}.</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-t border-border/20 pt-4 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">صيانة {f.name}</span>
                <button
                  onClick={() => logPractice(ex.key)}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors shadow-md"
                >
                  تم التمرين ✓
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </Shell>
  );
}

function FiveSecondTimer({ onComplete }: { onComplete: () => void }) {
  const [secs, setSecs] = useState(5);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (secs <= 0) {
      setRunning(false);
      onComplete();
      return;
    }
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, secs]);

  return (
    <div className="card-elevated rounded-xl p-6 gold-border">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold">قاعدة الـ 5 ثوانٍ</h2>
          <p className="text-sm text-muted-foreground">عد تنازلي ثم ابدأ الحركة فورًا. اقطع مسارات الهروب.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-black gold-text tabular-nums">{secs > 0 ? secs : "انطلق!"}</div>
          <button
            onClick={() => {
              setSecs(5);
              setRunning(true);
            }}
            className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium"
          >
            ابدأ العد
          </button>
        </div>
      </div>
    </div>
  );
}

function TenMinuteTimer({ onComplete }: { onComplete: () => void }) {
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (secs >= 600) {
      setRunning(false);
      onComplete();
      return;
    }
    const t = setTimeout(() => setSecs((s) => s + 1), 1000);
    return () => clearTimeout(t);
  }, [running, secs]);

  const mm = String(Math.floor((600 - secs) / 60)).padStart(2, "0");
  const ss = String((600 - secs) % 60).padStart(2, "0");
  const pct = (secs / 600) * 100;

  return (
    <div className="card-elevated rounded-xl p-6 gold-border">
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
