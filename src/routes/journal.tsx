import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useLocalStorage } from "@/lib/storage";
import { useState } from "react";

export const Route = createFileRoute("/journal")({ component: Journal });

interface Entry {
  id: string;
  date: string;
  mood: number; // 1-5
  dog: string; // which instinct showed up
  decision: string;
  reflection: string;
}

const DOGS = ["لا شيء", "الخوف", "الغضب", "الشهوة", "الأنا/الشك"];

function Journal() {
  const [entries, setEntries] = useLocalStorage<Entry[]>("journal-entries", []);
  const [draft, setDraft] = useState<Omit<Entry, "id" | "date">>({
    mood: 3,
    dog: "لا شيء",
    decision: "",
    reflection: "",
  });

  const save = () => {
    if (!draft.reflection.trim() && !draft.decision.trim()) return;
    const entry: Entry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...draft,
    };
    setEntries([entry, ...entries]);
    setDraft({ mood: 3, dog: "لا شيء", decision: "", reflection: "" });
  };

  const remove = (id: string) => setEntries(entries.filter((e) => e.id !== id));

  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-1">اليوميات</h1>
      <p className="text-muted-foreground mb-8">
        رصد المزاج، الكلب الذي ظهر، أهم قرار، وتأمل اليوم.
      </p>

      <section className="card-elevated rounded-xl p-5 mb-8">
        <h2 className="font-bold mb-4">جلسة اليوم</h2>

        <label className="block text-sm mb-2">المزاج العام</label>
        <div className="flex gap-1.5 mb-4">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => setDraft({ ...draft, mood: v })}
              className={`flex-1 py-2 rounded text-sm transition-colors ${
                draft.mood === v
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <label className="block text-sm mb-2">أي كلب حاول القيادة؟</label>
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {DOGS.map((d) => (
            <button
              key={d}
              onClick={() => setDraft({ ...draft, dog: d })}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                draft.dog === d
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <label className="block text-sm mb-2">أهم قرار اليوم</label>
        <input
          value={draft.decision}
          onChange={(e) => setDraft({ ...draft, decision: e.target.value })}
          placeholder="قرار حاسم اتخذته من البوصلة..."
          className="w-full px-3 py-2 rounded-md bg-input border border-border text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />

        <label className="block text-sm mb-2">تأمل / تفريغ</label>
        <textarea
          value={draft.reflection}
          onChange={(e) => setDraft({ ...draft, reflection: e.target.value })}
          rows={4}
          placeholder="افتح القناة دون رقابة..."
          className="w-full px-3 py-2 rounded-md bg-input border border-border text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />

        <button
          onClick={save}
          className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90"
        >
          حفظ
        </button>
      </section>

      <section>
        <h2 className="font-bold mb-4">السجل ({entries.length})</h2>
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground">لا يوجد سجل بعد.</p>
        )}
        <div className="space-y-3">
          {entries.map((e) => (
            <article key={e.id} className="card-elevated rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs text-muted-foreground">
                  {new Date(e.date).toLocaleString("ar-EG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
                <button
                  onClick={() => remove(e.id)}
                  className="text-xs text-destructive hover:underline"
                >
                  حذف
                </button>
              </div>
              <div className="flex gap-3 text-xs mb-2">
                <span className="gold-border px-2 py-0.5 rounded">مزاج: {e.mood}/5</span>
                <span className="gold-border px-2 py-0.5 rounded">كلب: {e.dog}</span>
              </div>
              {e.decision && (
                <p className="text-sm mb-1">
                  <span className="text-primary">قرار:</span> {e.decision}
                </p>
              )}
              {e.reflection && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {e.reflection}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}
