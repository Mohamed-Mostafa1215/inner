import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { FORCES, type ForceKey } from "@/lib/forces";
import { useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/assessment")({ component: Assessment });

interface Question {
  text: string;
  force: ForceKey;
}

const QUESTIONS: Question[] = [
  { force: "intuition", text: "أثق في إحساسي الأول قبل أن أحلل." },
  { force: "intuition", text: "ألتقط دوافع الناس بسرعة دون أدلة كثيرة." },
  { force: "intuition", text: "أعرف الاتجاه الصحيح حتى لو لم أملك كل البيانات." },
  { force: "will", text: "إذا قررت شيئًا، أنفّذه في نفس الجلسة." },
  { force: "will", text: "أكمل المهام الثقيلة حتى لو فقدت الحماس." },
  { force: "will", text: "أستطيع الصمت وقت الانفعال." },
  { force: "intellect", text: "أولّد عدة بدائل أمام أي عقبة." },
  { force: "intellect", text: "أتعلم من أخطائي وأعدّل خطتي بسرعة." },
  { force: "intellect", text: "أناور بدلًا من الصدام عند الحاجة." },
  { force: "emotion", text: "أعبّر عن مشاعري بوعي بدلًا من كبتها." },
  { force: "emotion", text: "لدي قنوات منتظمة لتفريغ العاطفة." },
  { force: "emotion", text: "أربط ما أفعله بمعنى أكبر." },
  { force: "instinct", text: "لا يقودني الغضب لقرارات أندم عليها." },
  { force: "instinct", text: "أنتظر قبل الرد عند استفزازي." },
  { force: "instinct", text: "أتحكم في رغباتي اللحظية." },
];

export default function Assessment() {
  const [answers, setAnswers] = useLocalStorage<Record<number, number>>(
    "assessment-answers",
    {},
  );

  const set = (i: number, v: number) => setAnswers({ ...answers, [i]: v });

  const totals: Record<ForceKey, { sum: number; count: number }> = {
    intuition: { sum: 0, count: 0 },
    will: { sum: 0, count: 0 },
    intellect: { sum: 0, count: 0 },
    emotion: { sum: 0, count: 0 },
    instinct: { sum: 0, count: 0 },
  };
  QUESTIONS.forEach((q, i) => {
    const v = answers[i];
    if (typeof v === "number") {
      totals[q.force].sum += v;
      totals[q.force].count += 1;
    }
  });

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  return (
    <Shell>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">تقييم القوى الخمس</h1>
        <p className="text-muted-foreground mb-8">
          قيّم كل عبارة من 1 (ضعيف) إلى 5 (سيادة كاملة). النتائج تُحفظ تلقائيًا.
        </p>

        <div className="space-y-3">
          {QUESTIONS.map((q, i) => {
            const f = FORCES.find((x) => x.key === q.force)!;
            return (
              <div key={i} className="card-elevated rounded-lg p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-sm leading-relaxed">{q.text}</p>
                  <span className="text-[10px] text-primary whitespace-nowrap">
                    {f.name} ({f.number})
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => set(i, v)}
                      className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                        answers[i] === v
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/70 text-muted-foreground"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <section className="mt-10 card-elevated rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">نتيجتك</h2>
          {!allAnswered && (
            <p className="text-sm text-muted-foreground mb-4">
              أجبت على {Object.keys(answers).length} من {QUESTIONS.length} — النتيجة تتحدّث مع كل إجابة.
            </p>
          )}
          <div className="space-y-3">
            {FORCES.map((f) => {
              const t = totals[f.key];
              const avg = t.count ? t.sum / t.count : 0;
              const pct = (avg / 5) * 100;
              return (
                <div key={f.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      <span className="text-primary font-bold">{f.number}</span> · {f.name}
                    </span>
                    <span className="text-muted-foreground">
                      {avg.toFixed(1)} / 5
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-l ${f.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </Shell>
  );
}
