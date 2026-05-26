import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { IDENTITIES } from "@/lib/forces";

export const Route = createFileRoute("/identities")({ component: Identities });

function Identities() {
  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-1">الهويات الأربع</h1>
      <p className="text-muted-foreground mb-8">
        قوالب أداء تُستدعى استراتيجيًا حسب مقتضيات الموقف.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {IDENTITIES.map((id) => (
          <article key={id.key} className="card-elevated rounded-xl p-6">
            <h2 className="text-2xl font-bold gold-text mb-2">{id.name}</h2>
            <div className="text-xs text-primary mb-3 font-mono">{id.formula}</div>
            <p className="text-sm leading-relaxed mb-4">{id.description}</p>
            <div className="border-t border-border/60 pt-3">
              <div className="text-xs text-muted-foreground mb-2">السلوكيات المميزة:</div>
              <ul className="space-y-1.5 text-sm">
                {id.behaviors.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">◆</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-10 card-elevated rounded-xl p-6 text-center">
        <h3 className="font-bold mb-2 gold-text">القاعدة الذهبية</h3>
        <p className="text-sm leading-loose max-w-2xl mx-auto">
          عندما يقود الحدس (2)، وينفّذ السلاح (1)، ويخدم العقل (5)، وتظهر العاطفة بوعي (6)،
          وتظل الغرائز (4) مربوطة كقوى سوداء تحت السيادة — تصل إلى أقصى نسخة منك.
        </p>
      </section>
    </Shell>
  );
}
