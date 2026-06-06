import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { FORCES } from "@/lib/forces";
import { ForceMatrix } from "@/components/ForceMatrix";

export const Route = createFileRoute("/forces/")({ component: ForcesIndex });

function ForcesIndex() {
  return (
    <Shell>
      <section className="text-center pt-4 pb-8">
        <h1 className="text-3xl sm:text-5xl font-black leading-tight gold-text">
          القوى الخمس — المصفوفة الداخلية
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
          خريطتك النفسية المتكاملة لإدارة الطاقة العصبية والسلوك والقرارات.
        </p>
      </section>

      {/* ForceMatrix component */}
      <ForceMatrix />

      {/* Grid of clickable force cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">تفاصيل القوى</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FORCES.map((f) => (
            <Link
              key={f.key}
              to={`/forces/${f.key}`}
              className="card-elevated rounded-xl p-5 hover:gold-border transition-all block text-start group"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`text-4xl font-black bg-gradient-to-br ${f.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform`}
                >
                  {f.number}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1 rounded gold-border">
                  {f.level}
                </span>
              </div>
              <h3 className="text-xl font-bold group-hover:text-amber-400 transition-colors">
                {f.name}
              </h3>
              <p className="text-sm text-primary mb-2">{f.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
              <div className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground flex justify-between items-center">
                <span>
                  <strong className="text-foreground">الدور:</strong> {f.role}
                </span>
                <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  تفاصيل ←
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* The golden rule section */}
      <section className="mb-8">
        <div className="card-elevated gold-border rounded-xl p-6 text-center max-w-2xl mx-auto">
          <h3 className="gold-text font-black text-lg sm:text-xl mb-3">
            القاعدة الذهبية السيادية
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            "يتحقق الأداء البشري الأقصى عندما يقود الحدس (2)، ويخدم العقل (5)،
            وتنفذ الإرادة (1)، مع تفريغ واعٍ للعاطفة (6)، وترويض حازم للغرائز
            (4)."
          </p>
        </div>
      </section>
    </Shell>
  );
}
