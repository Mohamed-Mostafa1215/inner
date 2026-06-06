import type { ComparisonRow } from "@/lib/forces";

interface ComparisonTableProps {
  title: string;
  positiveLabel: string;
  negativeLabel: string;
  rows: ComparisonRow[];
  positiveColor?: string;
  negativeColor?: string;
}

export function ComparisonTable({
  title,
  positiveLabel,
  negativeLabel,
  rows,
  positiveColor = "text-emerald-400",
  negativeColor = "text-red-400",
}: ComparisonTableProps) {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4 gold-text">{title}</h2>
      <div className="card-elevated rounded-xl overflow-hidden gold-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="px-5 py-4 text-start font-bold text-muted-foreground text-xs uppercase tracking-wider">
                  وجه المقارنة
                </th>
                <th
                  className={`px-5 py-4 text-start font-bold text-xs uppercase tracking-wider ${positiveColor}`}
                >
                  {positiveLabel}
                </th>
                <th
                  className={`px-5 py-4 text-start font-bold text-xs uppercase tracking-wider ${negativeColor}`}
                >
                  {negativeLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-border/20 transition-colors hover:bg-white/[0.03] ${
                    i % 2 === 1 ? "bg-white/[0.015]" : ""
                  }`}
                >
                  <td className="px-5 py-4 font-medium text-foreground whitespace-nowrap">
                    {row.aspect}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground leading-relaxed">
                    {row.positive}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground leading-relaxed">
                    {row.negative}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
