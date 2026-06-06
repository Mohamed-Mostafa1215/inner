import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useLocalStorage } from "@/lib/storage";
import { FORCES, type ForceKey } from "@/lib/forces";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

// Same calculation logic as assessment.tsx
const QUESTIONS_MAPPING: ForceKey[] = [
  "intuition", "intuition", "intuition",
  "will", "will", "will",
  "intellect", "intellect", "intellect",
  "emotion", "emotion", "emotion",
  "instinct", "instinct", "instinct",
  // 10 new questions (total 25)
  "intuition", "intuition",
  "will", "will",
  "intellect", "intellect",
  "emotion", "emotion",
  "instinct", "instinct",
];

interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  dog: string;
  decision?: string;
  reflection?: string;
}

interface DecisionRecord {
  id: string;
  date: string;
  context: string;
  intuitionScan: string;
  alternatives: string[];
  activeInstinct: string;
  firstAction: string;
  emotionalImpact: number;
}

function calculateStreak(progress: Record<number, boolean>): number {
  let longest = 0;
  let current = 0;
  for (let d = 1; d <= 60; d++) {
    if (progress[d]) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }
  return longest;
}

function Dashboard() {
  const [progress] = useLocalStorage<Record<number, boolean>>("protocol-progress", {});
  const [answers] = useLocalStorage<Record<number, number>>("assessment-answers", {});
  const [journalEntries] = useLocalStorage<JournalEntry[]>("journal-entries", []);
  const [decisionRecords] = useLocalStorage<DecisionRecord[]>("decision-records", []);

  // 1. Stats Summary
  const protocolCompleted = Object.values(progress).filter(Boolean).length;
  const protocolPct = Math.round((protocolCompleted / 60) * 100);
  const streak = calculateStreak(progress);
  const totalJournal = journalEntries.length;
  const totalDecisions = decisionRecords.length;

  // 2. 5 Forces Scores for Radar Chart
  const forceScores = FORCES.map((f) => {
    let sum = 0;
    let count = 0;
    
    // Map indices of questions for this force
    QUESTIONS_MAPPING.forEach((forceKey, index) => {
      if (forceKey === f.key && typeof answers[index] === "number") {
        sum += answers[index];
        count += 1;
      }
    });

    const average = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
    return {
      force: f.name,
      score: average,
      fullMark: 5,
    };
  });

  // 3. Mood Over Time Line Chart
  const moodData = [...journalEntries]
    .reverse() // Chronological order
    .slice(-15) // Last 15 entries
    .map((e) => {
      const d = new Date(e.date);
      return {
        date: d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" }),
        "المزاج": e.mood,
      };
    });

  // 4. Dog Frequency Bar Chart
  const dogCounts: Record<string, number> = {
    "الخوف": 0,
    "الغضب": 0,
    "الشهوة": 0,
    "الأنا/الشك": 0,
    "الأنا": 0, // Fallback if spelling varies
  };

  journalEntries.forEach((e) => {
    if (e.dog && e.dog !== "لا شيء") {
      // Normalize different spellings if any
      const normalized = e.dog.includes("الأنا") ? "الأنا" : e.dog;
      dogCounts[normalized] = (dogCounts[normalized] || 0) + 1;
    }
  });

  const dogData = Object.entries(dogCounts)
    .filter(([_, count]) => count >= 0)
    .map(([dogName, count]) => ({
      name: dogName,
      "مرات الظهور": count,
    }));

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black gold-text">لوحة القياس والسيادة</h1>
          <p className="text-sm text-muted-foreground mt-1">
            مراقبة إحصائية لتطور قواك الخمس وتوازنك النفسي بمرور الوقت.
          </p>
        </div>

        {/* 1. Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-elevated p-5 rounded-xl gold-border text-center">
            <div className="text-2xl sm:text-3xl font-black gold-text tabular-nums">
              {protocolCompleted} / 60
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">التقدم بالبروتوكول</div>
          </div>
          <div className="card-elevated p-5 rounded-xl gold-border text-center">
            <div className="text-2xl sm:text-3xl font-black text-orange-400 tabular-nums">
              🔥 {streak}
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">أيام متتالية</div>
          </div>
          <div className="card-elevated p-5 rounded-xl gold-border text-center">
            <div className="text-2xl sm:text-3xl font-black text-rose-400 tabular-nums">
              {totalJournal}
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">جلسات اليوميات</div>
          </div>
          <div className="card-elevated p-5 rounded-xl gold-border text-center">
            <div className="text-2xl sm:text-3xl font-black text-sky-400 tabular-nums">
              {totalDecisions}
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">القرارات المتكاملة</div>
          </div>
        </div>

        {/* 2. Protocol Progress Section */}
        <section className="card-elevated p-6 rounded-2xl gold-border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-foreground">نسبة إنجاز البروتوكول السيادي</h3>
            <span className="text-sm font-semibold gold-text">{protocolPct}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-amber-300 to-yellow-600 transition-all duration-500"
              style={{ width: `${protocolPct}%` }}
            />
          </div>
        </section>

        {/* 3. Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Radar Chart: Force Matrix Score */}
          <div className="card-elevated p-6 rounded-2xl gold-border flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 gold-text w-full text-start">خريطة القوى الخمس</h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" radius="70%" data={forceScores}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis
                    dataKey="force"
                    tick={{ fill: "#999", fontSize: 12, fontWeight: "bold" }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: "#666" }} />
                  <Radar
                    name="المستوى الحالي"
                    dataKey="score"
                    stroke="#d4a843"
                    fill="#d4a843"
                    fillOpacity={0.25}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(10, 10, 10, 0.95)",
                      borderColor: "#d4a843",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "12px",
                      textAlign: "right",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2 leading-relaxed">
              تظهر هذه الخريطة مدى توازن القوى الخمس بناءً على آخر تقييم قمت به.
            </div>
          </div>

          {/* Line Chart: Mood Over Time */}
          <div className="card-elevated p-6 rounded-2xl gold-border">
            <h3 className="text-lg font-bold mb-4 gold-text">تطور الاتزان والمزاج اليومي</h3>
            <div className="w-full h-72">
              {moodData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  سجل يومياتك لرؤية منحنى المزاج هنا.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#666" domain={[1, 5]} tickCount={5} tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 10, 10, 0.95)",
                        borderColor: "#d4a843",
                        color: "#fff",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="المزاج"
                      stroke="#f43f5e"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2 leading-relaxed">
              منحنى يبين مستويات المزاج العام والاتزان الشعوري على مدار الـ 15 جلسة الأخيرة.
            </div>
          </div>

          {/* Bar Chart: Dog Frequencies */}
          <div className="card-elevated p-6 rounded-2xl gold-border md:col-span-2">
            <h3 className="text-lg font-bold mb-4 gold-text">تكرار ظهور الغرائز (الكلاب الأربعة)</h3>
            <div className="w-full h-72">
              {totalJournal === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  سجل اليوميات لرصد سلوك الغرائز هنا.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dogData}>
                    <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 11, fontWeight: "bold" }} />
                    <YAxis stroke="#666" tickCount={5} tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 10, 10, 0.95)",
                        borderColor: "#d4a843",
                        color: "#fff",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="مرات الظهور"
                      fill="#eab308"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2 leading-relaxed">
              إحصائية توضح أي من \"الكلاب الأربعة\" يحاول اختطاف إرادتك بشكل متكرر لتصميم تمارين الترويض المناسبة.
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
