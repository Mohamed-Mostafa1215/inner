import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { FORCES } from "@/lib/forces";
import { useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [progress] = useLocalStorage<Record<number, boolean>>("protocol-progress", {});
  const completed = Object.values(progress).filter(Boolean).length;
  const pct = Math.round((completed / 60) * 100);

  return (
    <Shell>
      <section className="text-center pt-6 pb-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs gold-border text-primary mb-4">
          هندسة الأداء البشري
        </div>
        <h1 className="text-4xl sm:text-6xl font-black leading-tight">
          <span className="gold-text">السيادة</span> على الذات
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg leading-relaxed">
          عندما يقود الحدس، وينفّذ السلاح، ويخدم العقل، وتُفرَّغ العاطفة بوعي،
          وتُربط الغرائز كقوى سوداء مروّضة.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/protocol"
            className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90"
          >
            ابدأ بروتوكول الـ 60 يوم
          </Link>
          <Link
            to="/assessment"
            className="px-5 py-2.5 rounded-md gold-border text-foreground hover:bg-muted/60"
          >
            قيّم قواك الخمس
          </Link>
        </div>
      </section>

      {completed > 0 && (
        <section className="mb-10 card-elevated rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">تقدّمك في البروتوكول</h3>
            <span className="text-sm text-muted-foreground">
              {completed} / 60 يوم — {pct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-amber-300 to-yellow-600"
              style={{ width: `${pct}%` }}
            />
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-1">القوى الخمس</h2>
        <p className="text-sm text-muted-foreground mb-6">
          المصفوفة الأساسية. اضغط على أي قوة لمعرفة دورها وكيفية تدريبها.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FORCES.map((f) => (
            <article
              key={f.key}
              className="card-elevated rounded-xl p-5 hover:translate-y-[-2px] transition-transform"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`text-4xl font-black bg-gradient-to-br ${f.color} bg-clip-text text-transparent`}
                >
                  {f.number}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1 rounded gold-border">
                  {f.level}
                </span>
              </div>
              <h3 className="text-xl font-bold">{f.name}</h3>
              <p className="text-sm text-primary mb-2">{f.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              <div className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                <span className="text-foreground">الدور:</span> {f.role}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Link
          to="/exercises"
          className="card-elevated rounded-xl p-6 hover:gold-border transition-all"
        >
          <h3 className="text-xl font-bold mb-2">التمارين العملية</h3>
          <p className="text-sm text-muted-foreground">
            قاعدة الـ 5 ثوانٍ، الـ 10 دقائق، البدائل الثلاثة، تفريغ العمق…
          </p>
        </Link>
        <Link
          to="/identities"
          className="card-elevated rounded-xl p-6 hover:gold-border transition-all"
        >
          <h3 className="text-xl font-bold mb-2">الهويات الأربع</h3>
          <p className="text-sm text-muted-foreground">
            المحارب، القائد، صانع المشروع، الروحي العملي — استدعِ الهوية المناسبة للموقف.
          </p>
        </Link>
      </section>
    </Shell>
  );
}
