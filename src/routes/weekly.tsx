import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { WEEKLY_SCHEDULE, FORCES } from "@/lib/forces";
import { useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/weekly")({
  component: Weekly,
});

// Helper to get start of current week (Saturday in Arabic context)
function getStartOfWeek(): string {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday
  // Saturday is day 6. We want to find the offset to the most recent Saturday.
  // if day is Saturday (6), diff is 0.
  // if day is Sunday (0), diff is 1.
  // if day is Monday (1), diff is 2.
  // ...
  // if day is Friday (5), diff is 6.
  const diff = (day + 1) % 7;
  const start = new Date(now);
  start.setDate(now.getDate() - diff);
  return start.toISOString().split("T")[0];
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function getDayOfWeekNameArabic(): string {
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  return days[new Date().getDay()];
}

function Weekly() {
  const startOfWeek = getStartOfWeek();
  const today = getTodayString();
  const todayNameArabic = getDayOfWeekNameArabic();

  // Store completions keyed by startOfWeek date + dayName + taskIndex
  // e.g., "2026-05-23:يوم المحارب — الأحد:0" -> true
  const [completions, setCompletions] = useLocalStorage<Record<string, boolean>>("weekly-log", {});

  const toggleTask = (dayName: string, index: number) => {
    const key = `${startOfWeek}:${dayName}:${index}`;
    setCompletions({
      ...completions,
      [key]: !completions[key],
    });
  };

  const getDayProgress = (dayName: string, totalTasks: number) => {
    let completed = 0;
    for (let i = 0; i < totalTasks; i++) {
      if (completions[`${startOfWeek}:${dayName}:${i}`]) {
        completed++;
      }
    }
    return { completed, total: totalTasks, percent: totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0 };
  };

  const resetWeek = () => {
    if (confirm("هل تريد إعادة ضبط جميع مهام هذا الأسبوع؟")) {
      const updated = { ...completions };
      // Delete keys for this week
      Object.keys(updated).forEach((key) => {
        if (key.startsWith(startOfWeek)) {
          delete updated[key];
        }
      });
      setCompletions(updated);
    }
  };

  return (
    <Shell>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black gold-text">الجدول الأسبوعي التخصصي</h1>
            <p className="text-sm text-muted-foreground mt-1">
              مهام وممارسات يومية موزعة على الهويات الأربع لصيانة قواك الخمس.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">أسبوع: {startOfWeek}</span>
            <button
              onClick={resetWeek}
              className="px-3.5 py-1.5 rounded-lg gold-border text-xs text-muted-foreground hover:text-foreground transition-all"
            >
              إعادة ضبط الأسبوع
            </button>
          </div>
        </div>

        {/* 7 Days Grid */}
        <div className="space-y-6">
          {WEEKLY_SCHEDULE.map((day) => {
            const isToday = day.name.includes(todayNameArabic);
            const progress = getDayProgress(day.name, day.tasks.length);

            // Styling colors based on day identity
            let typeColor = "from-orange-400 to-red-500 shadow-orange-500/5";
            let typeLabel = "هوية المحارب / الصانع";
            if (day.dayType === "leader") {
              typeColor = "from-amber-300 to-yellow-500 shadow-yellow-500/5";
              typeLabel = "هوية القائد";
            } else if (day.dayType === "sage") {
              typeColor = "from-rose-400 to-fuchsia-500 shadow-rose-500/5";
              typeLabel = "هوية الروحي العملي";
            }

            return (
              <article
                key={day.name}
                className={`card-elevated rounded-2xl p-6 gold-border relative overflow-hidden transition-all duration-300 ${
                  isToday ? "ring-2 ring-amber-400/50 bg-white/[0.03]" : ""
                }`}
              >
                {/* Ribbon for today */}
                {isToday && (
                  <div className="absolute top-0 left-0 px-4 py-1 text-[10px] font-bold text-black bg-gradient-to-r from-amber-300 to-yellow-500 rounded-br-xl select-none">
                    اليوم الحالي
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Info Column */}
                  <div className="space-y-3 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${typeColor}`}>
                        {typeLabel}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        التركيز: {day.focus}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-foreground">{day.name}</h2>

                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-xs text-muted-foreground ml-1">القوى المفعلة:</span>
                      {day.forcesFocus.map((fKey) => {
                        const force = FORCES.find((x) => x.key === fKey);
                        return force ? (
                          <span
                            key={fKey}
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white bg-gradient-to-r ${force.color}`}
                          >
                            {force.name} ({force.number})
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Progress Ring / Percent Column */}
                  <div className="flex items-center gap-4 border-t md:border-t-0 md:border-r border-border/20 pt-4 md:pt-0 md:pr-6 shrink-0 justify-between">
                    <div>
                      <div className="text-sm font-bold text-foreground">المهام المنجزة</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {progress.completed} من {progress.total} مهام
                      </div>
                    </div>
                    <div className="text-3xl font-black gold-text tabular-nums">{progress.percent}%</div>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="mt-6 pt-5 border-t border-border/20 space-y-3">
                  {day.tasks.map((task, idx) => {
                    const isCompleted = !!completions[`${startOfWeek}:${day.name}:${idx}`];
                    return (
                      <label
                        key={idx}
                        className={`flex items-start gap-4 p-3.5 rounded-xl cursor-pointer border transition-all ${
                          isCompleted
                            ? "bg-emerald-500/5 border-emerald-500/20 text-muted-foreground"
                            : "bg-white/[0.01] border-border/20 hover:bg-white/[0.02]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => toggleTask(day.name, idx)}
                          className="mt-0.5 accent-emerald-500 w-4 h-4 rounded"
                        />
                        <span className="text-sm leading-relaxed">{task}</span>
                      </label>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
