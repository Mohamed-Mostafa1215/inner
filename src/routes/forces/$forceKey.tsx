import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { FORCES, type ForceKey } from "@/lib/forces";
import { FORCE_CONTENTS } from "@/lib/forces-content";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ScientificTerm } from "@/components/ScientificTerm";

export const Route = createFileRoute("/forces/$forceKey")({
  component: ForceDetail,
});

function ForceDetail() {
  const { forceKey } = useParams({ from: "/forces/$forceKey" }) as {
    forceKey: ForceKey;
  };

  const force = FORCES.find((f) => f.key === forceKey);
  const content = FORCE_CONTENTS[forceKey];

  if (!force || !content) {
    return (
      <Shell>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-400 mb-4">القوة غير موجودة</h2>
          <Link to="/forces" className="px-5 py-2.5 bg-primary rounded-md text-primary-foreground">
            العودة لفهرس القوى
          </Link>
        </div>
      </Shell>
    );
  }

  // Find next and previous force keys for navigation
  const keys: ForceKey[] = ["will", "intuition", "instinct", "intellect", "emotion"];
  // Note: the order in content-reference or standard list:
  // 1: will, 2: intuition, 4: instinct, 5: intellect, 6: emotion
  // Let's sort keys by number for sequential flow: will (1) -> intuition (2) -> instinct (4) -> intellect (5) -> emotion (6)
  const sortedForces = [...FORCES].sort((a, b) => {
    const order = [1, 2, 4, 5, 6];
    return order.indexOf(a.number) - order.indexOf(b.number);
  });
  
  const currentIndex = sortedForces.findIndex((f) => f.key === forceKey);
  const prevForce = sortedForces[(currentIndex - 1 + sortedForces.length) % sortedForces.length];
  const nextForce = sortedForces[(currentIndex + 1) % sortedForces.length];

  return (
    <Shell>
      {/* Hero Section */}
      <section className="relative my-8 p-8 rounded-2xl card-elevated gold-border overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 font-black text-8xl sm:text-[10rem] select-none pointer-events-none">
          {force.number}
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${force.color}`}>
                القوة رقم {force.number}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground px-2 py-1 rounded gold-border">
                {force.level}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight gold-text">
              {force.name}
            </h1>
            <p className="mt-2 text-primary font-medium text-lg">{force.subtitle}</p>
            <p className="mt-3 text-muted-foreground text-sm max-w-xl leading-relaxed">
              {force.description}
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
            <span className="text-xs text-muted-foreground">التصنيف الوظيفي:</span>
            <span className="px-4 py-2 rounded-xl bg-white/[0.04] gold-border text-foreground font-bold text-lg">
              {force.role}
            </span>
          </div>
        </div>
      </section>

      {/* Conceptual & Brain Mechanism Sections */}
      <section className="grid md:grid-cols-2 gap-8 my-10">
        {content.sections.map((sec, i) => (
          <div key={i} className="card-elevated rounded-xl p-6 gold-border">
            <h3 className="text-xl font-bold mb-4 gold-text">{sec.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {/* Simple helper to wrap scientific terms if they appear in text */}
              {renderWithTermTooltips(sec.content, content.scientificTerms)}
            </p>
          </div>
        ))}
      </section>

      {/* Comparison Table Section */}
      <ComparisonTable
        title={content.comparisonTable.title}
        positiveLabel={content.comparisonTable.positiveLabel}
        negativeLabel={content.comparisonTable.negativeLabel}
        rows={content.comparisonTable.rows}
        positiveColor={forceKey === "instinct" ? "text-emerald-400" : undefined}
      />

      {/* Force Interactions */}
      <section className="my-10">
        <h2 className="text-2xl font-bold mb-6 gold-text">مصفوفة التفاعل مع القوى الأخرى</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {content.interactions.map((inter, i) => {
            const related = FORCES.find((x) => x.key === inter.withForce);
            return (
              <div key={i} className="card-elevated rounded-xl p-5 gold-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {related && (
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br ${related.color} text-white font-black text-xs`}>
                        {related.number}
                      </span>
                    )}
                    <h4 className="font-bold text-foreground">{inter.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {inter.description}
                  </p>
                </div>
                {related && (
                  <Link
                    to={`/forces/${related.key}`}
                    className="mt-4 text-xs text-amber-500 hover:text-amber-400 text-start"
                  >
                    استكشف قوة {related.name} ←
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Signs of Strength vs Signs of Weakness */}
      <section className="grid md:grid-cols-2 gap-8 my-10">
        <div className="card-elevated rounded-xl p-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.02)]">
          <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <span>✅</span> علامات قوة {force.name}
          </h3>
          <ul className="space-y-3">
            {content.strengthSigns.map((sign, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                <span className="text-emerald-500 text-xs mt-1">•</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-elevated rounded-xl p-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.02)]">
          <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <span>⚠️</span> مؤشرات تشوش {force.name}
          </h3>
          <ul className="space-y-3">
            {content.weaknessSigns.map((sign, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                <span className="text-red-500 text-xs mt-1">•</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Strategic Risks */}
      <section className="my-10 p-6 card-elevated gold-border rounded-xl border-orange-500/20">
        <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
          <span>🚨</span> المخاطر الاستراتيجية
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {content.strategicRisks.map((risk, i) => (
            <div key={i} className="bg-white/[0.02] p-4 rounded-lg flex gap-3 text-sm text-muted-foreground leading-relaxed">
              <span className="text-orange-500 font-bold">.0{i + 1}</span>
              <span>{risk}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Development Protocol */}
      <section className="my-10">
        <h2 className="text-2xl font-bold mb-6 gold-text">البروتوكول التطويري الميداني</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {content.developmentProtocol.map((step, i) => (
            <div key={i} className="card-elevated rounded-xl p-6 gold-border relative overflow-hidden">
              <div className="absolute top-0 left-0 p-4 opacity-5 font-bold text-6xl select-none pointer-events-none">
                {i + 1}
              </div>
              <h4 className="font-bold text-foreground text-lg mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-400/10 text-amber-400 text-sm flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                {step.title}
              </h4>
              <p className="text-xs text-primary mb-4">{step.description}</p>
              <ul className="space-y-2">
                {step.steps.map((sub, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Scientific Terms Tooltip Dictionary */}
      <section className="my-10 p-6 card-elevated gold-border rounded-xl">
        <h3 className="text-lg font-bold mb-4 gold-text">المصطلحات التشريحية والعلمية</h3>
        <div className="flex flex-wrap gap-3">
          {content.scientificTerms.map((term, i) => (
            <ScientificTerm
              key={i}
              term={term.term}
              english={term.english}
              definition={term.definition}
            >
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-xs font-semibold inline-block transition-colors border border-border/20">
                {term.term} ({term.english})
              </span>
            </ScientificTerm>
          ))}
        </div>
      </section>

      {/* Navigation to prev/next force */}
      <section className="mt-12 pt-6 border-t border-border/30 flex items-center justify-between gap-4">
        <Link
          to={`/forces/${prevForce.key}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg gold-border text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.02] transition-all"
        >
          <span>←</span>
          <span>{prevForce.name} ({prevForce.number})</span>
        </Link>
        <Link
          to="/forces"
          className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          المصفوفة الكاملة
        </Link>
        <Link
          to={`/forces/${nextForce.key}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg gold-border text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.02] transition-all"
        >
          <span>{nextForce.name} ({nextForce.number})</span>
          <span>→</span>
        </Link>
      </section>
    </Shell>
  );
}

/**
 * Utility function to parse text and wrap scientific terms in Tooltips
 */
function renderWithTermTooltips(text: string, terms: { term: string; english: string; definition: string }[]) {
  if (!terms || terms.length === 0) return text;
  
  // Sort terms by length descending to avoid matching substrings of longer terms first
  const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
  
  let parts: (string | React.ReactNode)[] = [text];
  
  for (const termInfo of sortedTerms) {
    const newParts: (string | React.ReactNode)[] = [];
    
    for (const part of parts) {
      if (typeof part !== "string") {
        newParts.push(part);
        continue;
      }
      
      const regex = new RegExp(`(${termInfo.term})`, "g");
      const subParts = part.split(regex);
      
      for (let i = 0; i < subParts.length; i++) {
        if (i % 2 === 1) {
          // This matches the term
          newParts.push(
            <ScientificTerm
              key={`${termInfo.term}-${i}`}
              term={termInfo.term}
              english={termInfo.english}
              definition={termInfo.definition}
            >
              {subParts[i]}
            </ScientificTerm>
          );
        } else if (subParts[i] !== "") {
          newParts.push(subParts[i]);
        }
      }
    }
    parts = newParts;
  }
  
  return parts;
}
