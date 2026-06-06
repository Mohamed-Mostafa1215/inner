import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { IDENTITIES } from "@/lib/forces";
import { useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/identities")({ component: Identities });

interface IdentityActivation {
  identityKey: string;
  date: string;
}

const SCENARIOS: Record<string, string> = {
  warrior: "عند مواجهة مهمة ثقيلة أو موقف مخيف، استدعِ عقل المحارب لترويض الخوف وتثبيت السلاح التنفيذي والتحرك فوراً.",
  leader: "في اجتماع أو موقف اجتماعي يتطلب القيادة، استدعِ القائد لفرض حضورك القوي واتخاذ قرارات واضحة بلا تبرير.",
  maker: "عند العمل على مهامك، كتابة كود، أو بناء مشروع، استدعِ صانع المشروع لتركيز 90 دقيقة وتجاوز كسل المزاج.",
  sage: "في نهاية يوم شاق أو عند الشعور بضغط وضوضاء نفسية، استدعِ الروحي العملي لتنظيف الوقود وصيانة البوصلة بالصمت.",
};

function Identities() {
  const [activations, setActivations] = useLocalStorage<IdentityActivation[]>(
    "identity-activations",
    []
  );

  const activateIdentity = (identityKey: string) => {
    const newItem: IdentityActivation = {
      identityKey,
      date: new Date().toISOString(),
    };
    setActivations([...activations, newItem]);
    alert(`تم استدعاء هوية (${IDENTITIES.find(id => id.key === identityKey)?.name}) لليوم!`);
  };

  const getActivationCount = (identityKey: string) => {
    return activations.filter((act) => act.identityKey === identityKey).length;
  };

  return (
    <Shell>
      <h1 className="text-3xl font-black mb-1 gold-text">الهويات الأربع</h1>
      <p className="text-muted-foreground mb-8">
        قوالب وأوضاع أداء تُستدعى استراتيجياً حسب مقتضيات الموقف لفرض السيادة على تفاعلات القوى.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {IDENTITIES.map((id) => {
          const count = getActivationCount(id.key);
          const scenario = SCENARIOS[id.key];

          return (
            <article key={id.key} className="card-elevated rounded-xl p-6 gold-border flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-2xl font-black">{id.name}</h2>
                    {count > 0 && (
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-400/5 px-2.5 py-0.5 rounded border border-amber-400/20 inline-block mt-1">
                        تم استدعاؤها {count} {count === 1 ? "مرة" : count === 2 ? "مرتين" : "مرات"}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-primary font-mono gold-border px-2 py-1 rounded bg-white/[0.01]">{id.formula}</div>
                </div>

                <p className="text-sm leading-relaxed mb-4 text-muted-foreground">{id.description}</p>
                
                {/* Scenarios and Behaviors */}
                <div className="border-t border-border/20 pt-4 space-y-4">
                  <div>
                    <div className="text-xs font-bold text-amber-400 mb-1.5">سيناريو الاستدعاء الميداني:</div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic bg-white/[0.01] p-3 rounded-lg border border-border/10">
                      "{scenario}"
                    </p>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-2">السلوكيات المميزة لهذه الهوية:</div>
                    <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                      {id.behaviors.map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-amber-500">◆</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/20 pt-4 mt-6">
                <button
                  onClick={() => activateIdentity(id.key)}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-300 to-yellow-600 text-black font-bold text-xs sm:text-sm hover:from-amber-200 hover:to-yellow-500 transition-all shadow-md shadow-amber-500/10"
                >
                  استدعِ هذه الهوية اليوم
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-10 card-elevated rounded-xl p-6 text-center gold-border">
        <h3 className="font-bold mb-2 gold-text text-lg">القاعدة الذهبية المشتركة</h3>
        <p className="text-sm leading-relaxed max-w-2xl mx-auto text-muted-foreground">
          عندما يقود الحدس (2)، وينفّذ السلاح (1)، ويخدم العقل (5)، وتظهر العاطفة بوعي (6)،
          وتظل الغرائز (4) مربوطة كقوى سوداء تحت السيادة — تصل إلى أقصى نسخة منك وتكامل قواك.
        </p>
      </section>
    </Shell>
  );
}
