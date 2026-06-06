import { Link } from "@tanstack/react-router";
import { useLocalStorage } from "@/lib/storage";
import { FORCES } from "@/lib/forces";
import { useState } from "react";

const TOTAL_STEPS = 4;

export function Onboarding() {
  const [done, setDone] = useLocalStorage("onboarding-done", false);
  const [step, setStep] = useState(0);

  if (done) return null;

  const dismiss = () => setDone(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4">
      <div className="card-elevated gold-border rounded-2xl max-w-lg w-full p-8 relative overflow-hidden">
        {/* Subtle glow decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-amber-400/10 to-yellow-600/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-amber-400/5 to-yellow-600/10 blur-3xl" />

        <div className="relative z-10">
          {/* Skip button */}
          <button
            onClick={dismiss}
            className="absolute top-0 left-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            تخطي ←
          </button>

          {/* Step content */}
          <div className="min-h-[280px] flex flex-col justify-center">
            {step === 0 && <StepWelcome />}
            {step === 1 && <StepForces />}
            {step === 2 && <StepGoldenRule />}
            {step === 3 && <StepCTA onDismiss={dismiss} />}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6 mb-4">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === step
                    ? "bg-gradient-to-r from-amber-300 to-yellow-500 w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-4 py-2 text-sm rounded-md gold-border text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              السابق
            </button>

            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                التالي
              </button>
            ) : (
              <Link
                to="/assessment"
                onClick={dismiss}
                className="px-5 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                ابدأ التقييم
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepWelcome() {
  return (
    <div className="text-center">
      <div className="text-6xl mb-4">⚡</div>
      <h2 className="text-3xl font-black gold-text mb-3">
        مرحباً بك في السيادة
      </h2>
      <p className="text-muted-foreground leading-relaxed">
        منظومة متكاملة لهندسة الأداء البشري. ستتعلم كيف تسيطر على قواك الخمس
        وتقودها بوعي نحو أعلى أداء ممكن.
      </p>
    </div>
  );
}

function StepForces() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">القوى الخمس</h2>
      <div className="space-y-3">
        {FORCES.map((f) => (
          <div key={f.key} className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${f.color} text-white font-black text-lg shrink-0`}
            >
              {f.number}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm">
                {f.name}{" "}
                <span className="text-muted-foreground font-normal">
                  — {f.subtitle}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">{f.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepGoldenRule() {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">👑</div>
      <h2 className="text-xl font-bold mb-4">القاعدة الذهبية</h2>
      <blockquote className="text-sm leading-relaxed text-muted-foreground gold-border rounded-xl p-5">
        <p className="gold-text font-bold text-base mb-2">
          يتحقق الأداء البشري الأقصى عندما:
        </p>
        يقود الحدس (2)، ويخدم العقل (5)، وتنفذ الإرادة (1)، مع تفريغ واعٍ
        للعاطفة (6)، وترويض حازم للغرائز (4).
      </blockquote>
    </div>
  );
}

function StepCTA({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">🎯</div>
      <h2 className="text-xl font-bold mb-3">ابدأ رحلتك</h2>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        الخطوة الأولى: قيّم وضعك الحالي في كل قوة من القوى الخمس. هذا التقييم
        سيرسم خريطتك الشخصية ويحدد نقطة البداية.
      </p>
      <Link
        to="/assessment"
        onClick={onDismiss}
        className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-bold text-sm hover:from-amber-300 hover:to-yellow-500 transition-all shadow-lg shadow-amber-500/20"
      >
        ابدأ بتقييم قواك الخمس
      </Link>
    </div>
  );
}
