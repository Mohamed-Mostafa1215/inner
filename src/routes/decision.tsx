import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useLocalStorage } from "@/lib/storage";
import { useState, useEffect } from "react";
import type { DecisionRecord } from "@/lib/forces";

export const Route = createFileRoute("/decision")({
  component: Decision,
});

const STEPS = [
  { num: 2, name: "المسح الحدسي", desc: "البوصلة الداخلية" },
  { num: 5, name: "اختبار البدائل", desc: "العقل التحليلي" },
  { num: 4, name: "فلترة الغرائز", desc: "ترويض الكلاب" },
  { num: 1, name: "التنفيذ الحاسم", desc: "سلاح الإرادة" },
  { num: 6, name: "المراقبة", desc: "الوقود الروحي" },
];

function Decision() {
  const [records, setRecords] = useLocalStorage<DecisionRecord[]>("decision-records", []);
  const [currentStep, setCurrentStep] = useState(0);

  // Wizard state
  const [context, setContext] = useState("");
  const [intuitionScan, setIntuitionScan] = useState("");
  const [alternative1, setAlternative1] = useState("");
  const [alternative2, setAlternative2] = useState("");
  const [alternative3, setAlternative3] = useState("");
  const [activeInstinct, setActiveInstinct] = useState("لا شيء");
  const [firstAction, setFirstAction] = useState("");
  const [emotionalImpact, setEmotionalImpact] = useState(3);

  // Countdown timer for Step 4
  const [timerSecs, setTimerSecs] = useState(5);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    if (!timerActive) return;
    if (timerSecs <= 0) {
      setTimerActive(false);
      setTimerDone(true);
      return;
    }
    const t = setTimeout(() => setTimerSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timerSecs]);

  const startTimer = () => {
    setTimerSecs(5);
    setTimerActive(true);
    setTimerDone(false);
  };

  const handleNext = () => {
    if (currentStep === 3 && firstAction.trim() !== "" && !timerDone && !timerActive) {
      // Auto-trigger timer on entering or confirming step 4
      startTimer();
      return;
    }
    setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const resetForm = () => {
    setContext("");
    setIntuitionScan("");
    setAlternative1("");
    setAlternative2("");
    setAlternative3("");
    setActiveInstinct("لا شيء");
    setFirstAction("");
    setEmotionalImpact(3);
    setTimerSecs(5);
    setTimerActive(false);
    setTimerDone(false);
    setCurrentStep(0);
  };

  const handleSubmit = () => {
    const newRecord: DecisionRecord = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      context: context.trim() || "قرار عام",
      intuitionScan,
      alternatives: [alternative1, alternative2, alternative3].filter(Boolean),
      activeInstinct,
      firstAction,
      emotionalImpact,
    };

    setRecords([newRecord, ...records]);
    resetForm();
  };

  return (
    <Shell>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-1 gold-text">بروتوكول القرار المتكامل</h1>
        <p className="text-sm text-muted-foreground mb-8">
          أداة تشغيلية لربط قواك الخمس في قرار سيادي واحد متناغم ومدروس.
        </p>

        {/* Setup Context */}
        {currentStep === 0 && context.trim() === "" && (
          <div className="card-elevated p-6 rounded-xl gold-border mb-8 animate-fade-in">
            <h2 className="text-xl font-bold mb-3">ما هو موضوع القرار الحالي؟</h2>
            <p className="text-xs text-muted-foreground mb-4">
              اكتب سياق القرار باختصار (مثال: الاستقالة وبدء مشروع خاص، شراء أصول معينة، مواجهة شخص...)
            </p>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="اكتب هنا سياق القرار..."
              className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-border/40 focus:border-amber-400 focus:outline-none text-foreground text-sm"
            />
          </div>
        )}

        {(context.trim() !== "" || currentStep > 0) && (
          <>
            {/* Context Badge */}
            <div className="mb-6 px-4 py-2 rounded-lg bg-white/[0.02] gold-border text-xs flex justify-between items-center">
              <span>
                <strong className="text-muted-foreground">القرار الجاري:</strong> {context}
              </span>
              <button
                onClick={() => setContext("")}
                className="text-[10px] text-amber-500 hover:text-amber-400"
              >
                تعديل السياق
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-amber-400 font-bold">
                  الخطوة {currentStep + 1} من {STEPS.length}
                </span>
                <span className="text-muted-foreground">
                  {STEPS[currentStep].name} ({STEPS[currentStep].num})
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-full flex-1 transition-all duration-300 ${
                      i <= currentStep
                        ? "bg-gradient-to-l from-amber-300 to-yellow-600 border-r border-background/20"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-5 text-[9px] sm:text-xs text-center mt-2 text-muted-foreground font-semibold">
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`transition-colors ${i === currentStep ? "text-amber-400 font-bold" : ""}`}
                  >
                    {step.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Wizard Steps */}
            <div className="card-elevated p-6 sm:p-8 rounded-2xl gold-border min-h-[300px] flex flex-col justify-between mb-8">
              {/* Step 1: Intuition Scan (2) */}
              {currentStep === 0 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                      2
                    </span>
                    المسح الحدسي — البوصلة الفطرية
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    توقف عن التفكير لدقيقة كاملة. ما هو إحساسك الأول الصادق والداخلي تجاه هذا القرار دون تبرير أو منطق؟
                  </p>
                  <textarea
                    rows={4}
                    value={intuitionScan}
                    onChange={(e) => setIntuitionScan(e.target.value)}
                    placeholder="إحساسي الأول هو..."
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-border/40 focus:border-amber-400 focus:outline-none text-foreground text-sm leading-relaxed"
                  />
                </div>
              )}

              {/* Step 2: Alternatives (5) */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-sky-400/10 text-sky-400 flex items-center justify-center font-bold">
                      5
                    </span>
                    اختبار البدائل — العقل المتحرك
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    لا تقع في فخ الاختيار الثنائي (نعم/لا). ولّد 3 مسارات أو بدائل مختلفة تماماً للتعامل مع هذا الموقف:
                  </p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={alternative1}
                      onChange={(e) => setAlternative1(e.target.value)}
                      placeholder="البديل الأول (الأسهل/المعتاد)..."
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-border/40 focus:border-amber-400 focus:outline-none text-foreground text-sm"
                    />
                    <input
                      type="text"
                      value={alternative2}
                      onChange={(e) => setAlternative2(e.target.value)}
                      placeholder="البديل الثاني (الأكثر جرأة)..."
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-border/40 focus:border-amber-400 focus:outline-none text-foreground text-sm"
                    />
                    <input
                      type="text"
                      value={alternative3}
                      onChange={(e) => setAlternative3(e.target.value)}
                      placeholder="البديل الثالث (الالتفافي/خارج الصندوق)..."
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-border/40 focus:border-amber-400 focus:outline-none text-foreground text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Instinct Check (4) */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-stone-400/10 text-stone-400 flex items-center justify-center font-bold">
                      4
                    </span>
                    فلترة الغرائز — ترويض الكلاب
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    بصدق تام مع نفسك، هل هناك أي غريزة بدائية أو \"كلب\" نهاش يضغط عليك لاتخاذ هذا القرار؟
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {["لا شيء", "الخوف (تجنب/تردد)", "الغضب (اندفاع/تصادم)", "الشهوة/الرغبة (راحة/متعة فورية)", "الأنا (حب السيطرة/الكبر)"].map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all ${
                          activeInstinct === opt
                            ? "bg-white/[0.04] gold-border text-amber-400"
                            : "bg-white/[0.01] border-border/30 hover:bg-white/[0.02]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="instinct"
                          value={opt}
                          checked={activeInstinct === opt}
                          onChange={() => setActiveInstinct(opt)}
                          className="accent-amber-400"
                        />
                        <span className="text-sm font-semibold">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Will Execution (1) */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-orange-400/10 text-orange-400 flex items-center justify-center font-bold">
                      1
                    </span>
                    التنفيذ الحاسم — سلاح الإرادة
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    لا فائدة من البوصلة والخطط دون سلاح. ما هي الخطوة الأولى الصغيرة والعملية التي ستتخذها فوراً لفرض هذا القرار؟
                  </p>
                  <input
                    type="text"
                    value={firstAction}
                    onChange={(e) => setFirstAction(e.target.value)}
                    placeholder="مثال: إرسال بريد الكتروني، بدء كتابة مستند، إلغاء اشتراك..."
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-border/40 focus:border-amber-400 focus:outline-none text-foreground text-sm"
                  />

                  {firstAction.trim() !== "" && (
                    <div className="pt-4 text-center">
                      {!timerActive && !timerDone && (
                        <button
                          onClick={startTimer}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold text-sm hover:from-orange-300 hover:to-red-400 transition-all shadow-lg shadow-orange-500/20"
                        >
                          أطلق عداد التنفيذ (5 ثوانٍ)
                        </button>
                      )}

                      {timerActive && (
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">نفّذ الآن! اقطع مسارات التراجع...</div>
                          <div className="text-6xl font-black text-orange-400 animate-ping">
                            {timerSecs}
                          </div>
                        </div>
                      )}

                      {timerDone && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
                          <span>✓</span> تم إطلاق الإجراء بنجاح!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Emotion Audit (6) */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-rose-400/10 text-rose-400 flex items-center justify-center font-bold">
                      6
                    </span>
                    المراقبة والاتزان — الوقود الروحي
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    كيف تشعر الآن بعد اتخاذ القرار وتفعيل السلاح؟ قيم منسوب الهدوء والاتزان النفسي لديك:
                  </p>
                  <div className="flex justify-center gap-4 py-6">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setEmotionalImpact(val)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black border transition-all ${
                          emotionalImpact === val
                            ? "bg-rose-500/20 border-rose-500 text-rose-400 scale-110 shadow-lg shadow-rose-500/10"
                            : "bg-white/[0.01] border-border/30 text-muted-foreground hover:bg-white/[0.02]"
                        }`}
                      >
                        {val === 1 && "😡"}
                        {val === 2 && "😟"}
                        {val === 3 && "😐"}
                        {val === 4 && "🙂"}
                        {val === 5 && "😌"}
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-xs text-muted-foreground">
                    {emotionalImpact <= 2 ? "اتزان منخفض — بحاجة لتفريغ عاطفي لاحق" : ""}
                    {emotionalImpact === 3 ? "اتزان محايد — احرص على تتبع الشعور" : ""}
                    {emotionalImpact >= 4 ? "اتزان عالٍ — البوصلة والسلاح في حالة سلكان" : ""}
                  </div>
                </div>
              )}

              {/* Wizard Footer Nav */}
              <div className="mt-8 pt-4 border-t border-border/20 flex justify-between gap-3">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="px-5 py-2.5 rounded-md gold-border text-muted-foreground hover:text-foreground disabled:opacity-0 disabled:pointer-events-none"
                >
                  السابق
                </button>

                {currentStep < STEPS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 0 && intuitionScan.trim() === "") ||
                      (currentStep === 1 && alternative1.trim() === "") ||
                      (currentStep === 3 && (firstAction.trim() === "" || (!timerDone && !timerActive)))
                    }
                    className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {currentStep === 3 && !timerDone && !timerActive ? "ابدأ العداد" : "التالي"}
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-md bg-gradient-to-r from-amber-300 to-yellow-600 text-black font-bold hover:from-amber-200 hover:to-yellow-500 transition-all shadow-md shadow-amber-500/10"
                  >
                    حفظ في السجل
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* History of Decisions */}
        <section className="mt-12">
          <h2 className="text-2xl font-black mb-6 gold-text">سجل القرارات السابقة</h2>
          {records.length === 0 ? (
            <div className="card-elevated p-8 rounded-xl text-center text-muted-foreground">
              لا توجد قرارات مسجلة حتى الآن.
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((rec) => (
                <article key={rec.id} className="card-elevated p-6 rounded-xl gold-border relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{rec.context}</h3>
                      <span className="text-[10px] text-muted-foreground">{rec.date}</span>
                    </div>
                    <button
                      onClick={() => setRecords(records.filter((r) => r.id !== rec.id))}
                      className="text-xs text-red-500 hover:text-red-400"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs mt-3 pt-3 border-t border-border/20">
                    <div className="space-y-1.5">
                      <div className="text-muted-foreground font-bold">الحدس (2):</div>
                      <div className="text-foreground leading-relaxed italic bg-white/[0.01] p-2 rounded border border-border/10">
                        "{rec.intuitionScan}"
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-muted-foreground font-bold">البدائل (5):</div>
                      <ul className="list-decimal list-inside space-y-1 text-foreground">
                        {rec.alternatives.map((alt, i) => (
                          <li key={i}>{alt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <div className="text-muted-foreground font-bold">الغريزة النشطة (4):</div>
                      <div className="font-semibold text-amber-500">{rec.activeInstinct}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-muted-foreground font-bold">أول إجراء تنفيذي (1):</div>
                      <div className="font-semibold text-orange-400">{rec.firstAction}</div>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <div className="text-muted-foreground font-bold">مستوى الاتزان بعد القرار (6):</div>
                      <div className="flex items-center gap-1 mt-1 text-lg">
                        {Array.from({ length: 5 }, (_, idx) => (
                          <span key={idx} className={idx < rec.emotionalImpact ? "opacity-100" : "opacity-20"}>
                            ⚡
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground mr-2">
                          ({rec.emotionalImpact} / 5)
                        </span>
                      </div>
                    </div>
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
