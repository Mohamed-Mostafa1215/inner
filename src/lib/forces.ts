export type ForceKey = "intuition" | "will" | "intellect" | "emotion" | "instinct";

export interface Force {
  key: ForceKey;
  number: number;
  name: string;
  subtitle: string;
  level: string;
  role: string;
  description: string;
  risk: string;
  color: string;
}

export const FORCES: Force[] = [
  {
    key: "intuition",
    number: 2,
    name: "الحدس",
    subtitle: "البوصلة الفطرية",
    level: "ليفل 5 — سلكان",
    role: "يقود",
    description:
      "إدراك فوري يتجاوز المنطق الخطي. هو الرماية الذهنية التي تصيب الهدف بدقة قبل التحليل.",
    risk: "تجاهله يؤدي للتيه وفقدان الاتجاه.",
    color: "from-amber-300 to-yellow-500",
  },
  {
    key: "will",
    number: 1,
    name: "الإرادة",
    subtitle: "السلاح التنفيذي",
    level: "القشرة الجبهية",
    role: "ينفّذ",
    description:
      "القوة الحاسمة التي تحوّل الرؤية إلى واقع. بدون بوصلة تصبح تهورًا، ومع الحدس تصبح قنّاصًا.",
    risk: "غيابها يجعل أعظم الرؤى مجرد أحلام.",
    color: "from-orange-400 to-red-500",
  },
  {
    key: "intellect",
    number: 5,
    name: "الذكاء",
    subtitle: "العقل المتحرك",
    level: "ليفل 3 — الناقل",
    role: "يخدم",
    description:
      "ناقل الحركة الذي يولّد البدائل ويناور بين العقبات. يخدم رؤية الحدس ولا يقود وحده.",
    risk: "وحده يؤدي لشلل التحليل والتبرير.",
    color: "from-sky-400 to-indigo-500",
  },
  {
    key: "emotion",
    number: 6,
    name: "العاطفة",
    subtitle: "الوقود الروحي",
    level: "ليفل 7 — مكتسب",
    role: "يُفرَّغ بوعي",
    description:
      "أعلى القوى تكلفة. تمنح العمق والمعنى، وتتطلب تفريغًا واعيًا وجرعات محسوبة.",
    risk: "كبتها يؤدي للاكتئاب، انفجارها يستنزف النظام.",
    color: "from-rose-400 to-fuchsia-500",
  },
  {
    key: "instinct",
    number: 4,
    name: "الغرائز",
    subtitle: "الكلاب الأربعة",
    level: "منطقة الاختبار",
    role: "تُروَّض",
    description:
      "الخوف، الغضب، الشهوة، الأنا. طاقة خام تتحول إلى أسود سوداء حين تُروَّض، أو إلى كلاب تنهش حين تنفلت.",
    risk: "انفلاتها يقود إلى التفكك الهيكلي.",
    color: "from-stone-400 to-zinc-700",
  },
];

export interface Identity {
  key: string;
  name: string;
  formula: string;
  description: string;
  behaviors: string[];
}

export const IDENTITIES: Identity[] = [
  {
    key: "warrior",
    name: "عقل المحارب",
    formula: "الإرادة (1) + ترويض الغرائز (4)",
    description:
      "خط الدفاع الأول. يحوّل الخوف والغضب إلى درع نفسي صلب، ويعمل تحت الضغط العالي.",
    behaviors: [
      "المواجهة المباشرة للمخاوف",
      "الانضباط في إنهاء المهام الثقيلة",
      "الصمت الاستراتيجي وقت الانفعال",
    ],
  },
  {
    key: "leader",
    name: "القائد",
    formula: "الحدس (2) + الإرادة (1) + ذكاء اجتماعي (5)",
    description:
      "البصيرة النافذة والحضور الطاغي. يقرأ البشر بحدسه ويحسم بإرادته بدون تبرير زائد.",
    behaviors: [
      "إيقاع هادئ وثابت في الكلام",
      "قرارات حاسمة بلا ضجيج",
      "قراءة دوافع الآخرين فورًا",
    ],
  },
  {
    key: "maker",
    name: "صانع المشروع",
    formula: "الذكاء (5) في خدمة الحدس (2) + تحييد المزاج",
    description:
      "مهندس الواقع. يحوّل الأفكار إلى نتائج تحت قانون: الإنجاز أهم من المزاج.",
    behaviors: [
      "العمل العميق (90 دقيقة تركيز)",
      "تمرين البدائل الثلاثة لكل عقبة",
      "القياس بالبيانات لا بالانطباعات",
    ],
  },
  {
    key: "sage",
    name: "الروحي العملي",
    formula: "العاطفة (6) تحت رقابة الحدس (2)",
    description:
      "بروتوكول صيانة العمق الإنساني. يعيد شحن النظام ويحفظ البوصلة من الضوضاء.",
    behaviors: [
      "تفريغ يومي (كتابة/صمت/حركة)",
      "ربط العمل بالمعنى الأكبر",
      "تأمل لتنقية البوصلة",
    ],
  },
];

