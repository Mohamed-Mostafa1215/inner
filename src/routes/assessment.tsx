import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { FORCES, type ForceKey } from "@/lib/forces";
import { useLocalStorage } from "@/lib/storage";
import { useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/assessment")({ component: Assessment });

interface Question {
  text: string;
  force: ForceKey;
}

const QUESTIONS: Question[] = [
  // Intuition (2)
  { force: "intuition", text: "أثق في إحساسي الأول قبل أن أحلل." },
  { force: "intuition", text: "ألتقط دوافع الناس بسرعة دون أدلة كثيرة." },
  { force: "intuition", text: "أعرف الاتجاه الصحيح حتى لو لم أملك كل البيانات." },
  { force: "intuition", text: "أحس بتغير الطاقة في الأماكن والأشخاص فوراً." },
  { force: "intuition", text: "أعرف النتيجة قبل أن تظهر البيانات." },
  
  // Will (1)
  { force: "will", text: "إذا قررت شيئًا، أنفّذه في نفس الجلسة." },
  { force: "will", text: "أكمل المهام الثقيلة حتى لو فقدت الحماس." },
  { force: "will", text: "أستطيع الصمت وقت الانفعال." },
  { force: "will", text: "أبدأ المهام الصعبة دون انتظار الحافز." },
  { force: "will", text: "أختار الألم القصير على الراحة الطويلة." },
  
  // Intellect (5)
  { force: "intellect", text: "أولّد عدة بدائل أمام أي عقبة." },
  { force: "intellect", text: "أتعلم من أخطائي وأعدّل خطتي بسرعة." },
  { force: "intellect", text: "أناور بدلًا من الصدام عند الحاجة." },
  { force: "intellect", text: "أرى حلولاً حيث يرى غيري طريقاً مسدوداً." },
  { force: "intellect", text: "أغيّر خطتي بسرعة عندما تتغير المعطيات." },
  
  // Emotion (6)
  { force: "emotion", text: "أعبّر عن مشاعري بوعي بدلًا من كبتها." },
  { force: "emotion", text: "لدي قنوات منتظمة لتفريغ العاطفة." },
  { force: "emotion", text: "أربط ما أفعله بمعنى أكبر." },
  { force: "emotion", text: "أستطيع البكاء أو التأثر دون خجل عند الحاجة." },
  { force: "emotion", text: "أربط عملي برسالة أكبر مني." },
  
  // Instinct (4)
  { force: "instinct", text: "لا يقودني الغضب لقرارات أندم عليها." },
  { force: "instinct", text: "أنتظر قبل الرد عند استفزازي." },
  { force: "instinct", text: "أتحكم في رغباتي اللحظية." },
  { force: "instinct", text: "أميّز بين صوت الحدس وصوت الخوف." },
  { force: "instinct", text: "أقاوم إغراء الراحة المفرطة يومياً." },
];

interface AssessmentHistoryItem {
  id: string;
  date: string;
  scores: Record<ForceKey, number>;
}

function Assessment() {
  const [answers, setAnswers] = useLocalStorage<Record<number, number>>(
    "assessment-answers",
    {}
  );
  
  const [history, setHistory] = useLocalStorage<AssessmentHistoryItem[]>(
    "assessment-history",
    []
  );

  const [compareId, setCompareId] = useState<string | null>(null);

  const set = (i: number, v: number) => setAnswers({ ...answers, [i]: v });

  // Calculate totals and averages
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

  const forceScores = FORCES.map((f) => {
    const t = totals[f.key];
    const avg = t.count ? parseFloat((t.sum / t.count).toFixed(2)) : 0;
    return {
      key: f.key,
      name: f.name,
      score: avg,
      color: f.color,
      number: f.number,
    };
  });

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  // Find highest and lowest scoring forces
  const sortedScores = [...forceScores].sort((a, b) => b.score - a.score);
  const highestForce = sortedScores[0];
  const lowestForce = sortedScores[sortedScores.length - 1];

  // Suggest identity based on scores
  let suggestedIdentity = "عقل المحارب";
  let identityFormula = "الإرادة (1) + ترويض الغرائز (4)";
  let identityReason = "نظراً لتقارب مستويات الإرادة والغرائز المروضة لديك.";

  const willScore = totals.will.count ? totals.will.sum / totals.will.count : 0;
  const intuitionScore = totals.intuition.count ? totals.intuition.sum / totals.intuition.count : 0;
  const intellectScore = totals.intellect.count ? totals.intellect.sum / totals.intellect.count : 0;
  const emotionScore = totals.emotion.count ? totals.emotion.sum / totals.emotion.count : 0;

  if (intuitionScore > 3.5 && willScore > 3.5) {
    suggestedIdentity = "القائد";
    identityFormula = "الحدس (2) + الإرادة (1) + ذكاء اجتماعي (5)";
    identityReason = "لديك توازن ممتاز بين الرؤية الداخلية (الحدس) والحسم التنفيذي (الإرادة).";
  } else if (intellectScore > highestForce.score - 0.5) {
    suggestedIdentity = "صانع المشروع";
    identityFormula = "الذكاء (5) في خدمة الحدس (2) + تحييد المزاج";
    identityReason = "تتمتع بذكاء تحليلي ومرونة عالية تؤهلك لإدارة وتصميم الحلول بكفاءة.";
  } else if (emotionScore > highestForce.score - 0.5) {
    suggestedIdentity = "الروحي العملي";
    identityFormula = "العاطفة (6) تحت رقابة الحدس (2)";
    identityReason = "تتمتع بعمق عاطفي ووجداني كبير يمنح أعمالك معنى ورسالة أعمق.";
  }

  // Suggest exercises to strengthen lowest force
  let recommendations: string[] = [];
  if (lowestForce.key === "intuition") {
    recommendations = [
      "ممارسة بروتوكول الصباح (10 دقائق صمت رقمي لتصفية البوصلة).",
      "تطبيق تمرين القرار الأول في الخيارات اليومية البسيطة.",
    ];
  } else if (lowestForce.key === "will") {
    recommendations = [
      "تطبيق قاعدة الـ 5 ثوانٍ لكسر الاحتكاك والتسويف.",
      "ممارسة تمرين المقاومة المتعمدة (دش بارد أو تمرين شاق وقت الكسل).",
    ];
  } else if (lowestForce.key === "intellect") {
    recommendations = [
      "استخدام تمرين البدائل الثلاثة أمام عقبات العمل اليومية.",
      "تنظيم جلسات عمل عميق (Deep Work) لمدة 90 دقيقة بلا مشتتات.",
    ];
  } else if (lowestForce.key === "emotion") {
    recommendations = [
      "تطبيق تمرين تفريغ العمق (الكتابة العشوائية أو التسجيل الصوتي السيال).",
      "ربط مهامك اليومية بهدف ورسالة أسمى من الذات.",
    ];
  } else if (lowestForce.key === "instinct") {
    recommendations = [
      "تطبيق قاعدة الـ 10 دقائق عند التعرض لأي استفزاز أو رغبة عاجلة.",
      "رصد وتسمية الوحوش الأربعة (الخوف، الغضب، الشهوة، الأنا) فور ظهورها.",
    ];
  }

  // Save current scores to history
  const saveToHistory = () => {
    const scoresRecord: Record<ForceKey, number> = {
      intuition: 0,
      will: 0,
      intellect: 0,
      emotion: 0,
      instinct: 0,
    };
    forceScores.forEach((f) => {
      scoresRecord[f.key] = f.score;
    });

    const newItem: AssessmentHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      scores: scoresRecord,
    };

    setHistory([newItem, ...history]);
    alert("تم حفظ النتيجة الحالية بنجاح في السجل.");
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("هل تريد حذف هذا التقييم من السجل؟")) {
      setHistory(history.filter((h) => h.id !== id));
      if (compareId === id) setCompareId(null);
    }
  };

  const radarData = forceScores.map((fs) => {
    const compared = history.find((h) => h.id === compareId);
    return {
      force: fs.name,
      "التقييم الحالي": fs.score,
      ...(compared ? { "التقييم المقارن": compared.scores[fs.key] } : {}),
      fullMark: 5,
    };
  });

  const resetAnswers = () => {
    if (confirm("هل تريد مسح جميع الإجابات الحالية لبدء تقييم جديد؟")) {
      setAnswers({});
      setCompareId(null);
    }
  };

  return (
    <Shell>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black gold-text">تقييم القوى الخمس</h1>
            <p className="text-sm text-muted-foreground mt-1">
              قيّم كل عبارة من 1 (ضعيف) إلى 5 (سيادة كاملة) لمعايرة المصفوفة النفسية.
            </p>
          </div>
          <button
            onClick={resetAnswers}
            className="px-4 py-2 rounded-lg gold-border text-xs text-muted-foreground hover:text-foreground transition-all"
          >
            إعادة ضبط التقييم
          </button>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Questions List */}
          <div className="md:col-span-3 space-y-3">
            {QUESTIONS.map((q, i) => {
              const f = FORCES.find((x) => x.key === q.force)!;
              return (
                <div key={i} className="card-elevated rounded-xl p-4 gold-border">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm leading-relaxed font-medium">{q.text}</p>
                    <span className="text-[10px] text-primary bg-white/[0.03] gold-border px-2 py-0.5 rounded whitespace-nowrap">
                      {f.name} ({f.number})
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        onClick={() => set(i, v)}
                        className={`flex-1 py-2 rounded text-xs sm:text-sm font-semibold transition-all ${
                          answers[i] === v
                            ? `text-white bg-gradient-to-br ${f.color} scale-105 shadow-md`
                            : "bg-muted text-muted-foreground hover:bg-muted/70"
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

          {/* Radar & Interpretation Results */}
          <div className="md:col-span-2 space-y-6">
            {/* Visual Chart Card */}
            <div className="card-elevated p-6 rounded-2xl gold-border sticky top-4 flex flex-col items-center">
              <h2 className="text-xl font-black mb-4 gold-text w-full">خريطة القوى الحالية</h2>

              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis dataKey="force" tick={{ fill: "#aaa", fontSize: 11, fontWeight: "bold" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: "#555" }} />
                    <Radar
                      name="الحالي"
                      dataKey="التقييم الحالي"
                      stroke="#d4a843"
                      fill="#d4a843"
                      fillOpacity={0.25}
                    />
                    {compareId && (
                      <Radar
                        name="المقارن"
                        dataKey="التقييم المقارن"
                        stroke="#f43f5e"
                        fill="#f43f5e"
                        fillOpacity={0.15}
                      />
                    )}
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {!allAnswered && (
                <div className="text-center text-xs text-muted-foreground mt-2">
                  أجبت على {Object.keys(answers).length} من {QUESTIONS.length} أسئلة.
                </div>
              )}

              {allAnswered && (
                <button
                  onClick={saveToHistory}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-300 to-yellow-600 text-black font-bold text-xs hover:from-amber-200 hover:to-yellow-500 transition-all shadow-md shadow-amber-500/10"
                >
                  حفظ هذه النتيجة في السجل
                </button>
              )}
            </div>

            {/* Interpretation Card */}
            {allAnswered && (
              <div className="card-elevated p-6 rounded-2xl gold-border space-y-4 animate-fade-in">
                <h3 className="text-lg font-bold gold-text">التحليل الإستراتيجي للمصفوفة</h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <div className="text-emerald-400 font-bold mb-1">أقوى قواك:</div>
                    <div className="font-black text-sm">{highestForce.name} ({highestForce.score})</div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                    <div className="text-red-400 font-bold mb-1">أضعف قواك:</div>
                    <div className="font-black text-sm">{lowestForce.name} ({lowestForce.score})</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] gold-border text-xs space-y-2">
                  <div>
                    <strong className="text-muted-foreground">الهوية الأنسب لك حالياً:</strong>
                    <div className="text-sm font-black gold-text mt-1">{suggestedIdentity}</div>
                    <div className="text-[10px] text-primary font-mono mt-0.5">{identityFormula}</div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-1">{identityReason}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-400">توصيات عملية لتقوية القوة الأضعف ({lowestForce.name}):</h4>
                  <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                    {recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-amber-500">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Assessment History */}
            {history.length > 0 && (
              <div className="card-elevated p-6 rounded-2xl gold-border space-y-4">
                <h3 className="text-lg font-bold gold-text">سجل التقييمات السابقة</h3>
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => setCompareId(compareId === h.id ? null : h.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        compareId === h.id
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                          : "bg-white/[0.01] border-border/20 hover:bg-white/[0.02]"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-foreground">{h.date}</div>
                        <div className="text-[10px] text-muted-foreground mt-1 flex flex-wrap gap-2">
                          {FORCES.map((f) => (
                            <span key={f.key}>
                              {f.name}: {h.scores[f.key]}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteHistoryItem(h.id, e)}
                        className="text-xs text-red-500 hover:text-red-400"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
