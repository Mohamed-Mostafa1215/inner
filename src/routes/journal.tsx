import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useLocalStorage } from "@/lib/storage";
import { EXERCISES, IDENTITIES } from "@/lib/forces";
import { useState } from "react";

export const Route = createFileRoute("/journal")({ component: Journal });

interface Entry {
  id: string;
  date: string;
  mood: number; // 1-5
  dog: string; // which instinct showed up
  decision: string;
  reflection: string;
  exercise?: string;
  identity?: string;
}

const DOGS = ["لا شيء", "الخوف", "الغضب", "الشهوة", "الأنا/الشك"];

function Journal() {
  const [entries, setEntries] = useLocalStorage<Entry[]>("journal-entries", []);
  const [draft, setDraft] = useState<Omit<Entry, "id" | "date">>({
    mood: 3,
    dog: "لا شيء",
    decision: "",
    reflection: "",
    exercise: "",
    identity: "",
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDog, setFilterDog] = useState("الكل");
  const [filterMood, setFilterMood] = useState<number | "الكل">("الكل");
  const [showStats, setShowStats] = useState(false);

  const save = () => {
    if (!draft.reflection.trim() && !draft.decision.trim()) return;
    const entry: Entry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...draft,
    };
    setEntries([entry, ...entries]);
    setDraft({ mood: 3, dog: "لا شيء", decision: "", reflection: "", exercise: "", identity: "" });
  };

  const remove = (id: string) => setEntries(entries.filter((e) => e.id !== id));

  // 1. Stats Calculations
  const totalEntries = entries.length;
  
  // Average Mood
  const avgMood = totalEntries
    ? parseFloat((entries.reduce((sum, e) => sum + e.mood, 0) / totalEntries).toFixed(1))
    : 0;

  // Most Frequent Dog
  const dogCounts: Record<string, number> = {};
  entries.forEach((e) => {
    if (e.dog && e.dog !== "لا شيء") {
      dogCounts[e.dog] = (dogCounts[e.dog] || 0) + 1;
    }
  });
  const sortedDogs = Object.entries(dogCounts).sort((a, b) => b[1] - a[1]);
  const mostFreqDog = sortedDogs.length ? sortedDogs[0][0] : "لا شيء";

  // Most Used Exercise
  const exerciseCounts: Record<string, number> = {};
  entries.forEach((e) => {
    if (e.exercise) {
      exerciseCounts[e.exercise] = (exerciseCounts[e.exercise] || 0) + 1;
    }
  });
  const sortedExercises = Object.entries(exerciseCounts).sort((a, b) => b[1] - a[1]);
  const mostFreqExercise = sortedExercises.length ? sortedExercises[0][0] : "لا شيء";

  // 2. Apply Filters
  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.decision.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.reflection.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDog = filterDog === "الكل" || e.dog === filterDog;
    const matchesMood = filterMood === "الكل" || e.mood === filterMood;

    return matchesSearch && matchesDog && matchesMood;
  });

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black gold-text">اليوميات السيادية</h1>
          <p className="text-sm text-muted-foreground mt-1">
            رصد الاتزان اليومي، حركة الغرائز، ممارسة التمارين، واستدعاء الهويات.
          </p>
        </div>

        {/* STATS SECTION (Collapsible) */}
        <section className="card-elevated rounded-xl gold-border overflow-hidden">
          <button
            onClick={() => setShowStats(!showStats)}
            className="w-full px-5 py-4 flex items-center justify-between font-bold text-sm bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
          >
            <span>📊 إحصائيات السجل اليومي</span>
            <span className="text-amber-500">{showStats ? "إخفاء ↑" : "إظهار التفاصيل ←"}</span>
          </button>
          
          {showStats && (
            <div className="px-5 pb-5 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/20 text-center animate-fade-in">
              <div className="p-3 bg-white/[0.01] gold-border rounded-lg">
                <span className="block text-[10px] text-muted-foreground font-semibold">جلسات اليوميات</span>
                <span className="text-xl font-black gold-text tabular-nums">{totalEntries}</span>
              </div>
              <div className="p-3 bg-white/[0.01] gold-border rounded-lg">
                <span className="block text-[10px] text-muted-foreground font-semibold">متوسط المزاج</span>
                <span className="text-xl font-black text-rose-400 tabular-nums">⚡ {avgMood}</span>
              </div>
              <div className="p-3 bg-white/[0.01] gold-border rounded-lg">
                <span className="block text-[10px] text-muted-foreground font-semibold">أكثر كلب ظهوراً</span>
                <span className="text-sm font-black text-amber-500 block truncate mt-1">{mostFreqDog}</span>
              </div>
              <div className="p-3 bg-white/[0.01] gold-border rounded-lg">
                <span className="block text-[10px] text-muted-foreground font-semibold">تمرينك المفضل</span>
                <span className="text-sm font-black text-sky-400 block truncate mt-1">{mostFreqExercise}</span>
              </div>
            </div>
          )}
        </section>

        {/* JOURNAL SESSION FORM */}
        <section className="card-elevated rounded-xl p-6 gold-border space-y-4">
          <h2 className="text-xl font-bold gold-text">جلسة اليوم</h2>

          {/* Mood Select */}
          <div>
            <label className="block text-xs text-muted-foreground font-semibold mb-2">المزاج العام والاتزان اليومي</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setDraft({ ...draft, mood: v })}
                  className={`flex-1 py-2 rounded-lg text-sm font-black border transition-all ${
                    draft.mood === v
                      ? "bg-rose-500/10 border-rose-500 text-rose-400 scale-105"
                      : "bg-muted text-muted-foreground border-transparent hover:bg-muted/70"
                  }`}
                >
                  {v === 1 && "😡"}
                  {v === 2 && "😟"}
                  {v === 3 && "😐"}
                  {v === 4 && "🙂"}
                  {v === 5 && "😌"}
                </button>
              ))}
            </div>
          </div>

          {/* Dog/Instinct Select */}
          <div>
            <label className="block text-xs text-muted-foreground font-semibold mb-2">أي كلب حاول القيادة اليوم؟</label>
            <div className="flex gap-2 flex-wrap">
              {DOGS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDraft({ ...draft, dog: d })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    draft.dog === d
                      ? "bg-amber-400/10 border-amber-400 text-amber-400"
                      : "bg-muted text-muted-foreground border-transparent hover:bg-muted/70"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Practiced Select */}
          <div>
            <label className="block text-xs text-muted-foreground font-semibold mb-2">أي تمرين مارست اليوم؟</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setDraft({ ...draft, exercise: "" })}
                className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-colors truncate ${
                  draft.exercise === ""
                    ? "bg-sky-400/10 border-sky-400 text-sky-400"
                    : "bg-muted text-muted-foreground border-transparent hover:bg-muted/70"
                }`}
              >
                لا شيء
              </button>
              {EXERCISES.map((ex) => (
                <button
                  key={ex.key}
                  type="button"
                  onClick={() => setDraft({ ...draft, exercise: ex.name })}
                  className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-colors truncate ${
                    draft.exercise === ex.name
                      ? "bg-sky-400/10 border-sky-400 text-sky-400"
                      : "bg-muted text-muted-foreground border-transparent hover:bg-muted/70"
                  }`}
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>

          {/* Identity Activated Select */}
          <div>
            <label className="block text-xs text-muted-foreground font-semibold mb-2">أي هوية استدعيت اليوم؟</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setDraft({ ...draft, identity: "" })}
                className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-colors truncate ${
                  draft.identity === ""
                    ? "bg-purple-400/10 border-purple-400 text-purple-400"
                    : "bg-muted text-muted-foreground border-transparent hover:bg-muted/70"
                }`}
              >
                لا شيء
              </button>
              {IDENTITIES.map((id) => (
                <button
                  key={id.key}
                  type="button"
                  onClick={() => setDraft({ ...draft, identity: id.name })}
                  className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-colors truncate ${
                    draft.identity === id.name
                      ? "bg-purple-400/10 border-purple-400 text-purple-400"
                      : "bg-muted text-muted-foreground border-transparent hover:bg-muted/70"
                  }`}
                >
                  {id.name}
                </button>
              ))}
            </div>
          </div>

          {/* Context and Reflections inputs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground font-semibold mb-2">أهم قرار اتخذته</label>
              <input
                value={draft.decision}
                onChange={(e) => setDraft({ ...draft, decision: e.target.value })}
                placeholder="مثال: قطعت التفكير وبدأت العمل العميق..."
                className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-border/40 text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground font-semibold mb-2">تأمل أو تفريغ عاطفي</label>
              <textarea
                value={draft.reflection}
                onChange={(e) => setDraft({ ...draft, reflection: e.target.value })}
                rows={3}
                placeholder="أفرغ هنا أي ثقل شعوري أو أفكار..."
                className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-border/40 text-sm focus:border-amber-400 focus:outline-none resize-none"
              />
            </div>
          </div>

          <button
            onClick={save}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/90 transition-colors"
          >
            حفظ الجلسة في السجل
          </button>
        </section>

        {/* SEARCH AND FILTERS TOOLBAR */}
        <section className="card-elevated p-4 rounded-xl gold-border space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 ابحث في اليوميات والقرارات والتأملات..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.02] border border-border/40 text-xs focus:outline-none focus:border-amber-400"
            />
            
            <div className="flex gap-2">
              <select
                value={filterDog}
                onChange={(e) => setFilterDog(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/[0.02] border border-border/40 text-xs text-muted-foreground focus:outline-none focus:border-amber-400"
              >
                <option value="الكل">كل الكلاب</option>
                {DOGS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value === "الكل" ? "الكل" : Number(e.target.value))}
                className="px-3 py-2 rounded-lg bg-white/[0.02] border border-border/40 text-xs text-muted-foreground focus:outline-none focus:border-amber-400"
              >
                <option value="الكل">كل الأمزجة</option>
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>
                    مزاج: {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* JOURNAL LIST */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">سجل الجلسات ({filteredEntries.length})</h2>
            {(filterDog !== "الكل" || filterMood !== "الكل" || searchQuery !== "") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterDog("الكل");
                  setFilterMood("الكل");
                }}
                className="text-xs text-amber-500 hover:text-amber-400"
              >
                إلغاء التصفية
              </button>
            )}
          </div>

          {filteredEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10 card-elevated rounded-xl">
              لا توجد جلسات تطابق خيارات التصفية الحالية.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((e) => (
                <article key={e.id} className="card-elevated rounded-xl p-5 gold-border relative">
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(e.date).toLocaleString("ar-EG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    <button
                      onClick={() => remove(e.id)}
                      className="text-xs text-red-500 hover:text-red-400"
                    >
                      حذف الجلسة
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[10px] mb-3 font-semibold">
                    <span className="gold-border px-2.5 py-1 rounded bg-white/[0.01]">مزاج: {e.mood}/5</span>
                    <span className="gold-border px-2.5 py-1 rounded bg-white/[0.01] text-amber-500">كلب: {e.dog}</span>
                    {e.exercise && (
                      <span className="gold-border px-2.5 py-1 rounded bg-white/[0.01] text-sky-400">التمرين: {e.exercise}</span>
                    )}
                    {e.identity && (
                      <span className="gold-border px-2.5 py-1 rounded bg-white/[0.01] text-purple-400 font-bold">الهوية: {e.identity}</span>
                    )}
                  </div>

                  <div className="space-y-2.5 text-sm pt-2 border-t border-border/10">
                    {e.decision && (
                      <p className="leading-relaxed">
                        <strong className="text-amber-500 ml-1">القرار:</strong> {e.decision}
                      </p>
                    )}
                    {e.reflection && (
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        <strong className="text-foreground block mb-1">تأمل وتفريغ:</strong>
                        {e.reflection}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
}