export interface ProtocolDay {
  day: number;
  phase: 1 | 2 | 3;
  title: string;
  tasks: string[];
}

const phase1Tasks = [
  "قاعدة الـ 5 ثوانٍ: نفّذ قرارًا صغيرًا فورًا خلال 5 ثوانٍ",
  "تمرين القرار الأول: اتبع الإحساس الأول في قرار يومي بسيط",
  "تسمية الكلب: عند الانفعال، سَمِّ الشعور وانتظر 10 دقائق",
];
const phase2Tasks = [
  "تمرين البدائل الثلاثة: ولّد 3 حلول لأي عقبة اليوم",
  "اعرض البدائل على الحدس واختر المسار السالك",
  "تفريغ 10 دقائق: كتابة/رياضة/صوت لمنع تراكم العاطفة",
];
const phase3Tasks = [
  "دورة القرار الكاملة: الحدس يحدد → التحليل يخطط → الإرادة تنفذ",
  "اختر هوية اليوم: محارب / قائد / صانع / روحي",
  "راجع سرعة قرارك وثبات انفعالك مساءً",
];

export const PROTOCOL: ProtocolDay[] = Array.from({ length: 60 }, (_, i) => {
  const day = i + 1;
  let phase: 1 | 2 | 3 = 1;
  let title = "تثبيت الأساس";
  let tasks = phase1Tasks;
  if (day > 14 && day <= 30) {
    phase = 2;
    title = "تفعيل الذكاء الاستراتيجي";
    tasks = phase2Tasks;
  } else if (day > 30) {
    phase = 3;
    title = "الدمج والسيادة";
    tasks = phase3Tasks;
  }
  return { day, phase, title, tasks };
});

export interface Exercise {
  key: string;
  name: string;
  force: ForceKey;
  duration: string;
  description: string;
  steps: string[];
}

export const EXERCISES: Exercise[] = [
  {
    key: "five-seconds",
    name: "قاعدة الـ 5 ثوانٍ",
    force: "will",
    duration: "فوري",
    description: "كسر التسويف بتنفيذ القرار خلال 5 ثوانٍ من ظهوره.",
    steps: [
      "لاحظ القرار أو الفعل المؤجل",
      "ابدأ العد التنازلي: 5-4-3-2-1",
      "تحرك جسديًا قبل وصولك للصفر",
    ],
  },
  {
    key: "ten-minutes",
    name: "قاعدة الـ 10 دقائق",
    force: "instinct",
    duration: "10 دقائق",
    description: "ترويض الغرائز قبل أن تختطف قرارك.",
    steps: [
      "اشعر بنبضة الغضب/الخوف/الشهوة",
      "سَمِّ الكلب: «هذا كلب الغضب يحاول القيادة»",
      "امنع أي رد فعل لمدة 10 دقائق",
      "راقب الوحش يهدأ تحت سيطرتك",
    ],
  },
  {
    key: "three-alternatives",
    name: "البدائل الثلاثة",
    force: "intellect",
    duration: "10 دقائق",
    description: "تمرين العقل المتحرك على المناورة لا الجمود.",
    steps: [
      "حدد العقبة بوضوح",
      "ولّد 3 بدائل مختلفة جذريًا",
      "اعرضها على الحدس واختر السالك",
    ],
  },
  {
    key: "first-instinct",
    name: "القرار الأول",
    force: "intuition",
    duration: "يومي",
    description: "بناء الثقة في البوصلة الفطرية.",
    steps: [
      "اتخذ قرارًا يوميًا صغيرًا بالإحساس الأول",
      "لا تتراجع ولا تحلل بعد القرار",
      "سجّل النتيجة لاحقًا",
    ],
  },
  {
    key: "emotional-release",
    name: "تفريغ العمق",
    force: "emotion",
    duration: "10–20 دقيقة",
    description: "إخراج العاطفة بوعي قبل أن تتراكم وتنفجر.",
    steps: [
      "اختر قناة: كتابة / صوت / رياضة / صمت",
      "افتح القناة دون رقابة ذهنية",
      "اغلق الجلسة بنفس عميق وصمت دقيقة",
    ],
  },
  {
    key: "deep-work",
    name: "العمل العميق",
    force: "intellect",
    duration: "90 دقيقة",
    description: "جلسة تركيز مغلقة لخدمة المشروع الأهم.",
    steps: [
      "أغلق كل المشتتات",
      "حدد مخرجًا واحدًا لهذه الجلسة",
      "اعمل 90 دقيقة بلا توقف",
      "سجّل المخرج عند الانتهاء",
    ],
  },
];
